import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, translations } from "../config/translations";
import { ServerAuth, ServerUser, isServerDatabaseEnabled } from "../config/apiClient";
import { ApiService } from "../services/api";

export type Role = "guest" | "member" | "admin" | "manager";

type AppUser = {
  name: string;
  phone?: string;
  uid?: string;
  photoURL?: string;
  email?: string;
  bio?: string;
};

interface AppContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (category: keyof typeof translations.en, key: string) => string;
  role: Role;
  setRole: (role: Role) => void;
  user: AppUser | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const [role, setRole] = useState<Role>("guest");
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["fa", "en", "tr"].includes(savedLocale)) setLocale(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.body.style.fontFamily = locale === "fa" ? "'Vazirmatn', sans-serif" : "system-ui, -apple-system, sans-serif";
    localStorage.setItem("locale", locale);
  }, [locale]);

  const applyAuthenticatedUser = async (authUser: ServerUser) => {
    let userRole: Role = (authUser.role as Role) || "member";
    let profileName = String(authUser.name || authUser.email || "User");
    let phone = authUser.phone || "";
    let photoURL = authUser.photoURL || "";
    let bio = authUser.bio || "";

    try {
      const profile = authUser.id ? await ApiService.getUserProfile(authUser.id) : null;
      if (profile?.role) userRole = profile.role as Role;
      if (profile?.name) profileName = profile.name;
      phone = profile?.phone || phone;
      photoURL = profile?.photoURL || photoURL;
      bio = profile?.bio || bio;
    } catch (error) {
      console.error("Error fetching local server profile", error);
    }

    setUser({
      name: profileName,
      uid: authUser.id,
      email: authUser.email,
      phone,
      photoURL,
      bio,
    });
    setRole(userRole);
  };

  useEffect(() => {
    let active = true;
    if (!isServerDatabaseEnabled) return;

    ServerAuth.restoreSession()
      .then((result) => {
        if (active && result?.user) return applyAuthenticatedUser(result.user);
      })
      .catch((error) => console.error("Failed to restore server session", error));

    return () => { active = false; };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const result = await ServerAuth.signInWithPassword(email, pass);
    await applyAuthenticatedUser(result.user);
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    const result = await ServerAuth.signUp(name, email, pass);
    await applyAuthenticatedUser(result.user);
  };

  const resetPassword = async (email: string) => {
    await ServerAuth.resetPassword(email);
  };

  const refreshUserProfile = async () => {
    if (!user?.uid) return;
    const profile = await ApiService.getUserProfile(user.uid);
    if (!profile) return;
    setUser((current) => current ? {
      ...current,
      name: profile.name || current.name,
      phone: profile.phone || "",
      photoURL: profile.photoURL || "",
      bio: profile.bio || "",
    } : current);
    if (profile.role) setRole(profile.role as Role);
  };

  const logout = async () => {
    await ServerAuth.signOut();
    setUser(null);
    setRole("guest");
  };

  const t = (category: keyof typeof translations.en, key: string): string => {
    // @ts-ignore dynamic translation lookup is intentionally tolerant of CMS keys
    return translations[locale][category]?.[key] || key;
  };

  return (
    <AppContext.Provider value={{ locale, setLocale, t, role, setRole, user, loginWithEmail, signUpWithEmail, resetPassword, refreshUserProfile, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
