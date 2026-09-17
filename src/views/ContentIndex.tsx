import React, { useEffect, useMemo, useState } from "react";
import ContentCard from "../components/content/ContentCard";
import { useAppContext } from "../controllers/AppContext";
import { contentUi } from "../config/contentUi";
import { ContentItem, ContentType } from "../models";
import { ContentRepository } from "../repositories/ContentRepository";

const COPY: Record<"news" | "project", Record<string, { eyebrow: string; title: string; intro: string }>> = {
  news: {
    en: { eyebrow: "News & Insights", title: "What’s happening at APTUS", intro: "Company news, technical perspectives, events, exhibitions, and updates from our work." },
    fa: { eyebrow: "اخبار و دیدگاه‌ها", title: "تازه‌های APTUS", intro: "اخبار شرکت، دیدگاه‌های فنی، رویدادها، نمایشگاه‌ها و تازه‌ترین مطالب ما." },
    tr: { eyebrow: "Haberler ve İçgörüler", title: "APTUS'ta neler oluyor", intro: "Şirket haberleri, teknik görüşler, etkinlikler, fuarlar ve çalışmalarımızdan güncellemeler." },
  },
  project: {
    en: { eyebrow: "Our Work", title: "Precast in practice", intro: "Explore project studies, application areas, and the way APTUS systems come together in real building scenarios." },
    fa: { eyebrow: "پروژه‌های ما", title: "پیش‌ساخته در عمل", intro: "مطالعات پروژه، حوزه‌های کاربرد و نحوه استفاده از سیستم‌های APTUS در سناریوهای واقعی ساختمان را ببینید." },
    tr: { eyebrow: "Çalışmalarımız", title: "Uygulamada prefabrik", intro: "Proje çalışmalarını, uygulama alanlarını ve APTUS sistemlerinin gerçek bina senaryolarında nasıl birleştiğini keşfedin." },
  },
};

export default function ContentIndex({ type }: { type: Extract<ContentType, "news" | "project"> }) {
  const { locale } = useAppContext();
  const ui = contentUi(locale);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCategory("all");
    ContentRepository.list(type, locale)
      .then((data) => active && setItems(data))
      .catch((error) => console.error(`Failed to load ${type} content`, error))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [type, locale]);

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[], [items]);
  const visible = category === "all" ? items : items.filter((item) => item.category === category);
  const copy = COPY[type][locale];

  return (
    <div className="min-h-screen pt-16 pb-24">
      <section className="max-w-7xl mx-auto px-2 md:px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-4">{copy.eyebrow}</p>
          <h1 className="text-5xl md:text-6xl font-semibold leading-[1.04] text-[#111] mb-5">{copy.title}</h1>
          <p className="text-lg text-[#666] font-light leading-relaxed">{copy.intro}</p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setCategory("all")} className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === "all" ? "bg-[#111] text-white border-[#111]" : "bg-white border-[#ddd] text-[#555] hover:border-[#999]"}`}>{ui.all}</button>
            {categories.map((value) => (
              <button key={value} onClick={() => setCategory(value)} className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === value ? "bg-[#111] text-white border-[#111]" : "bg-white border-[#ddd] text-[#555] hover:border-[#999]"}`}>{value}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-[#777]">{ui.loading}</div>
        ) : visible.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="py-24 text-center border-y border-[#e5e5e0] text-[#777]">{ui.noContent}</div>
        )}
      </section>
    </div>
  );
}

export const NewsIndex = () => <ContentIndex type="news" />;
export const ProjectsIndex = () => <ContentIndex type="project" />;
