import React, { useEffect, useState } from "react";
import ContentCard from "../components/content/ContentCard";
import { useAppContext } from "../controllers/AppContext";
import { ContentItem } from "../models";
import { ContentRepository } from "../repositories/ContentRepository";

export default function Products() {
  const { t, locale } = useAppContext();
  const [products, setProducts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    ContentRepository.list("product", locale)
      .then((items) => active && setProducts(items))
      .catch((error) => console.error("Failed to load products", error))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [locale]);

  const designs = products.filter((item) => item.category === "Designs");
  const elements = products.filter((item) => item.category !== "Designs");

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-4">APTUS</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("nav", "products")}</h1>
          <p className="text-xl text-gray-600 font-light">
            {locale === "fa"
              ? "مجموعه کامل محصولات پیش‌ساخته بتنی و طرح‌های سازه‌ای ما."
              : locale === "tr"
              ? "Prefabrik beton ürünlerimizin ve yapısal tasarımlarımızın eksiksiz koleksiyonu."
              : "Our complete range of precast concrete products and structural designs."}
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center text-[#777]">Loading products…</div>
        ) : (
          <>
            {designs.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{t("nav", "designs")}</h2>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {designs.map((item) => <ContentCard key={item.id} item={item} />)}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t("nav", "elements")}</h2>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              {elements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {elements.map((item) => <ContentCard key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="py-16 text-center border-y border-[#e5e5e0] text-[#777]">No published products yet.</div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
