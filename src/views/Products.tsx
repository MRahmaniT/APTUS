import React from 'react';
import { useAppContext } from '../controllers/AppContext';

export default function Products() {
  const { t, locale } = useAppContext();

  // Define data arrays using translations
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

  const renderCard = (item: {key: string, img: string}) => (
    <div key={item.key} className="group relative aspect-[3/4] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Default State: Image top, Title bottom */}
      <div className="absolute inset-0 pb-16 flex flex-col bg-white">
        <div className="flex-1 overflow-hidden">
          <img src={item.img} alt={t("nav", item.key as any)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
      
      {/* Title Bar (Default State) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white px-5 flex items-center border-t border-gray-100 group-hover:translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
        <h3 className="text-lg font-bold text-gray-900">{t("nav", item.key as any)}</h3>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#f8f9fa] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] p-8 flex flex-col justify-center items-start pointer-events-none group-hover:pointer-events-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {t("nav", item.key as any)}
        </h3>
        <p className="text-gray-600 mb-8 -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {getDescText(item.key)}
        </p>
        <div className="-translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <button className="bg-[#0055ff] hover:bg-[#0044cc] text-white font-semibold py-2.5 px-6 transition-colors shadow-sm">
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
        
        {/* Header Title */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("nav", "products")}</h1>
          <p className="text-xl text-gray-600 font-light">
            {locale === 'fa' 
              ? 'مجموعه کامل محصولات پیش‌ساخته بتنی و طرح‌های سازه‌ای ما.' 
              : 'Our complete range of precast concrete products and structural designs.'}
          </p>
        </div>

        {/* Designs Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("nav", "designs")}</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designs.map(renderCard)}
          </div>
        </section>

        {/* Precast Elements Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t("nav", "elements")}</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {elements.map(renderCard)}
          </div>
        </section>

      </div>
    </div>
  );
}
