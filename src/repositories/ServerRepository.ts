import { apiRequest, isServerDatabaseEnabled } from "../config/apiClient";

const LOCAL_SETTINGS_PREFIX = "aptus.site-setting.";

export const ServerRepository = {
  async getUserProfile(uid: string) {
    if (!isServerDatabaseEnabled) return null;
    return apiRequest<any>(`/profile/${encodeURIComponent(uid)}`);
  },

  async getAllUsers() {
    if (!isServerDatabaseEnabled) return [];
    return apiRequest<any[]>("/profiles");
  },

  async updateUserRole(uid: string, role: string) {
    if (!isServerDatabaseEnabled) return;
    await apiRequest(`/profiles/${encodeURIComponent(uid)}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  },

  async updateUserProfile(uid: string, data: { name: string; phone?: string; photoURL?: string; bio?: string }) {
    if (!isServerDatabaseEnabled) throw new Error("Server database mode is disabled.");
    return apiRequest<any>(`/profile/${encodeURIComponent(uid)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async trackPageView(date: string, path = "/") {
    if (!isServerDatabaseEnabled) return;
    await apiRequest("/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, path }),
    });
  },

  async getAnalytics(date: string) {
    if (!isServerDatabaseEnabled) return 0;
    const result = await apiRequest<{ views: number }>(`/analytics?date=${encodeURIComponent(date)}`);
    return Number(result.views || 0);
  },

  async getSiteSetting<T = Record<string, unknown>>(key: string): Promise<T | null> {
    if (!isServerDatabaseEnabled) {
      try {
        const raw = localStorage.getItem(`${LOCAL_SETTINGS_PREFIX}${key}`);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    try {
      return await apiRequest<T>(`/settings?key=${encodeURIComponent(key)}`);
    } catch (error: any) {
      if (error?.status === 404) return null;
      throw error;
    }
  },

  async updateSiteSetting(key: string, value: Record<string, unknown>) {
    if (!isServerDatabaseEnabled) {
      localStorage.setItem(`${LOCAL_SETTINGS_PREFIX}${key}`, JSON.stringify(value));
      return;
    }
    await apiRequest("/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  },
};
