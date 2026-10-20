import { apiRequest, isServerDatabaseEnabled } from "../config/apiClient";
const LOCAL_SETTINGS_PREFIX = "aptus.site-setting.";
function mapProfile(row) {
    if (!row)
        return null;
    return {
        ...row,
        uid: row.uid || row.id,
        name: row.name || "User",
        phone: row.phone || "",
        photoURL: row.photoURL || "",
        bio: row.bio || "",
    };
}
export const ServerRepository = {
    async getUserProfile(uid) {
        if (!isServerDatabaseEnabled)
            return null;
        return mapProfile(await apiRequest(`/profile/${encodeURIComponent(uid)}`));
    },
    async getAllUsers() {
        if (!isServerDatabaseEnabled)
            return [];
        const rows = await apiRequest("/profiles");
        return rows.map(mapProfile);
    },
    async updateUserRole(uid, role) {
        if (!isServerDatabaseEnabled)
            return;
        await apiRequest(`/profiles/${encodeURIComponent(uid)}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
    },
    async updateUserProfile(uid, data) {
        if (!isServerDatabaseEnabled)
            throw new Error("Server database mode is disabled.");
        const row = await apiRequest(`/profile/${encodeURIComponent(uid)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return mapProfile(row);
    },
    async trackPageView(date, path = "/") {
        if (!isServerDatabaseEnabled)
            return;
        await apiRequest("/analytics/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, path }),
        });
    },
    async getAnalytics(date) {
        if (!isServerDatabaseEnabled)
            return 0;
        const result = await apiRequest(`/analytics?date=${encodeURIComponent(date)}`);
        return Number(result.views || 0);
    },
    async getSiteSetting(key) {
        if (!isServerDatabaseEnabled) {
            try {
                const raw = localStorage.getItem(`${LOCAL_SETTINGS_PREFIX}${key}`);
                return raw ? JSON.parse(raw) : null;
            }
            catch {
                return null;
            }
        }
        try {
            return await apiRequest(`/settings?key=${encodeURIComponent(key)}`);
        }
        catch (error) {
            if (error?.status === 404)
                return null;
            throw error;
        }
    },
    async updateSiteSetting(key, value) {
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
