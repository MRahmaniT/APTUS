import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { ContentItem, ContentMedia } from "../../models";

function backHref(type: ContentItem["type"]) {
  if (type === "product") return "/products";
  if (type === "news") return "/news/latest";
  return "/projects";
}

function bodyParagraphs(body: string) {
  return body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function normalizeMedia(item: ContentItem): ContentMedia[] {
  if (item.media?.length) return item.media;
  return item.coverImage ? [{ mediaType: "image", url: item.coverImage, alt: item.title }] : [];
}

function Media({ media, className = "" }: { media: ContentMedia; className?: string }) {
  if (media.mediaType === "video") {
    const embed = /youtube\.com|youtu\.be|vimeo\.com/.test(media.url);
    return embed ? (
      <iframe
        src={media.url}
        title={media.caption || media.alt || "APTUS video"}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <video src={media.url} controls className={className} />
    );
  }
  return <img src={media.url} alt={media.alt || media.caption || ""} className={className} />;
}

function Meta({ item }: { item: ContentItem }) {
  const published = item.publishedAt
    ? new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date(item.publishedAt))
    : null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em] text-[#777]">
      <span>{item.category || item.type}</span>
      {published && <><span className="w-1 h-1 rounded-full bg-[#bbb]" /><span>{published}</span></>}
    </div>
  );
}

function CTA({ item }: { item: ContentItem }) {
  if (!item.cta?.label || !item.cta?.url) return null;
  return (
    <Link
      to={item.cta.url}
      className="inline-flex items-center gap-2 rounded-full bg-[#111] text-white px-6 py-3 text-sm font-medium hover:bg-[#333] transition-colors"
    >
      {item.cta.label}
      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
    </Link>
  );
}

function Slideshow({ item }: { item: ContentItem }) {
  const media = useMemo(() => normalizeMedia(item), [item]);
  const [index, setIndex] = useState(0);
  if (!media.length) return <div className="aspect-[16/9] rounded-2xl bg-[#e8e8e3]" />;
  const active = media[Math.min(index, media.length - 1)];

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black">
        <Media media={active} className="w-full h-full object-cover" />
        {media.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setIndex((current) => (current - 1 + media.length) % media.length)}
              className="p-2.5 rounded-full bg-white/80 backdrop-blur text-black hover:bg-white"
              aria-label="Previous media"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIndex((current) => (current + 1) % media.length)}
              className="p-2.5 rounded-full bg-white/80 backdrop-blur text-black hover:bg-white"
              aria-label="Next media"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {active.caption && <p className="text-xs text-[#888] mt-2">{active.caption}</p>}
    </div>
  );
}

function Highlights({ item }: { item: ContentItem }) {
  if (!item.highlights.length) return null;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {item.highlights.map((highlight) => (
        <div key={highlight} className="flex items-start gap-3 rounded-xl border border-[#e3e3de] bg-white p-4">
          <span className="mt-0.5 w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm leading-relaxed text-[#333]">{highlight}</span>
        </div>
      ))}
    </div>
  );
}

function Specs({ item }: { item: ContentItem }) {
  const entries = Object.entries(item.specs || {});
  if (!entries.length) return null;
  return (
    <dl className="divide-y divide-[#e2e2dd] border-y border-[#e2e2dd]">
      {entries.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(110px,0.7fr)_1.3fr] gap-4 py-4 text-sm">
          <dt className="text-[#888]">{label}</dt>
          <dd className="font-medium text-[#222]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ShowcaseTemplate({ item }: { item: ContentItem }) {
  return (
    <div className="space-y-12">
      <header className="max-w-4xl">
        <Meta item={item} />
        <h1 className="mt-5 text-5xl md:text-7xl font-semibold leading-[0.98] tracking-tight">{item.title}</h1>
        <p className="mt-6 text-xl md:text-2xl font-light leading-relaxed text-[#666] max-w-3xl">{item.abstract}</p>
      </header>
      <Slideshow item={item} />
      <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-12 items-start">
        <div className="space-y-6 text-[17px] text-[#3f3f3b] leading-8">
          {bodyParagraphs(item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <CTA item={item} />
        </div>
        <div className="space-y-8"><Specs item={item} /><Highlights item={item} /></div>
      </div>
    </div>
  );
}

function EditorialTemplate({ item }: { item: ContentItem }) {
  return (
    <article className="max-w-5xl mx-auto">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <Meta item={item} />
        <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-tight">{item.title}</h1>
        <p className="mt-6 text-xl font-light leading-relaxed text-[#666]">{item.abstract}</p>
      </header>
      {item.coverImage && <img src={item.coverImage} alt={item.title} className="w-full aspect-[16/8] object-cover rounded-2xl mb-12" />}
      <div className="max-w-2xl mx-auto text-[18px] leading-8 text-[#333] space-y-7">
        {bodyParagraphs(item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {item.highlights.length > 0 && (
          <aside className="my-10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#111] pl-6 rtl:pl-0 rtl:pr-6 space-y-2">
            {item.highlights.map((highlight) => <p key={highlight} className="font-medium">{highlight}</p>)}
          </aside>
        )}
        <CTA item={item} />
      </div>
    </article>
  );
}

function TechnicalTemplate({ item }: { item: ContentItem }) {
  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <Meta item={item} />
          <h1 className="mt-5 text-5xl md:text-6xl font-semibold leading-tight">{item.title}</h1>
          <p className="mt-6 text-xl text-[#666] font-light leading-relaxed">{item.abstract}</p>
          <div className="mt-10"><CTA item={item} /></div>
        </div>
        <Slideshow item={item} />
      </div>
      <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12">
        <div className="space-y-6 text-[17px] leading-8 text-[#3f3f3b]">
          <h2 className="text-2xl font-semibold text-[#111]">Overview</h2>
          {bodyParagraphs(item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Highlights item={item} />
        </div>
        <div className="lg:sticky lg:top-32 rounded-2xl bg-white border border-[#e1e1dc] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] mb-5">Specifications</h2>
          <Specs item={item} />
        </div>
      </div>
    </div>
  );
}

function CaseStudyTemplate({ item }: { item: ContentItem }) {
  return (
    <div className="space-y-12">
      <header className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
        <div>
          <Meta item={item} />
          <h1 className="mt-5 text-5xl md:text-7xl font-semibold leading-[1]">{item.title}</h1>
        </div>
        <p className="text-xl font-light leading-relaxed text-[#666]">{item.abstract}</p>
      </header>
      <Slideshow item={item} />
      <Highlights item={item} />
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12">
        <div className="space-y-6 text-[17px] leading-8 text-[#3f3f3b]">
          {bodyParagraphs(item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="space-y-8"><Specs item={item} /><CTA item={item} /></div>
      </div>
    </div>
  );
}

function GalleryTemplate({ item }: { item: ContentItem }) {
  const media = normalizeMedia(item);
  return (
    <div className="space-y-12">
      <header className="max-w-4xl">
        <Meta item={item} />
        <h1 className="mt-5 text-5xl md:text-7xl font-semibold leading-[1]">{item.title}</h1>
        <p className="mt-6 text-xl text-[#666] font-light leading-relaxed max-w-3xl">{item.abstract}</p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {media.map((entry, index) => (
          <figure key={`${entry.url}-${index}`} className={`overflow-hidden rounded-2xl bg-[#e8e8e3] ${index % 3 === 0 ? "md:col-span-2 aspect-[16/7]" : "aspect-[4/3]"}`}>
            <Media media={entry} className="w-full h-full object-cover" />
          </figure>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
        <div className="space-y-6 text-[17px] leading-8 text-[#3f3f3b]">
          {bodyParagraphs(item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <CTA item={item} />
        </div>
        <div className="space-y-8"><Highlights item={item} /><Specs item={item} /></div>
      </div>
    </div>
  );
}

export default function ContentDetail({ item }: { item: ContentItem }) {
  const Template = item.templateKey === "editorial"
    ? EditorialTemplate
    : item.templateKey === "technical"
    ? TechnicalTemplate
    : item.templateKey === "case-study"
    ? CaseStudyTemplate
    : item.templateKey === "gallery"
    ? GalleryTemplate
    : ShowcaseTemplate;

  return (
    <article className="max-w-7xl mx-auto px-2 md:px-6 py-8 md:py-14">
      <Link to={backHref(item.type)} className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-black mb-10">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        Back to {item.type === "project" ? "work" : `${item.type}s`}
      </Link>
      <Template item={item} />
      {item.seo?.description && (
        <a href={item.cta?.url || backHref(item.type)} className="sr-only">
          {item.seo.description} <ExternalLink />
        </a>
      )}
    </article>
  );
}
