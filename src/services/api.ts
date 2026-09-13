import { FirebaseRepository } from "../repositories/FirebaseRepository";

export const ApiService = {
  // Analytics Endpoints
  trackPageView: async (date: string) => {
    try {
      await FirebaseRepository.saveDocument("analytics", date, { views: 1, date }); // In a real Spring Boot app, this would call your pure Java backend
    } catch (e) {
      console.error("Failed to track view", e);
    }
  },

  getAnalytics: async (date: string) => {
    try {
      const data = await FirebaseRepository.getDocument("analytics", date);
      return data ? (data.views || 0) : 0;
    } catch (e) {
      console.error("Failed to fetch analytics", e);
      throw e;
    }
  },

  // CMS Endpoints
  getCMSContent: async (page: string) => {
    try {
      const data = await FirebaseRepository.getDocument("cms", page);
      return data;
    } catch (e) {
      console.error(`Failed to fetch CMS for ${page}`, e);
      throw e;
    }
  },

  updateCMSContent: async (page: string, data: any) => {
    try {
      await FirebaseRepository.saveDocument("cms", page, data);
    } catch (e) {
      console.error(`Failed to update CMS for ${page}`, e);
      throw e;
    }
  },

  // User Management Endpoints
  getAllUsers: async () => {
    try {
      return await FirebaseRepository.getAllDocuments("users");
    } catch (e) {
      console.error("Failed to fetch users", e);
      throw e;
    }
  },

  updateUserRole: async (uid: string, role: string) => {
    try {
      await FirebaseRepository.saveDocument("users", uid, { role });
    } catch (e) {
      console.error(`Failed to update role for ${uid}`, e);
      throw e;
    }
  },

  getUserProfile: async (uid: string) => {
    try {
      return await FirebaseRepository.getDocument("users", uid);
    } catch (e) {
      console.error(`Failed to fetch profile for ${uid}`, e);
      throw e;
    }
  }
};
