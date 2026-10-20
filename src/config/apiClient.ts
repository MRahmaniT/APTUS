export interface ServerUser {
  id: string;
  email?: string;
  name?: string;
  role?: "member" | "admin" | "manager";
  phone?: string;
  photoURL?: string;
  bio?: string;
}

export interface ServerSession {
  access_token: string;
  expires_at: number;
  user?: ServerUser;
}

const apiBase = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");
const dataMode = import.meta.env.VITE_DATA_MODE || "server";
const SESSION_KEY = "aptus.server.session";

export const isServerDatabaseEnabled = dataMode !== "local";

function readStoredSession(): ServerSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session: ServerSession | null) {
  if (!session?.access_token) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }
  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || `Server request failed (${response.status})`;
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function apiRequest<T = unknown>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if (!isServerDatabaseEnabled) throw new Error("Server database mode is disabled.");
  const headers = new Headers(init.headers);
  const accessToken = token || readStoredSession()?.access_token;
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${apiBase}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  });
  return parseResponse(response) as Promise<T>;
}

export const ServerAuth = {
  getStoredSession: readStoredSession,

  getAccessToken() {
    return readStoredSession()?.access_token;
  },

  async restoreSession(): Promise<{ session: ServerSession; user: ServerUser } | null> {
    if (!isServerDatabaseEnabled) return null;
    const session = readStoredSession();
    if (!session?.access_token) return null;
    if (session.expires_at && session.expires_at <= Math.floor(Date.now() / 1000)) {
      writeSession(null);
      return null;
    }
    try {
      const result = await apiRequest<{ user: ServerUser }>("/auth/me", {}, session.access_token);
      const next = { ...session, user: result.user };
      writeSession(next);
      return { session: next, user: result.user };
    } catch {
      writeSession(null);
      return null;
    }
  },

  async signInWithPassword(email: string, password: string) {
    const payload = await apiRequest<{ session: ServerSession; user: ServerUser }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    writeSession({ ...payload.session, user: payload.user });
    return payload;
  },

  async signUp(name: string, email: string, password: string) {
    const payload = await apiRequest<{ session: ServerSession; user: ServerUser }>("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    writeSession({ ...payload.session, user: payload.user });
    return payload;
  },

  async resetPassword(email: string) {
    await apiRequest("/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  },

  async signOut() {
    const token = readStoredSession()?.access_token;
    try {
      if (token && isServerDatabaseEnabled) {
        await apiRequest("/auth/logout", { method: "POST" }, token);
      }
    } finally {
      writeSession(null);
    }
  },
};
