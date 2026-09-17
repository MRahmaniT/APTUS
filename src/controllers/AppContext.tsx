import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, translations } from "../config/translations";
import { SupabaseAuth, SupabaseUser, isSupabaseConfigured } from "../config/supabase";
import { ApiService } from "../services/api";

export type Role = "guest" | "member" | "admin" | "manager";

interface AppContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (category: keyof typeof translations.en, key: string) => string;
  role: Role;
  setRole: (role: Role) => void;
  user: { name: string; phone?: string; uid?: string; photoURL?: string; email?: string } | null;
  login: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fa");
  const [role, setRole] = useState<Role>("guest");
  const [user, setUser] = useState<{ name: string; phone?: string; uid?: string; photoURL?: string; email?: string } | null>(null);

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

  const applyAuthenticatedUser = async (authUser: SupabaseUser) => {
    let userRole: Role = "member";
    let profileName = String(authUser.user_metadata?.name || authUser.email || "User");

    try {
      const profile = await ApiService.getUserProfile(authUser.id);
      if (profile?.role) userRole = profile.role as Role;
      if (profile?.name) profileName = profile.name;
    } catch (error) {
      console.error("Error fetching Supabase profile", error);
    }

    setUser({
      name: profileName,
      uid: authUser.id,
      email: authUser.email,
    });
    setRole(userRole);
  };

  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured) return;

    SupabaseAuth.restoreSession()
      .then((result) => {
        if (active && result?.user) return applyAuthenticatedUser(result.user);
      })
      .catch((error) => console.error("Failed to restore Supabase session", error));

    return () => { active = false; };
  }, []);

  const login = () => {
    SupabaseAuth.signInWithGoogle();
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const result = await SupabaseAuth.signInWithPassword(email, pass);
    await applyAuthenticatedUser(result.user);
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    const result = await SupabaseAuth.signUp(name, email, pass);
    if (result.session && result.user) {
      await applyAuthenticatedUser(result.user);
    }
  };

  const resetPassword = async (email: string) => {
    await SupabaseAuth.resetPassword(email);
  };

  const logout = async () => {
    await SupabaseAuth.signOut();
    setUser(null);
    setRole("guest");
  };

  const t = (category: keyof typeof translations.en, key: string): string => {
    // @ts-ignore dynamic translation lookup is intentionally tolerant of CMS keys
    return translations[locale][category]?.[key] || key;
  };

  return (
    <AppContext.Provider value={{ locale, setLocale, t, role, setRole, user, login, loginWithEmail, signUpWithEmail, resetPassword, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
