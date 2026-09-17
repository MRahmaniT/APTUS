import { SupabaseRepository } from "../repositories/SupabaseRepository";

export const ApiService = {
  trackPageView: async (date: string, path = window.location.pathname) => {
    try {
      await SupabaseRepository.trackPageView(date, path);
    } catch (e) {
      console.error("Failed to track view", e);
    }
  },

  getAnalytics: async (date: string) => {
    try {
      return await SupabaseRepository.getAnalytics(date);
    } catch (e) {
      console.error("Failed to fetch analytics", e);
      throw e;
    }
  },

  getCMSContent: async <T = any>(page: string): Promise<T | null> => {
    try {
      return await SupabaseRepository.getSiteSetting<T>(page);
    } catch (e) {
      console.error(`Failed to fetch CMS for ${page}`, e);
      throw e;
    }
  },

  updateCMSContent: async (page: string, data: Record<string, unknown>) => {
    try {
      await SupabaseRepository.updateSiteSetting(page, data);
    } catch (e) {
      console.error(`Failed to update CMS for ${page}`, e);
      throw e;
    }
  },

  getAllUsers: async () => {
    try {
      return await SupabaseRepository.getAllUsers();
    } catch (e) {
      console.error("Failed to fetch users", e);
      throw e;
    }
  },

  updateUserRole: async (uid: string, role: string) => {
    try {
      await SupabaseRepository.updateUserRole(uid, role);
    } catch (e) {
      console.error(`Failed to update role for ${uid}`, e);
      throw e;
    }
  },

  getUserProfile: async (uid: string) => {
    try {
      return await SupabaseRepository.getUserProfile(uid);
    } catch (e) {
      console.error(`Failed to fetch profile for ${uid}`, e);
      throw e;
    }
  },

  updateUserProfile: async (uid: string, data: { name: string; phone?: string; photoURL?: string; bio?: string }) => {
    try {
      return await SupabaseRepository.updateUserProfile(uid, data);
    } catch (e) {
      console.error(`Failed to update profile for ${uid}`, e);
      throw e;
    }
  },
};
