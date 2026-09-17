export type Role = "guest" | "member" | "admin" | "manager";

export interface UserProfile {
  uid?: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  role?: Role;
}

export interface AnalyticsData {
  totalViews: number;
  totalMembers: number;
}

export type ContentType = "product" | "news" | "project";
export type ContentStatus = "draft" | "published";
export type ContentTemplate = "showcase" | "editorial" | "technical" | "case-study" | "gallery";
export type MediaType = "image" | "video";

export interface ContentMedia {
  id?: string;
  mediaType: MediaType;
  url: string;
  caption?: string;
  alt?: string;
  sortOrder?: number;
}

export interface ContentCTA {
  label?: string;
  url?: string;
}

export interface ContentSEO {
  title?: string;
  description?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  slug: string;
  locale: "en" | "fa" | "tr";
  status: ContentStatus;
  templateKey: ContentTemplate;
  title: string;
  abstract: string;
  body: string;
  coverImage: string;
  category?: string;
  publishedAt?: string;
  highlights: string[];
  specs: Record<string, string>;
  cta: ContentCTA;
  seo: ContentSEO;
  media: ContentMedia[];
  createdAt?: string;
  updatedAt?: string;
}

export type ContentDraft = Omit<ContentItem, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export const CONTENT_TEMPLATES: Array<{
  key: ContentTemplate;
  name: string;
  description: string;
}> = [
  { key: "showcase", name: "Showcase", description: "Large slideshow first, followed by narrative copy and CTA." },
  { key: "editorial", name: "Editorial", description: "Article-first layout for news, press, and long-form stories." },
  { key: "technical", name: "Technical", description: "Product layout focused on specifications, facts, and supporting media." },
  { key: "case-study", name: "Case Study", description: "Project/work layout with highlights, metrics, story, and gallery." },
  { key: "gallery", name: "Gallery", description: "Visual-first image/video grid with a compact supporting story." },
];
