import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ContentDetail from "../components/content/ContentDetail";
import { useAppContext } from "../controllers/AppContext";
import { contentUi } from "../config/contentUi";
import { ContentItem, ContentType } from "../models";
import { ContentRepository } from "../repositories/ContentRepository";

function DetailPage({ type }: { type: ContentType }) {
  const { slug = "" } = useParams();
  const { locale } = useAppContext();
  const ui = contentUi(locale);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    ContentRepository.getBySlug(type, slug, locale)
      .then((result) => {
        if (!active) return;
        setItem(result);
        if (!result) setError(ui.notFoundBody);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError(ui.loadError);
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [type, slug, locale, ui.loadError, ui.notFoundBody]);

  if (loading) {
    return <div className="min-h-[55vh] grid place-items-center text-sm text-[#777]">{ui.loading}</div>;
  }

  if (!item || error) {
    return (
      <div className="min-h-[55vh] grid place-items-center text-center px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#999] mb-3">APTUS</p>
          <h1 className="text-3xl font-semibold mb-3">{ui.notFoundTitle}</h1>
          <p className="text-[#666]">{error || ui.notFoundBody}</p>
        </div>
      </div>
    );
  }

  return <ContentDetail item={item} />;
}

export const ProductDetail = () => <DetailPage type="product" />;
export const NewsDetail = () => <DetailPage type="news" />;
export const ProjectDetail = () => <DetailPage type="project" />;
