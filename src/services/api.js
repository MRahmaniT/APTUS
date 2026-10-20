import { ServerRepository } from "../repositories/ServerRepository";
export const ApiService = {
    trackPageView: async (date, path = window.location.pathname) => {
        try {
            await ServerRepository.trackPageView(date, path);
        }
        catch (e) {
            console.error("Failed to track view", e);
        }
    },
    getAnalytics: async (date) => {
        try {
            return await ServerRepository.getAnalytics(date);
        }
        catch (e) {
            console.error("Failed to fetch analytics", e);
            throw e;
        }
    },
    getCMSContent: async (page) => {
        try {
            return await ServerRepository.getSiteSetting(page);
        }
        catch (e) {
            console.error(`Failed to fetch CMS for ${page}`, e);
            throw e;
        }
    },
    updateCMSContent: async (page, data) => {
        try {
            await ServerRepository.updateSiteSetting(page, data);
        }
        catch (e) {
            console.error(`Failed to update CMS for ${page}`, e);
            throw e;
        }
    },
    getAllUsers: async () => {
        try {
            return await ServerRepository.getAllUsers();
        }
        catch (e) {
            console.error("Failed to fetch users", e);
            throw e;
        }
    },
    updateUserRole: async (uid, role) => {
        try {
            await ServerRepository.updateUserRole(uid, role);
        }
        catch (e) {
            console.error(`Failed to update role for ${uid}`, e);
            throw e;
        }
    },
    getUserProfile: async (uid) => {
        try {
            return await ServerRepository.getUserProfile(uid);
        }
        catch (e) {
            console.error(`Failed to fetch profile for ${uid}`, e);
            throw e;
        }
    },
    updateUserProfile: async (uid, data) => {
        try {
            return await ServerRepository.updateUserProfile(uid, data);
        }
        catch (e) {
            console.error(`Failed to update profile for ${uid}`, e);
            throw e;
        }
    },
};
