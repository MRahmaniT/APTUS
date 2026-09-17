import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ContentDetail from "../components/content/ContentDetail";
import { useAppContext } from "../controllers/AppContext";
import { ContentItem, ContentType } from "../models";
import { ContentRepository } from "../repositories/ContentRepository";

function DetailPage({ type }: { type: ContentType }) {
  const { slug = "" } = useParams();
  const { locale } = useAppContext();
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
        if (!result) setError("This content could not be found.");
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError("This page could not be loaded.");
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [type, slug, locale]);

  if (loading) {
    return <div className="min-h-[55vh] grid place-items-center text-sm text-[#777]">Loading content…</div>;
  }

  if (!item || error) {
    return (
      <div className="min-h-[55vh] grid place-items-center text-center px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#999] mb-3">APTUS</p>
          <h1 className="text-3xl font-semibold mb-3">Content not found</h1>
          <p className="text-[#666]">{error || "This item is not available."}</p>
        </div>
      </div>
    );
  }

  return <ContentDetail item={item} />;
}

export const ProductDetail = () => <DetailPage type="product" />;
export const NewsDetail = () => <DetailPage type="news" />;
export const ProjectDetail = () => <DetailPage type="project" />;
