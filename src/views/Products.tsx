import React from 'react';
import { useAppContext } from '../controllers/AppContext';

export default function Products() {
  const { t, locale } = useAppContext();

  const designs = [
    { key: "design_single", img: "https://images.unsplash.com/photo-1549791084-5f78368b208b?w=600&h=800&fit=crop&auto=format" },
    { key: "design_double", img: "https://images.unsplash.com/photo-1614595737476-42487331b8a1?w=600&h=800&fit=crop&auto=format" },
    { key: "design_multi", img: "https://images.unsplash.com/photo-1587293852726-0d628a661700?w=600&h=800&fit=crop&auto=format" },
    { key: "design_facade", img: "https://images.unsplash.com/photo-1720762256650-ea429f429226?w=600&h=800&fit=crop&auto=format" },
  ];

  const elements = [
    { key: "elem_foundations", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_columns", img: "https://images.unsplash.com/photo-1630146694733-9d730e4ed310?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_girders", img: "https://images.unsplash.com/photo-1614595737683-1740e41bfaac?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_walls", img: "https://images.unsplash.com/photo-1616577711667-3da65b20c36a?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_tiebeams", img: "https://images.unsplash.com/photo-1518622112771-477382d56d1f?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_panels", img: "https://images.unsplash.com/photo-1586871608370-4adee64d1794?w=600&h=800&fit=crop&auto=format" },
    { key: "elem_corner", img: "https://images.unsplash.com/photo-1691425700573-5e2e6e4f6157?w=600&h=800&fit=crop&auto=format" },
  ];

  const getButtonText = () => {
    if (locale === 'fa') return 'اطلاعات بیشتر';
    if (locale === 'tr') return 'Daha fazla bilgi';
    return 'Learn more';
  };

  const getDescText = (key: string) => {
    const title = t("nav", key as any);
    if (locale === 'fa') return `توضیحات و مشخصات فنی مربوط به ${title} در این بخش ارائه می‌گردد.`;
    if (locale === 'tr') return `${title} ile ilgili teknik özellikler ve detaylar.`;
    return `Technical specifications and comprehensive details regarding ${title}.`;
  };

  const renderCard = (item: { key: string, img: string }) => (
    <article
      id={item.key}
      key={item.key}
      className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#e0e0db] scroll-mt-32"
    >
      <img
        src={item.img}
        alt={t("nav", item.key as any)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 group-hover:backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />

      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <h3 className="text-xl font-bold mb-0 group-hover:mb-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {t("nav", item.key as any)}
        </h3>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <p className="text-sm text-gray-200 line-clamp-3 mb-5 font-light leading-relaxed">
              {getDescText(item.key)}
            </p>

            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border border-white/30 px-4 py-2 rounded-full group-hover:hover:bg-white group-hover:hover:text-black transition-colors duration-300">
              {getButtonText()}
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("nav", "products")}</h1>
          <p className="text-xl text-gray-600 font-light">
            {locale === 'fa'
              ? 'مجموعه کامل محصولات پیش‌ساخته بتنی و طرح‌های سازه‌ای ما.'
              : locale === 'tr'
              ? 'Prefabrik beton ürünlerimizin ve yapısal tasarımlarımızın eksiksiz koleksiyonu.'
              : 'Our complete range of precast concrete products and structural designs.'}
          </p>
        </div>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("nav", "designs")}</h2>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designs.map(renderCard)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("nav", "elements")}</h2>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {elements.map(renderCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
