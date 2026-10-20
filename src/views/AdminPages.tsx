import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Locale } from "../config/translations";
import { EditablePage, PAGE_DEFINITIONS, getSeedPage } from "../data/pageSeed";
import { PageRepository } from "../repositories/PageRepository";

const LOCALES: Array<{ key: Locale; label: string }> = [
  { key: "en", label: "English" },
  { key: "fa", label: "فارسی" },
  { key: "tr", label: "Türkçe" },
];

const inputClass = "w-full rounded-xl border border-[#ddd] bg-white px-4 py-3 text-sm outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]";

export default function AdminPages() {
  const [locale, setLocale] = useState<Locale>("en");
  const [path, setPath] = useState<string>(PAGE_DEFINITIONS[0].path);
  const [page, setPage] = useState<EditablePage | null>(getSeedPage(PAGE_DEFINITIONS[0].path, "en"));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const direction = locale === "fa" ? "rtl" : "ltr";
  const selectedLabel = useMemo(() => PAGE_DEFINITIONS.find((entry) => entry.path === path)?.navKey || path, [path]);

  const load = async (nextPath: string = path, nextLocale: Locale = locale) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      setPage(await PageRepository.get(nextPath, nextLocale));
    } catch (err: any) {
      setError(err.message || "Could not load page content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load().catch(console.error); }, []);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    load(path, next).catch(console.error);
  };

  const changePath = (next: string) => {
    setPath(next);
    load(next, locale).catch(console.error);
  };

  const setField = <K extends keyof EditablePage>(key: K, value: EditablePage[K]) => {
    setPage((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async () => {
    if (!page) return;
    if (!page.title.trim() || !page.abstract.trim()) {
      setError("Title and abstract are required for this language.");
      return;
    }
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await PageRepository.save({ ...page, path, locale });
      setMessage(`${LOCALES.find((entry) => entry.key === locale)?.label} page saved.`);
    } catch (err: any) {
      setError(err.message || "Could not save page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-3">Admin / Page Editor</p>
        <h1 className="text-4xl font-semibold">Edit standard pages by language</h1>
        <p className="mt-3 text-[#666] max-w-3xl">About and Library pages are stored independently for English, Persian, and Turkish. Saving one language never changes the other two.</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        <aside className="rounded-2xl border border-[#ddd] bg-white overflow-hidden lg:sticky lg:top-28">
          <div className="p-4 border-b border-[#eee]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888] mb-2">Language</p>
            <div className="grid grid-cols-3 rounded-xl bg-[#f2f2ee] p-1 gap-1">
              {LOCALES.map((entry) => (
                <button key={entry.key} onClick={() => changeLocale(entry.key)} className={`rounded-lg px-2 py-2 text-xs ${locale === entry.key ? "bg-white shadow-sm font-semibold" : "text-[#777]"}`}>
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            {PAGE_DEFINITIONS.map((entry) => (
              <button key={entry.path} onClick={() => changePath(entry.path)} className={`w-full text-left rtl:text-right px-4 py-3 border-b border-[#eee] text-sm ${path === entry.path ? "bg-[#f2f2ee] font-semibold" : "hover:bg-[#fafaf8]"}`}>
                <span className="block">/{entry.path}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-2xl border border-[#ddd] bg-[#fafaf8] overflow-hidden">
          <div className="bg-white/90 backdrop-blur border-b border-[#ddd] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">/{path}</p>
              <p className="text-xs text-[#888]">{selectedLabel} · {locale.toUpperCase()}</p>
            </div>
            <button onClick={save} disabled={saving || loading || !page} className="px-5 py-2.5 rounded-full bg-[#111] text-white text-sm font-medium inline-flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save page"}
            </button>
          </div>

          <div className="p-5 md:p-8 space-y-6" dir={direction}>
            {(message || error) && <div className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}
            {loading || !page ? <div className="py-20 text-center text-[#777]">Loading…</div> : <>
              <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Title</span><input value={page.title} onChange={(e) => setField("title", e.target.value)} className={inputClass} /></label>
              <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Abstract / lead</span><textarea value={page.abstract} onChange={(e) => setField("abstract", e.target.value)} rows={4} className={inputClass} /></label>
              <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Page body</span><textarea value={page.body} onChange={(e) => setField("body", e.target.value)} rows={14} className={inputClass} /></label>
              <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Hero image URL</span><input value={page.heroImage} onChange={(e) => setField("heroImage", e.target.value)} className={inputClass} dir="ltr" placeholder="https://…" /></label>

              <section className="border-t border-[#ddd] pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#999] mb-4">Preview</p>
                <div className="rounded-2xl bg-white border border-[#e5e5e0] p-6 md:p-10">
                  <h2 className="text-4xl font-semibold">{page.title}</h2>
                  <p className="mt-4 text-lg text-[#666] leading-relaxed">{page.abstract}</p>
                  {page.heroImage && <img src={page.heroImage} alt={page.title} className="mt-8 w-full aspect-[16/7] object-cover rounded-xl" />}
                  <div className="mt-8 space-y-4 leading-8 text-[#444]">{page.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                </div>
              </section>
            </>}
          </div>
        </main>
      </div>
    </div>
  );
}
