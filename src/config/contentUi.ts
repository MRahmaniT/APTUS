import { Locale } from "./translations";

export const CONTENT_UI: Record<Locale, {
  viewDetails: string;
  backProducts: string;
  backNews: string;
  backWork: string;
  overview: string;
  specifications: string;
  loading: string;
  loadingProducts: string;
  notFoundTitle: string;
  notFoundBody: string;
  loadError: string;
  noContent: string;
  noProducts: string;
  all: string;
  previousMedia: string;
  nextMedia: string;
  ourWork: string;
  contentStudio: string;
  pageEditor: string;
  profile: string;
  analytics: string;
  footerDescription: string;
  copyright: string;
  footerTagline: string;
  signIn: string;
}> = {
  en: {
    viewDetails: "View details",
    backProducts: "Back to products",
    backNews: "Back to news",
    backWork: "Back to work",
    overview: "Overview",
    specifications: "Specifications",
    loading: "Loading content…",
    loadingProducts: "Loading products…",
    notFoundTitle: "Content not found",
    notFoundBody: "This item is not available in the selected language.",
    loadError: "This page could not be loaded.",
    noContent: "No published content yet in this language.",
    noProducts: "No published products yet in this language.",
    all: "All",
    previousMedia: "Previous media",
    nextMedia: "Next media",
    ourWork: "Our Work",
    contentStudio: "Content Studio",
    pageEditor: "Page Editor",
    profile: "Admin Profile",
    analytics: "Analytics",
    footerDescription: "Precast concrete structures and modular building systems engineered for efficient construction.",
    copyright: "© 2026 APTUS Precast. All rights reserved.",
    footerTagline: "Building the future, panel by panel.",
    signIn: "Sign in",
  },
  fa: {
    viewDetails: "مشاهده جزئیات",
    backProducts: "بازگشت به محصولات",
    backNews: "بازگشت به اخبار",
    backWork: "بازگشت به پروژه‌ها",
    overview: "معرفی",
    specifications: "مشخصات فنی",
    loading: "در حال بارگذاری محتوا…",
    loadingProducts: "در حال بارگذاری محصولات…",
    notFoundTitle: "محتوا یافت نشد",
    notFoundBody: "این محتوا در زبان انتخاب‌شده موجود نیست.",
    loadError: "بارگذاری این صفحه ممکن نبود.",
    noContent: "هنوز محتوای منتشرشده‌ای در این زبان وجود ندارد.",
    noProducts: "هنوز محصول منتشرشده‌ای در این زبان وجود ندارد.",
    all: "همه",
    previousMedia: "رسانه قبلی",
    nextMedia: "رسانه بعدی",
    ourWork: "پروژه‌های ما",
    contentStudio: "مدیریت محتوا",
    pageEditor: "ویرایش صفحات",
    profile: "پروفایل مدیر",
    analytics: "آمار",
    footerDescription: "سیستم‌های سازه‌ای بتنی پیش‌ساخته و مدولار برای ساخت سریع‌تر و کنترل‌شده‌تر.",
    copyright: "© ۲۰۲۶ APTUS. تمامی حقوق محفوظ است.",
    footerTagline: "ساخت آینده، قطعه به قطعه.",
    signIn: "ورود",
  },
  tr: {
    viewDetails: "Detayları görüntüle",
    backProducts: "Ürünlere dön",
    backNews: "Haberlere dön",
    backWork: "Projelere dön",
    overview: "Genel bakış",
    specifications: "Teknik özellikler",
    loading: "İçerik yükleniyor…",
    loadingProducts: "Ürünler yükleniyor…",
    notFoundTitle: "İçerik bulunamadı",
    notFoundBody: "Bu içerik seçilen dilde mevcut değil.",
    loadError: "Bu sayfa yüklenemedi.",
    noContent: "Bu dilde henüz yayınlanmış içerik yok.",
    noProducts: "Bu dilde henüz yayınlanmış ürün yok.",
    all: "Tümü",
    previousMedia: "Önceki medya",
    nextMedia: "Sonraki medya",
    ourWork: "Projelerimiz",
    contentStudio: "İçerik Stüdyosu",
    pageEditor: "Sayfa Düzenleyici",
    profile: "Yönetici Profili",
    analytics: "Analizler",
    footerDescription: "Daha hızlı ve kontrollü inşaat için prefabrik beton yapılar ve modüler yapı sistemleri.",
    copyright: "© 2026 APTUS Precast. Tüm hakları saklıdır.",
    footerTagline: "Geleceği panel panel inşa ediyoruz.",
    signIn: "Giriş yap",
  },
};

export function contentUi(locale: Locale) {
  return CONTENT_UI[locale];
}
