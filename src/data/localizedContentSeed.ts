import { ContentItem } from "../models";
import { CONTENT_SEED } from "./contentSeed";
import { CONTENT_TRANSLATIONS } from "./contentTranslations";

const BODY_SUFFIX = {
  fa: "APTUS هر سیستم را با توجه به عملکرد سازه‌ای، کیفیت تولید کارخانه‌ای، محدودیت‌های حمل و نصب کارآمد در کارگاه مهندسی می‌کند. برای ابعاد، پرداخت، جزئیات اتصال و پشتیبانی مهندسی متناسب با پروژه با تیم ما تماس بگیرید.",
  tr: "APTUS her sistemi yapısal performans, fabrika üretim kalitesi, taşıma koşulları ve verimli saha montajını birlikte değerlendirerek projelendirir. Projeye özel ölçüler, yüzeyler, bağlantı detayları ve mühendislik desteği için ekibimizle iletişime geçin.",
};

const HIGHLIGHTS: Record<"fa" | "tr", string[]> = {
  fa: ["کیفیت کنترل‌شده کارخانه‌ای", "نصب سریع‌تر در کارگاه", "مهندسی متناسب با پروژه"],
  tr: ["Fabrika kontrollü kalite", "Daha hızlı saha montajı", "Projeye özel mühendislik"],
};

const CTA: Record<"fa" | "tr", string> = {
  fa: "گفت‌وگو با تیم APTUS",
  tr: "APTUS ekibiyle görüşün",
};

export const LOCALIZED_CONTENT_SEED: ContentItem[] = (["fa", "tr"] as const).reduce<ContentItem[]>((all, locale) => {
  CONTENT_SEED.forEach((item) => {
    const translated = CONTENT_TRANSLATIONS[locale][item.slug];
    if (!translated) return;

    all.push({
      ...item,
      id: `${item.id}-${locale}`,
      locale,
      title: translated.title,
      abstract: translated.abstract,
      category: translated.category,
      body: `${translated.abstract}\n\n${BODY_SUFFIX[locale]}`,
      highlights: [...HIGHLIGHTS[locale]],
      specs: {},
      cta: item.cta?.url ? { label: CTA[locale], url: item.cta.url } : {},
      seo: { title: `${translated.title} | APTUS`, description: translated.abstract },
      media: (item.media || []).map((media) => ({ ...media, alt: translated.title })),
    });
  });
  return all;
}, []);
