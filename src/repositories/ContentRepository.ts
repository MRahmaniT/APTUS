import { SupabaseAuth, isSupabaseConfigured, supabaseRequest } from "../config/supabase";
import { CONTENT_SEED } from "../data/contentSeed";
import { LOCALIZED_CONTENT_SEED } from "../data/localizedContentSeed";
import { ContentDraft, ContentItem, ContentMedia, ContentType } from "../models";

const LOCAL_CONTENT_KEY = "aptus.cms.content.v2";
const BASE_CONTENT = [...CONTENT_SEED, ...LOCALIZED_CONTENT_SEED];

function getLocalContent(): ContentItem[] {
  try {
    const stored = localStorage.getItem(LOCAL_CONTENT_KEY);
    return stored ? JSON.parse(stored) : BASE_CONTENT.map((item) => ({ ...item, media: [...item.media] }));
  } catch {
    return BASE_CONTENT.map((item) => ({ ...item, media: [...item.media] }));
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

function mediaFromDb(row: any): ContentMedia {
  return {
    id: row.id,
    mediaType: row.media_type,
    url: row.url,
    caption: row.caption || undefined,
    alt: row.alt || undefined,
    sortOrder: row.sort_order || 0,
  };
}

function itemFromDb(row: any): ContentItem {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    locale: row.locale,
    status: row.status,
    templateKey: row.template_key,
    title: row.title,
    abstract: row.abstract || "",
    body: row.body || "",
    coverImage: row.cover_image || "",
    category: row.category || undefined,
    publishedAt: row.published_at || undefined,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    specs: row.specs || {},
    cta: row.cta || {},
    seo: row.seo || {},
    media: (row.content_media || []).map(mediaFromDb).sort((a: ContentMedia, b: ContentMedia) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function itemToDb(item: ContentDraft) {
  return {
    type: item.type,
    slug: item.slug,
    locale: item.locale,
    status: item.status,
    template_key: item.templateKey,
    title: item.title,
    abstract: item.abstract,
    body: item.body,
    cover_image: item.coverImage || null,
    category: item.category || null,
    published_at: item.status === "published" ? (item.publishedAt || new Date().toISOString()) : null,
    highlights: item.highlights || [],
    specs: item.specs || {},
    cta: item.cta || {},
    seo: item.seo || {},
  };
}

function encode(value: string) {
  return encodeURIComponent(value);
}

function mergeBySlug(primary: ContentItem[], fallback: ContentItem[]) {
  const result = [...primary];
  const existing = new Set(primary.map((item) => item.slug));
  fallback.forEach((item) => {
    if (!existing.has(item.slug)) {
      result.push(item);
      existing.add(item.slug);
    }
  });
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
    if (!isSupabaseConfigured) return listLocal(type, locale, includeDrafts);

    const accessToken = includeDrafts ? SupabaseAuth.getAccessToken() : undefined;
    const statusFilter = includeDrafts ? "" : "&status=eq.published";
    const rows = await supabaseRequest<any[]>(
      `/rest/v1/content_items?select=*,content_media(*)&type=eq.${encode(type)}&locale=eq.${encode(locale)}${statusFilter}&order=published_at.desc.nullslast`,
      {},
      accessToken,
    );

    const databaseItems = rows.map(itemFromDb);
    return sortContent(mergeBySlug(databaseItems, listLocal(type, locale, includeDrafts)));
  },

  async getBySlug(type: ContentType, slug: string, locale: string, includeDrafts = false): Promise<ContentItem | null> {
    if (!isSupabaseConfigured) return getLocalBySlug(type, slug, locale, includeDrafts);

    const accessToken = includeDrafts ? SupabaseAuth.getAccessToken() : undefined;
    const statusFilter = includeDrafts ? "" : "&status=eq.published";
    const rows = await supabaseRequest<any[]>(
      `/rest/v1/content_items?select=*,content_media(*)&type=eq.${encode(type)}&slug=eq.${encode(slug)}&locale=eq.${encode(locale)}${statusFilter}&limit=1`,
      {},
      accessToken,
    );

    return rows[0] ? itemFromDb(rows[0]) : getLocalBySlug(type, slug, locale, includeDrafts);
  },

  async upsert(item: ContentDraft): Promise<ContentItem> {
    if (!isSupabaseConfigured) {
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

    const accessToken = SupabaseAuth.getAccessToken();
    if (!accessToken) throw new Error("Sign in as an editor before saving content.");

    const payload = itemToDb(item);
    let rows: any[];
    if (item.id && !item.id.startsWith("seed-") && !item.id.startsWith("local-")) {
      rows = await supabaseRequest<any[]>(`/rest/v1/content_items?id=eq.${encode(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(payload),
      }, accessToken);
    } else {
      rows = await supabaseRequest<any[]>("/rest/v1/content_items", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(payload),
      }, accessToken);
    }

    const saved = rows[0];
    if (!saved) throw new Error("Supabase did not return the saved content item.");

    await supabaseRequest(`/rest/v1/content_media?content_id=eq.${encode(saved.id)}`, { method: "DELETE" }, accessToken);

    if (item.media?.length) {
      await supabaseRequest("/rest/v1/content_media", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(item.media.map((media, index) => ({
          content_id: saved.id,
          media_type: media.mediaType,
          url: media.url,
          caption: media.caption || null,
          alt: media.alt || null,
          sort_order: media.sortOrder ?? index,
        }))),
      }, accessToken);
    }

    return itemFromDb({
      ...saved,
      content_media: (item.media || []).map((media, index) => ({
        ...media,
        media_type: media.mediaType,
        sort_order: media.sortOrder ?? index,
      })),
    });
  },

  async remove(id: string) {
    if (!isSupabaseConfigured) {
      saveLocalContent(getLocalContent().filter((item) => item.id !== id));
      return;
    }

    const accessToken = SupabaseAuth.getAccessToken();
    if (!accessToken) throw new Error("Sign in as an editor before deleting content.");
    await supabaseRequest(`/rest/v1/content_items?id=eq.${encode(id)}`, { method: "DELETE" }, accessToken);
  },

  async uploadMedia(file: File): Promise<string> {
    if (!isSupabaseConfigured) return readAsDataUrl(file);

    const accessToken = SupabaseAuth.getAccessToken();
    if (!accessToken) throw new Error("Sign in as an editor before uploading media.");

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const objectPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
    await supabaseRequest(`/storage/v1/object/content-media/${objectPath}`, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
      body: file,
    }, accessToken);

    const base = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
    return `${base}/storage/v1/object/public/content-media/${objectPath}`;
  },
};
