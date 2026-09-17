import { SupabaseAuth, isSupabaseConfigured, supabaseRequest } from "../config/supabase";

const LOCAL_SETTINGS_PREFIX = "aptus.site-setting.";

function encode(value: string) {
  return encodeURIComponent(value);
}

export const SupabaseRepository = {
  async getUserProfile(uid: string) {
    if (!isSupabaseConfigured) return null;
    const token = SupabaseAuth.getAccessToken();
    if (!token) return null;
    const rows = await supabaseRequest<any[]>(`/rest/v1/profiles?id=eq.${encode(uid)}&select=*`, {}, token);
    const row = rows[0];
    return row ? { uid: row.id, name: row.name || "User", role: row.role } : null;
  },

  async getAllUsers() {
    if (!isSupabaseConfigured) return [];
    const token = SupabaseAuth.getAccessToken();
    if (!token) return [];
    const rows = await supabaseRequest<any[]>("/rest/v1/profiles?select=*&order=created_at.desc", {}, token);
    return rows.map((row) => ({ uid: row.id, name: row.name || "User", role: row.role }));
  },

  async updateUserRole(uid: string, role: string) {
    if (!isSupabaseConfigured) return;
    const token = SupabaseAuth.getAccessToken();
    if (!token) throw new Error("Authentication is required to change roles.");
    await supabaseRequest(`/rest/v1/profiles?id=eq.${encode(uid)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ role }),
    }, token);
  },

  async trackPageView(date: string, path = "/") {
    if (!isSupabaseConfigured) return;
    await supabaseRequest("/rest/v1/rpc/increment_page_view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ view_day: date, view_path: path }),
    });
  },

  async getAnalytics(date: string) {
    if (!isSupabaseConfigured) return 0;
    const token = SupabaseAuth.getAccessToken();
    if (!token) return 0;
    const rows = await supabaseRequest<Array<{ views: number }>>(`/rest/v1/analytics_daily?day=eq.${encode(date)}&select=views`, {}, token);
    return rows.reduce((total, row) => total + Number(row.views || 0), 0);
  },

  async getSiteSetting<T = Record<string, unknown>>(key: string): Promise<T | null> {
    if (!isSupabaseConfigured) {
      try {
        const raw = localStorage.getItem(`${LOCAL_SETTINGS_PREFIX}${key}`);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    const rows = await supabaseRequest<Array<{ value: T }>>(`/rest/v1/site_settings?key=eq.${encode(key)}&select=value`);
    return rows[0]?.value || null;
  },

  async updateSiteSetting(key: string, value: Record<string, unknown>) {
    if (!isSupabaseConfigured) {
      localStorage.setItem(`${LOCAL_SETTINGS_PREFIX}${key}`, JSON.stringify(value));
      return;
    }
    const token = SupabaseAuth.getAccessToken();
    if (!token) throw new Error("Authentication is required to edit site settings.");
    await supabaseRequest("/rest/v1/site_settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key, value }),
    }, token);
  },
};
