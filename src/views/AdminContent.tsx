import React, { useEffect, useMemo, useState } from "react";
import { Eye, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import ContentDetail from "../components/content/ContentDetail";
import { isServerDatabaseEnabled } from "../config/apiClient";
import { Locale } from "../config/translations";
import { CONTENT_TEMPLATES, ContentDraft, ContentItem, ContentMedia, ContentType } from "../models";
import { ContentRepository } from "../repositories/ContentRepository";

const LOCALES: Array<{ key: Locale; label: string }> = [
  { key: "en", label: "English" },
  { key: "fa", label: "فارسی" },
  { key: "tr", label: "Türkçe" },
];

const inputClass = "w-full rounded-xl border border-[#ddd] bg-white px-4 py-3 text-sm outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]";

function emptyDraft(type: ContentType = "product", locale: Locale = "en"): ContentDraft {
  return {
    type,
    slug: "",
    locale,
    status: "draft",
    templateKey: type === "news" ? "editorial" : type === "project" ? "case-study" : "showcase",
    title: "",
    abstract: "",
    body: "",
    coverImage: "",
    category: "",
    publishedAt: undefined,
    highlights: [],
    specs: {},
    cta: {},
    seo: {},
    media: [],
  };
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function specsToText(specs: Record<string, string>) {
  return Object.entries(specs).map(([key, value]) => `${key}: ${value}`).join("\n");
}

function textToSpecs(value: string) {
  return value.split("\n").reduce<Record<string, string>>((result, line) => {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const key = line.slice(0, separator).trim();
      const entry = line.slice(separator + 1).trim();
      if (key && entry) result[key] = entry;
    }
    return result;
  }, {});
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">{label}</span>
      {children}
    </label>
  );
}

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [activeType, setActiveType] = useState<ContentType>("product");
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [draft, setDraft] = useState<ContentDraft>(emptyDraft());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [specText, setSpecText] = useState("");
  const [highlightText, setHighlightText] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const requests = (["product", "news", "project"] as ContentType[]).flatMap((type) =>
        LOCALES.map(({ key }) => ContentRepository.list(type, key, true)),
      );
      setItems((await Promise.all(requests)).flat());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems().catch((err) => setError(err?.message || "Could not load CMS content."));
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.type === activeType && item.locale === activeLocale),
    [items, activeType, activeLocale],
  );

  const setField = <K extends keyof ContentDraft>(key: K, value: ContentDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const resetEditor = (type = activeType, locale = activeLocale) => {
    setSelectedId(null);
    setDraft(emptyDraft(type, locale));
    setSpecText("");
    setHighlightText("");
    setMessage("");
    setError("");
    setShowPreview(false);
  };

  const selectItem = (item: ContentItem) => {
    setSelectedId(item.id);
    setActiveType(item.type);
    setActiveLocale(item.locale);
    setDraft({ ...item });
    setSpecText(specsToText(item.specs));
    setHighlightText(item.highlights.join("\n"));
    setMessage("");
    setError("");
    setShowPreview(false);
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.slug.trim() || !draft.abstract.trim()) {
      setError("Title, slug, and abstract are required for this language.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const saved = await ContentRepository.upsert({
        ...draft,
        specs: textToSpecs(specText),
        highlights: highlightText.split("\n").map((line) => line.trim()).filter(Boolean),
      });
      setSelectedId(saved.id);
      setDraft({ ...saved });
      setSpecText(specsToText(saved.specs));
      setHighlightText(saved.highlights.join("\n"));
      setMessage(`${LOCALES.find(({ key }) => key === saved.locale)?.label || saved.locale} ${saved.status === "published" ? "published" : "draft saved"} successfully.`);
      await loadItems();
    } catch (err: any) {
      setError(err.message || "Could not save content.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedId || !confirm(`Delete this ${draft.locale} content item?`)) return;
    setError("");
    try {
      await ContentRepository.remove(selectedId);
      resetEditor(activeType, activeLocale);
      await loadItems();
      setMessage("Content deleted.");
    } catch (err: any) {
      setError(err.message || "Could not delete content.");
    }
  };

  const uploadMedia = async (file: File) => {
    setSaving(true);
    setError("");
    try {
      const url = await ContentRepository.uploadMedia(file);
      const mediaType: ContentMedia["mediaType"] = file.type.startsWith("video/") ? "video" : "image";
      setDraft((current) => ({
        ...current,
        coverImage: current.coverImage || (mediaType === "image" ? url : current.coverImage),
        media: [...current.media, { mediaType, url, alt: current.title, sortOrder: current.media.length }],
      }));
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateMedia = (index: number, patch: Partial<ContentMedia>) => {
    setDraft((current) => ({
      ...current,
      media: current.media.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...patch } : entry),
    }));
  };

  const previewItem: ContentItem = {
    ...draft,
    id: draft.id || "preview",
    specs: textToSpecs(specText),
    highlights: highlightText.split("\n").map((line) => line.trim()).filter(Boolean),
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1500px] mx-auto px-2 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-3">Admin / Content Studio</p>
            <h1 className="text-4xl font-semibold">Edit each language independently</h1>
            <p className="mt-3 text-[#666] max-w-2xl">Products, news, and work pages are separate records for English, Persian, and Turkish. Everything saved here is stored in your server PostgreSQL database.</p>
          </div>
          <div className={`text-xs px-3 py-2 rounded-full border ${isServerDatabaseEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {isServerDatabaseEnabled ? "Server PostgreSQL mode" : "Browser demo mode"}
          </div>
        </div>

        <div className="grid xl:grid-cols-[310px_1fr] gap-6 items-start">
          <aside className="rounded-2xl border border-[#ddd] bg-white overflow-hidden xl:sticky xl:top-28">
            <div className="p-4 border-b border-[#eee]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888] mb-2">Editing language</p>
              <div className="grid grid-cols-3 rounded-xl bg-[#f2f2ee] p-1 gap-1">
                {LOCALES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setActiveLocale(key); resetEditor(activeType, key); }}
                    className={`rounded-lg px-2 py-2 text-xs ${activeLocale === key ? "bg-white shadow-sm font-semibold" : "text-[#777]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button onClick={() => resetEditor()} className="mt-3 w-full rounded-xl bg-[#111] text-white px-4 py-3 text-sm font-medium inline-flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> New {LOCALES.find(({ key }) => key === activeLocale)?.label} content
              </button>
            </div>

            <div className="flex border-b border-[#eee]">
              {(["product", "news", "project"] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); resetEditor(type, activeLocale); }}
                  className={`flex-1 px-2 py-3 text-xs capitalize ${activeType === type ? "bg-[#f2f2ee] font-semibold" : "text-[#777] hover:bg-[#fafaf8]"}`}
                >
                  {type === "project" ? "work" : type}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? <p className="p-4 text-sm text-[#777]">Loading…</p> : filtered.map((item) => (
                <button key={item.id} onClick={() => selectItem(item)} className={`w-full text-left rtl:text-right p-4 border-b border-[#eee] hover:bg-[#fafaf8] ${selectedId === item.id ? "bg-[#f2f2ee]" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium line-clamp-1">{item.title}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.status === "published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  </div>
                  <p className="text-xs text-[#888] mt-1 line-clamp-1">/{item.slug}</p>
                </button>
              ))}
              {!loading && !filtered.length && <p className="p-4 text-sm text-[#777]">No {activeLocale} items yet.</p>}
            </div>
          </aside>

          <main className="rounded-2xl border border-[#ddd] bg-[#fafaf8] overflow-hidden">
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ddd] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[#666]">{selectedId ? `Editing ${draft.locale.toUpperCase()} content` : `New ${activeLocale.toUpperCase()} content`}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowPreview((value) => !value)} className="px-4 py-2.5 rounded-full border border-[#ccc] bg-white text-sm font-medium inline-flex items-center gap-2">
                  <Eye className="w-4 h-4" /> {showPreview ? "Edit" : "Preview"}
                </button>
                {selectedId && <button onClick={remove} className="p-2.5 rounded-full border border-red-200 text-red-600 bg-white" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-full bg-[#111] text-white text-sm font-medium inline-flex items-center gap-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className="bg-[#fafaf8] p-4" dir={draft.locale === "fa" ? "rtl" : "ltr"}><ContentDetail item={previewItem} /></div>
            ) : (
              <div className="p-5 md:p-8 space-y-8" dir={draft.locale === "fa" ? "rtl" : "ltr"}>
                {(message || error) && <div className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

                <section className="grid md:grid-cols-2 gap-5">
                  <Field label="Content type">
                    <select value={draft.type} onChange={(e) => { const type = e.target.value as ContentType; setField("type", type); setActiveType(type); }} className={inputClass}>
                      <option value="product">Product</option><option value="news">News</option><option value="project">Work / Project</option>
                    </select>
                  </Field>
                  <Field label="Template">
                    <select value={draft.templateKey} onChange={(e) => setField("templateKey", e.target.value as ContentDraft["templateKey"])} className={inputClass}>
                      {CONTENT_TEMPLATES.map((template) => <option key={template.key} value={template.key}>{template.name} — {template.description}</option>)}
                    </select>
                  </Field>
                  <Field label="Language">
                    <select value={draft.locale} onChange={(e) => { const locale = e.target.value as Locale; setField("locale", locale); setActiveLocale(locale); }} className={inputClass}>
                      {LOCALES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select value={draft.status} onChange={(e) => setField("status", e.target.value as ContentDraft["status"])} className={inputClass}>
                      <option value="draft">Draft</option><option value="published">Published</option>
                    </select>
                  </Field>
                </section>

                <section className="space-y-5">
                  <Field label="Title"><input value={draft.title} onChange={(e) => { const title = e.target.value; setField("title", title); if (!selectedId && !draft.slug && draft.locale === "en") setField("slug", slugify(title)); }} className={inputClass} placeholder="Title in this language" /></Field>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Slug (keep the same across translations)"><input value={draft.slug} onChange={(e) => setField("slug", slugify(e.target.value))} className={inputClass} placeholder="structural-columns" dir="ltr" /></Field>
                    <Field label="Category"><input value={draft.category || ""} onChange={(e) => setField("category", e.target.value)} className={inputClass} placeholder="Category in this language" /></Field>
                  </div>
                  <Field label="Abstract (used on hover card)"><textarea value={draft.abstract} onChange={(e) => setField("abstract", e.target.value)} rows={3} className={inputClass} /></Field>
                  <Field label="Full page text"><textarea value={draft.body} onChange={(e) => setField("body", e.target.value)} rows={10} className={inputClass} /></Field>
                </section>

                <section className="space-y-5 border-t border-[#ddd] pt-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div><h2 className="text-xl font-semibold">Media</h2><p className="text-sm text-[#777] mt-1">Uploads are stored on your own server; external URLs are also supported.</p></div>
                    <button onClick={() => setDraft((current) => ({ ...current, media: [...current.media, { mediaType: "image", url: "", caption: "", alt: "", sortOrder: current.media.length }] }))} className="px-4 py-2 rounded-full border border-[#ccc] bg-white text-sm">Add URL</button>
                  </div>
                  <Field label="Card / cover image"><input value={draft.coverImage} onChange={(e) => setField("coverImage", e.target.value)} className={inputClass} placeholder="/uploads/... or https://…" dir="ltr" /></Field>
                  <label className="rounded-xl border border-dashed border-[#bbb] bg-white p-5 flex items-center justify-center gap-3 cursor-pointer hover:border-[#777]">
                    <ImagePlus className="w-5 h-5" /><span className="text-sm">Upload image or video to this server</span>
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadMedia(file); e.currentTarget.value = ""; }} />
                  </label>
                  <div className="space-y-3">
                    {draft.media.map((media, index) => (
                      <div key={`${media.url}-${index}`} className="grid md:grid-cols-[120px_1fr_1fr_auto] gap-3 rounded-xl border border-[#ddd] bg-white p-3">
                        <select value={media.mediaType} onChange={(e) => updateMedia(index, { mediaType: e.target.value as ContentMedia["mediaType"] })} className={inputClass}><option value="image">Image</option><option value="video">Video</option></select>
                        <input value={media.url} onChange={(e) => updateMedia(index, { url: e.target.value })} className={inputClass} placeholder="Media URL" dir="ltr" />
                        <input value={media.caption || ""} onChange={(e) => updateMedia(index, { caption: e.target.value, alt: e.target.value })} className={inputClass} placeholder="Caption / alt text" />
                        <button onClick={() => setDraft((current) => ({ ...current, media: current.media.filter((_, mediaIndex) => mediaIndex !== index) }))} className="p-3 text-red-600" title="Remove media"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid lg:grid-cols-2 gap-5 border-t border-[#ddd] pt-8">
                  <Field label="Highlights (one per line)"><textarea value={highlightText} onChange={(e) => setHighlightText(e.target.value)} rows={7} className={inputClass} /></Field>
                  <Field label="Specifications (Label: Value)"><textarea value={specText} onChange={(e) => setSpecText(e.target.value)} rows={7} className={inputClass} /></Field>
                </section>

                <section className="grid md:grid-cols-2 gap-5 border-t border-[#ddd] pt-8">
                  <Field label="CTA label"><input value={draft.cta?.label || ""} onChange={(e) => setField("cta", { ...draft.cta, label: e.target.value })} className={inputClass} /></Field>
                  <Field label="CTA link"><input value={draft.cta?.url || ""} onChange={(e) => setField("cta", { ...draft.cta, url: e.target.value })} className={inputClass} dir="ltr" /></Field>
                  <Field label="SEO title"><input value={draft.seo?.title || ""} onChange={(e) => setField("seo", { ...draft.seo, title: e.target.value })} className={inputClass} /></Field>
                  <Field label="SEO description"><input value={draft.seo?.description || ""} onChange={(e) => setField("seo", { ...draft.seo, description: e.target.value })} className={inputClass} /></Field>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
