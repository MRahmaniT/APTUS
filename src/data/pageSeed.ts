import { Locale } from "../config/translations";

export interface EditablePage {
  path: string;
  locale: Locale;
  title: string;
  abstract: string;
  body: string;
  heroImage: string;
}

export const PAGE_DEFINITIONS = [
  { path: "about/location", navKey: "about_location" },
  { path: "about/contact", navKey: "about_contact" },
  { path: "about/partners", navKey: "about_partners" },
  { path: "about/memberships", navKey: "about_memberships" },
  { path: "about/affiliations", navKey: "about_affiliations" },
  { path: "library/codes", navKey: "lib_codes" },
  { path: "library/books", navKey: "lib_books" },
  { path: "library/articles", navKey: "lib_articles" },
  { path: "library/glossary", navKey: "lib_glossary" },
] as const;

const titles: Record<Locale, Record<string, string>> = {
  en: {
    "about/location": "Location & Routing",
    "about/contact": "Contact APTUS",
    "about/partners": "Our Partners",
    "about/memberships": "Association Memberships",
    "about/affiliations": "Affiliations & Consortia",
    "library/codes": "Codes & Building Regulations",
    "library/books": "Reference Books",
    "library/articles": "Technical Papers & Articles",
    "library/glossary": "AIPS Technical Glossary",
  },
  fa: {
    "about/location": "موقعیت و مسیریابی",
    "about/contact": "تماس با APTUS",
    "about/partners": "همکاران ما",
    "about/memberships": "عضویت در تشکل‌ها",
    "about/affiliations": "وابستگی‌ها و کنسرسیوم‌ها",
    "library/codes": "کدها و آیین‌نامه‌های ساختمانی",
    "library/books": "کتاب‌های مرجع",
    "library/articles": "مقالات و نوشته‌های فنی",
    "library/glossary": "فرهنگ لغات تخصصی AIPS",
  },
  tr: {
    "about/location": "Konum ve Rota",
    "about/contact": "APTUS ile İletişim",
    "about/partners": "Ortaklarımız",
    "about/memberships": "Dernek Üyelikleri",
    "about/affiliations": "Bağlı Kuruluşlar ve Konsorsiyumlar",
    "library/codes": "Kodlar ve Yapı Yönetmelikleri",
    "library/books": "Referans Kitapları",
    "library/articles": "Teknik Makaleler ve Yazılar",
    "library/glossary": "AIPS Teknik Sözlüğü",
  },
};

const descriptions: Record<Locale, { about: string; library: string }> = {
  en: {
    about: "This page is managed from the APTUS admin Page Editor. Use it for clear company information, contact details, relationships, and practical guidance.",
    library: "This library page is managed independently in each language so technical references can be curated for the correct audience.",
  },
  fa: {
    about: "محتوای این صفحه از بخش ویرایش صفحات در پنل مدیریت APTUS کنترل می‌شود و می‌تواند شامل اطلاعات شرکت، راه‌های ارتباطی و توضیحات کاربردی باشد.",
    library: "این صفحه کتابخانه برای هر زبان به‌صورت مستقل مدیریت می‌شود تا منابع فنی مناسب همان مخاطبان نمایش داده شود.",
  },
  tr: {
    about: "Bu sayfanın içeriği APTUS yönetim panelindeki Sayfa Düzenleyici üzerinden yönetilir; şirket bilgileri, iletişim ve pratik yönlendirmeler için kullanılabilir.",
    library: "Bu kütüphane sayfası her dil için bağımsız yönetilir; böylece teknik kaynaklar doğru hedef kitleye göre düzenlenebilir.",
  },
};

function seedPage(path: string, locale: Locale): EditablePage {
  const section = path.startsWith("library/") ? "library" : "about";
  return {
    path,
    locale,
    title: titles[locale][path],
    abstract: descriptions[locale][section],
    body: descriptions[locale][section],
    heroImage: "",
  };
}

export const PAGE_SEED: EditablePage[] = PAGE_DEFINITIONS.flatMap(({ path }) =>
  (["en", "fa", "tr"] as Locale[]).map((locale) => seedPage(path, locale)),
);

export function getSeedPage(path: string, locale: Locale) {
  return PAGE_SEED.find((page) => page.path === path && page.locale === locale) || null;
}
