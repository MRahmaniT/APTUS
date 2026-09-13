import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations } from "../config/translations";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from "firebase/auth";
import { ApiService } from "../services/api";

export type Role = "guest" | "member" | "admin" | "manager";

interface AppContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (category: keyof typeof translations.en, key: string) => string;
  role: Role;
  setRole: (role: Role) => void;
  user: { name: string; phone?: string, uid?: string, photoURL?: string, email?: string } | null;
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
  const [user, setUser] = useState<{ name: string; phone?: string, uid?: string, photoURL?: string, email?: string } | null>(null);

  // Load language preference
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["fa", "en", "tr"].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  // Sync language with document
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    if (locale === "fa") {
      document.body.style.fontFamily = "'Vazirmatn', sans-serif";
    } else {
      document.body.style.fontFamily = "system-ui, -apple-system, sans-serif";
    }
    localStorage.setItem("locale", locale);
  }, [locale]);

  // Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userRole = "member";
        try {
          const userDoc = await ApiService.getUserProfile(firebaseUser.uid);
          
          if (!userDoc) {
            // New user, create profile
            if (firebaseUser.email === "admin@aptus.com" || firebaseUser.email === "hesamasadinezhad@gmail.com") {
              userRole = "manager"; // Make the owner a manager automatically
            }
            
            await ApiService.updateUserRole(firebaseUser.uid, userRole);
          } else {
            userRole = userDoc.role || "member";
          }
        } catch (e) {
          console.error("Error fetching user profile", e);
        }

        setUser({ 
          name: firebaseUser.displayName || firebaseUser.email || "User", 
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL || undefined,
          email: firebaseUser.email || undefined
        });
        setRole(userRole as Role);
      } else {
        setUser(null);
        setRole("guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      console.error("Login with email failed", e);
      throw e;
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCred.user, { displayName: name });
      
      // Setup role immediately
      const defaultRole = (email === "admin@aptus.com" || email === "hesamasadinezhad@gmail.com") ? "manager" : "member";
      await ApiService.updateUserRole(userCred.user.uid, defaultRole);

      setUser({
        name,
        uid: userCred.user.uid,
        email
      });
      setRole(defaultRole as Role);
    } catch (e: any) {
      console.error("Signup failed", e);
      throw e;
    }
  };

  const resetPassword = async (email: string) => {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e: any) {
      console.error("Password reset failed", e);
      throw e;
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setRole("guest");
  };

  const t = (category: keyof typeof translations.en, key: string): string => {
    // @ts-ignore
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
