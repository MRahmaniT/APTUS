import React from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { ContentItem } from "../../models";
import { useAppContext } from "../../controllers/AppContext";
import { contentUi } from "../../config/contentUi";

export function contentHref(item: Pick<ContentItem, "type" | "slug">) {
  if (item.type === "product") return `/products/${item.slug}`;
  if (item.type === "news") return `/news/${item.slug}`;
  return `/projects/${item.slug}`;
}

export default function ContentCard({ item }: { item: ContentItem }) {
  const { locale } = useAppContext();
  const ui = contentUi(locale);
  const date = item.publishedAt
    ? new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : locale === "tr" ? "tr-TR" : "en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(item.publishedAt))
    : null;

  return (
    <Link
      to={contentHref(item)}
      className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#e0e0db] block"
    >
      {item.coverImage ? (
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#d8d8d2] to-[#aaa9a2]" />
      )}

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/65 group-hover:backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />

      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.15em] text-white/75 mb-3">
          <span>{item.category || item.type}</span>
          {date && <span>{date}</span>}
        </div>

        <h3 className="text-xl md:text-2xl font-semibold mb-0 group-hover:mb-3 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {item.title}
        </h3>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <p className="text-sm text-white/80 line-clamp-3 mb-5 font-light leading-relaxed">
              {item.abstract}
            </p>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border border-white/35 px-4 py-2 rounded-full">
              {ui.viewDetails}
              <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
