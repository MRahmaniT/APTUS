import { apiRequest, isServerDatabaseEnabled, ServerAuth } from "../config/apiClient";
import { CONTENT_SEED } from "../data/contentSeed";
import { LOCALIZED_CONTENT_SEED } from "../data/localizedContentSeed";
import { ContentDraft, ContentItem, ContentType } from "../models";

const LOCAL_CONTENT_KEY = "aptus.cms.content.v3";
const BASE_CONTENT = [...CONTENT_SEED, ...LOCALIZED_CONTENT_SEED];

function cloneBaseContent() {
  return BASE_CONTENT.map((item) => ({ ...item, media: [...item.media] }));
}

function getLocalContent(): ContentItem[] {
  try {
    const stored = localStorage.getItem(LOCAL_CONTENT_KEY);
    return stored ? JSON.parse(stored) : cloneBaseContent();
  } catch {
    return cloneBaseContent();
  }
}

function saveLocalContent(items: ContentItem[]) {
  localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(items));
}

function sortContent(items: ContentItem[]) {
  return [...items].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

function listLocal(type: ContentType, locale: string, includeDrafts = false) {
  return sortContent(getLocalContent().filter(
    (item) => item.type === type && item.locale === locale && (includeDrafts || item.status === "published"),
  ));
}

function getLocalBySlug(type: ContentType, slug: string, locale: string, includeDrafts = false) {
  return getLocalContent().find(
    (item) => item.type === type && item.slug === slug && item.locale === locale && (includeDrafts || item.status === "published"),
  ) || null;
}

function mergeBySlug(primary: ContentItem[], baseline: ContentItem[]) {
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

async function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export const ContentRepository = {
  async list(type: ContentType, locale: string, includeDrafts = false): Promise<ContentItem[]> {
    if (!isServerDatabaseEnabled) return listLocal(type, locale, includeDrafts);

    try {
      const rows = await apiRequest<ContentItem[]>(
        `/content?type=${encodeURIComponent(type)}&locale=${encodeURIComponent(locale)}&includeDrafts=${includeDrafts ? "true" : "false"}`,
      );
      return sortContent(mergeBySlug(rows, listLocal(type, locale, includeDrafts)));
    } catch (error) {
      if (includeDrafts) throw error;
      console.warn("APTUS API unavailable; showing bundled content.", error);
      return listLocal(type, locale, includeDrafts);
    }
  },

  async getBySlug(type: ContentType, slug: string, locale: string, includeDrafts = false): Promise<ContentItem | null> {
    if (!isServerDatabaseEnabled) return getLocalBySlug(type, slug, locale, includeDrafts);

    try {
      return await apiRequest<ContentItem>(
        `/content/${encodeURIComponent(type)}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}&includeDrafts=${includeDrafts ? "true" : "false"}`,
      );
    } catch (error: any) {
      if (error?.status === 404 || !includeDrafts) return getLocalBySlug(type, slug, locale, includeDrafts);
      throw error;
    }
  },

  async upsert(item: ContentDraft): Promise<ContentItem> {
    if (!isServerDatabaseEnabled) {
      const items = getLocalContent();
      const id = item.id || `local-${crypto.randomUUID()}`;
      const value: ContentItem = {
        ...item,
        id,
        publishedAt: item.status === "published" ? (item.publishedAt || new Date().toISOString()) : item.publishedAt,
        createdAt: items.find((entry) => entry.id === id)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const index = items.findIndex((entry) => entry.id === id);
      if (index >= 0) items[index] = value;
      else items.unshift(value);
      saveLocalContent(items);
      return value;
    }

    if (!ServerAuth.getAccessToken()) throw new Error("Sign in as an editor before saving content.");
    const isDatabaseItem = Boolean(item.id && !item.id.startsWith("seed-") && !item.id.startsWith("local-"));
    return apiRequest<ContentItem>(isDatabaseItem ? `/content/${encodeURIComponent(item.id!)}` : "/content", {
      method: isDatabaseItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },

  async remove(id: string) {
    if (!isServerDatabaseEnabled) {
      saveLocalContent(getLocalContent().filter((item) => item.id !== id));
      return;
    }
    if (id.startsWith("seed-") || id.startsWith("local-")) {
      throw new Error("Bundled seed content cannot be deleted until it has been saved to the server database.");
    }
    if (!ServerAuth.getAccessToken()) throw new Error("Sign in as an editor before deleting content.");
    await apiRequest(`/content/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async uploadMedia(file: File): Promise<string> {
    if (!isServerDatabaseEnabled) return readAsDataUrl(file);
    if (!ServerAuth.getAccessToken()) throw new Error("Sign in as an editor before uploading media.");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const result = await apiRequest<{ url: string }>("/media", {
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
