import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { type Locale, translations } from "../config/translations";
import { ServerAuth, type ServerUser } from "../config/apiClient";
import { ACTIVE_LOCALE, LANGUAGE_SWITCH_ENABLED } from "../config/site";

export type Role = "guest" | "member" | "admin" | "manager";
type AppUser = Omit<ServerUser, "id"> & { uid: string };

interface AppContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: (category: keyof typeof translations.en, key: string) => string;
  role: Role;
  isEditor: boolean;
  authReady: boolean;
  user: AppUser | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithCode: (challengeId: string, code: string, name: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const appUser = ({id, ...profile}: ServerUser): AppUser => ({ uid: id, ...profile });

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale;
    return LANGUAGE_SWITCH_ENABLED && ["fa", "en", "tr"].includes(saved) ? saved : ACTIVE_LOCALE;
  });
  const [user, setUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(() => !ServerAuth.getAccessToken());
  const version = useRef(0);
  const role = user ? user.role || "member" : "guest";
  const isEditor = role === "admin" || role === "manager";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.body.style.fontFamily = locale === "fa" ? "'Vazirmatn', sans-serif" : "system-ui, -apple-system, sans-serif";
    localStorage.setItem("locale", locale);
  }, [locale]);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const attempt = ++version.current;
      setAuthReady(!ServerAuth.getAccessToken());
      const result = await ServerAuth.restoreSession();
      if (!active || version.current !== attempt) return;
      setUser(result?.user ? appUser(result.user) : null);
      setAuthReady(true);
    };
    const unsubscribe = ServerAuth.onSessionChange(() => { setUser(null); void restore(); });
    void restore();
    return () => { active = false; unsubscribe(); };
  }, []);

  function acceptUser(profile: ServerUser) {
    version.current++;
    setUser(appUser(profile));
    setAuthReady(true);
  }

  const loginWithEmail = async (email: string, pass: string) => {
    acceptUser((await ServerAuth.signInWithPassword(email, pass)).user);
  };
  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    acceptUser((await ServerAuth.signUp(name, email, pass)).user);
  };
  const loginWithCode = async (challengeId: string, code: string, name: string) => {
    acceptUser((await ServerAuth.verifyCode(challengeId, code, name)).user);
  };
  const refreshUserProfile = async () => {
    const attempt = version.current;
    const result = await ServerAuth.restoreSession();
    if (attempt === version.current) setUser(result?.user ? appUser(result.user) : null);
  };
  const logout = async () => {
    version.current++;
    const request = ServerAuth.signOut();
    setUser(null);
    setAuthReady(true);
    try { await request; } catch { /* The browser session was already cleared. */ }
  };
  const setLocale = (lang: Locale) => { if (LANGUAGE_SWITCH_ENABLED) updateLocale(lang); };
  const t = (category: keyof typeof translations.en, key: string): string => {
    const entries = translations[locale][category] as Record<string, string> | undefined;
    return entries?.[key] || key;
  };

  return <AppContext.Provider value={{
    locale, setLocale, t, role, isEditor, authReady, user,
    loginWithEmail, signUpWithEmail, loginWithCode, refreshUserProfile, logout,
  }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
