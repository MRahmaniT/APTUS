import React, { useEffect, useState } from "react";
import { useAppContext } from "../controllers/AppContext";
import { EditablePage } from "../data/pageSeed";
import { PageRepository } from "../repositories/PageRepository";
import { contentUi } from "../config/contentUi";

export default function StaticPage({ pagePath }: { pagePath: string }) {
  const { locale } = useAppContext();
  const ui = contentUi(locale);
  const [page, setPage] = useState<EditablePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    PageRepository.get(pagePath, locale)
      .then((result) => active && setPage(result))
      .catch((error) => {
        console.error("Failed to load page", error);
        if (active) setPage(null);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [pagePath, locale]);

  if (loading) return <div className="min-h-[55vh] grid place-items-center text-[#777]">{ui.loading}</div>;
  if (!page) return <div className="min-h-[55vh] grid place-items-center text-[#777]">{ui.notFoundBody}</div>;

  return (
    <article className="max-w-6xl mx-auto py-12 md:py-20">
      <header className="max-w-3xl mb-10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-4">APTUS</p>
        <h1 className="text-5xl md:text-6xl font-semibold leading-[1.04] text-[#111]">{page.title}</h1>
        <p className="mt-6 text-xl text-[#666] font-light leading-relaxed">{page.abstract}</p>
      </header>

      {page.heroImage && <img src={page.heroImage} alt={page.title} className="w-full aspect-[16/7] object-cover rounded-2xl mb-12" />}

      <div className="max-w-3xl space-y-6 text-[17px] leading-8 text-[#3f3f3b]">
        {page.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
