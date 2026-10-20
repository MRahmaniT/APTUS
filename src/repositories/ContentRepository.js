import { catalogAliases } from "../catalog/adapter.js";
import { apiRequest, isServerDatabaseEnabled, ServerAuth } from "../config/apiClient";
import { CONTENT_SEED } from "../data/contentSeed";
import { LOCALIZED_CONTENT_SEED } from "../data/localizedContentSeed";
const LOCAL_CONTENT_KEY = "aptus.cms.content.v3";
const BASE_CONTENT = [...CONTENT_SEED, ...LOCALIZED_CONTENT_SEED];
function cloneBaseContent() {
    return BASE_CONTENT.map((item) => ({ ...item, media: [...item.media] }));
}
function getLocalContent() {
    try {
        const stored = localStorage.getItem(LOCAL_CONTENT_KEY);
        if (!stored) return cloneBaseContent();
        const custom = JSON.parse(stored).filter(item => !String(item.id).startsWith("seed-"));
        const keys = new Set(custom.map(item => [item.type,item.slug,item.locale].join(":")));
        return [...custom,...cloneBaseContent().filter(item => !keys.has([item.type,item.slug,item.locale].join(":")))];
    }
    catch {
        return cloneBaseContent();
    }
}
function saveLocalContent(items) {
    localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(items));
}
function sortContent(items) {
    return [...items].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}
function listLocal(type, locale, includeDrafts = false) {
    return sortContent(getLocalContent().filter((item) => item.type === type && item.locale === locale && (includeDrafts || item.status === "published")));
}
function getLocalBySlug(type, slug, locale, includeDrafts = false) {
    return getLocalContent().find((item) => item.type === type && item.slug === slug && item.locale === locale && (includeDrafts || item.status === "published")) || null;
}
function mergeBySlug(primary, baseline) {
    const result = [...primary];
    const existing = new Set(primary.map((item) => item.slug));
    for (const item of baseline) {
        if (!existing.has(item.slug)) {
            result.push(item);
            existing.add(item.slug);
        }
    }
    return result;
}
async function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Could not read file"));
        reader.readAsDataURL(file);
    });
}
export const ContentRepository = {
    async list(type, locale, includeDrafts = false) {
        if (!isServerDatabaseEnabled)
            return listLocal(type, locale, includeDrafts);
        try {
            const rows = await apiRequest(`/content?type=${encodeURIComponent(type)}&locale=${encodeURIComponent(locale)}&includeDrafts=${includeDrafts ? "true" : "false"}`);
            return sortContent(mergeBySlug(rows, listLocal(type, locale, includeDrafts)));
        }
        catch (error) {
            if (includeDrafts)
                throw error;
            console.warn("APTUS API unavailable; showing bundled content.", error);
            return listLocal(type, locale, includeDrafts);
        }
    },
    async getBySlug(type, slug, locale, includeDrafts = false) {
        if (type === "product") slug = catalogAliases[slug] || slug;
        if (!isServerDatabaseEnabled)
            return getLocalBySlug(type, slug, locale, includeDrafts);
        try {
            return await apiRequest(`/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}&includeDrafts=${includeDrafts ? "true" : "false"}`);
        }
        catch (error) {
            if (error?.status === 404 || !includeDrafts)
                return getLocalBySlug(type, slug, locale, includeDrafts);
            throw error;
        }
    },
    async upsert(item) {
        if (!isServerDatabaseEnabled) {
            const items = getLocalContent();
            const id = item.id || `local-${crypto.randomUUID()}`;
            const value = {
                ...item,
                id,
                publishedAt: item.status === "published" ? (item.publishedAt || new Date().toISOString()) : item.publishedAt,
                createdAt: items.find((entry) => entry.id === id)?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const index = items.findIndex((entry) => entry.id === id);
            if (index >= 0)
                items[index] = value;
            else
                items.unshift(value);
            saveLocalContent(items);
            return value;
        }
        if (!ServerAuth.getAccessToken())
            throw new Error("Sign in as an editor before saving content.");
        const isDatabaseItem = Boolean(item.id && !item.id.startsWith("seed-") && !item.id.startsWith("local-"));
        return apiRequest(isDatabaseItem ? `/content/${encodeURIComponent(item.id)}` : "/content", {
            method: isDatabaseItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
    },
    async remove(id) {
        if (!isServerDatabaseEnabled) {
            saveLocalContent(getLocalContent().filter((item) => item.id !== id));
            return;
        }
        if (id.startsWith("seed-") || id.startsWith("local-")) {
            throw new Error("Bundled seed content cannot be deleted until it has been saved to the server database.");
        }
        if (!ServerAuth.getAccessToken())
            throw new Error("Sign in as an editor before deleting content.");
        await apiRequest(`/content/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    async uploadMedia(file) {
        if (!isServerDatabaseEnabled)
            return readAsDataUrl(file);
        if (!ServerAuth.getAccessToken())
            throw new Error("Sign in as an editor before uploading media.");
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
        const result = await apiRequest("/media", {
            method: "POST",
            headers: {
                "Content-Type": file.type || "application/octet-stream",
                "x-file-type": file.type || "application/octet-stream",
                "x-file-name": safeName || "upload.bin",
            },
            body: file,
        });
        return result.url;
    },
};
