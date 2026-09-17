export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user?: SupabaseUser;
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
const SESSION_KEY = "aptus.supabase.session";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

function makeHeaders(accessToken?: string, extra?: HeadersInit) {
  const headers = new Headers(extra);
  headers.set("apikey", supabaseKey);
  headers.set("Authorization", `Bearer ${accessToken || supabaseKey}`);
  return headers;
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.msg || data?.message || data?.error_description || data?.error || `Supabase request failed (${response.status})`) as Error & { code?: string };
    error.code = data?.code || data?.error_code;
    throw error;
  }
  return data;
}

export async function supabaseRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: makeHeaders(accessToken, init.headers),
  });
  return parseResponse(response) as Promise<T>;
}

function readStoredSession(): SupabaseSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(payload: any): SupabaseSession | null {
  if (!payload?.access_token) return null;
  const expiresIn = Number(payload.expires_in || 3600);
  const session: SupabaseSession = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token || "",
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user: payload.user,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function readOAuthHash(): SupabaseSession | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  if (!accessToken) return null;

  const expiresIn = Number(hash.get("expires_in") || 3600);
  const session: SupabaseSession = {
    access_token: accessToken,
    refresh_token: hash.get("refresh_token") || "",
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
  return session;
}

async function refreshSession(session: SupabaseSession): Promise<SupabaseSession | null> {
  if (!session.refresh_token) return null;
  const payload = await supabaseRequest<any>("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  return writeSession(payload);
}

export const SupabaseAuth = {
  getStoredSession: readStoredSession,

  getAccessToken() {
    return readStoredSession()?.access_token;
  },

  async restoreSession(): Promise<{ session: SupabaseSession; user: SupabaseUser } | null> {
    if (!isSupabaseConfigured) return null;

    let session = readOAuthHash() || readStoredSession();
    if (!session) return null;

    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at <= now + 30) {
      session = await refreshSession(session);
      if (!session) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }

    try {
      const user = await supabaseRequest<SupabaseUser>("/auth/v1/user", {}, session.access_token);
      session.user = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { session, user };
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  async signInWithPassword(email: string, password: string) {
    const payload = await supabaseRequest<any>("/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const session = writeSession(payload);
    if (!session) throw new Error("No session returned by Supabase.");
    return { session, user: payload.user as SupabaseUser };
  },

  async signUp(name: string, email: string, password: string) {
    const payload = await supabaseRequest<any>("/auth/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, data: { name } }),
    });
    const session = writeSession(payload);
    return { session, user: payload.user as SupabaseUser | undefined };
  },

  signInWithGoogle() {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const redirectTo = encodeURIComponent(`${siteUrl}${window.location.pathname}`);
    window.location.assign(`${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`);
  },

  async resetPassword(email: string) {
    const redirectTo = encodeURIComponent(`${siteUrl}/?auth=login`);
    await supabaseRequest(`/auth/v1/recover?redirect_to=${redirectTo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  },

  async signOut() {
    const accessToken = readStoredSession()?.access_token;
    try {
      if (accessToken && isSupabaseConfigured) {
        await supabaseRequest("/auth/v1/logout", { method: "POST" }, accessToken);
      }
    } finally {
      localStorage.removeItem(SESSION_KEY);
    }
  },
};
