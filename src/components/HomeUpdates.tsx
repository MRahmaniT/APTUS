import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAppContext } from "../controllers/AppContext";
import { ContentRepository } from "../repositories/ContentRepository";
import type { ContentItem } from "../models";
import { catalogAsset } from "../data/catalogDetails";
import Modal from "./Modal";

const isEvent = (item: ContentItem) => /رویداد|نمایشگاه|event|exhibition/i.test(item.category || "");
const fallback = catalogAsset("render.png");

function UpdateGrid({ title, items, listing, onSelect }: {
  title: string; items: ContentItem[]; listing: string; onSelect?: (item: ContentItem) => void;
}) {
  const [page, setPage] = useState(0);
  const [columns, setColumns] = useState(() => matchMedia("(min-width: 650px)").matches ? 2 : 1);

  useEffect(() => {
    const query = matchMedia("(min-width: 650px)");
    const resize = () => { setColumns(query.matches ? 2 : 1); setPage(0); };
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);

  const count = Math.ceil(items.length / columns);
  const current = Math.min(page, Math.max(0, count - 1));
  return <section className="update-section" aria-label={title}>
    <div className="update-heading"><h2>{title}</h2><Link to={listing}>مشاهده همه ←</Link></div>
    {items.length === 0 ? <p className="update-empty">هنوز مطلبی منتشر نشده است.</p> :
      <div className="update-grid" aria-live="polite">
        {items.slice(current * columns, (current + 1) * columns).map(item => {
          const content = <>
            <img src={item.coverImage || fallback} alt="" loading="lazy" onError={e => {
              if (e.currentTarget.getAttribute("src") !== fallback) e.currentTarget.src = fallback;
            }}/>
            <div className="update-copy"><p className="update-category">{item.category}</p>
              <h3>{item.title}</h3><p className="update-excerpt">{item.abstract}</p>
              <span className="update-more">مشاهده جزئیات ←</span>
            </div>
          </>;
          return <article className="update-card" key={item.id}>
            {onSelect ? <button type="button" aria-haspopup="dialog" onClick={() => onSelect(item)}>{content}</button> :
              <Link to={"/news/" + item.slug}>{content}</Link>}
          </article>;
        })}
      </div>}
    {count > 1 && <div className="update-pagination" role="group" aria-label={"صفحه‌بندی " + title}>
      {Array.from({ length: count }, (_, index) => <button type="button" key={index}
        aria-label={`صفحه ${index + 1}`} aria-current={index === current ? "page" : undefined}
        onClick={() => setPage(index)}><span/></button>)}
    </div>}
  </section>;
}

export default function HomeUpdates() {
  const { locale } = useAppContext();
  const { search } = useLocation();
  const authOpen = new URLSearchParams(search).has("auth");
  const [items, setItems] = useState<ContentItem[] | null>(null);
  const [event, setEvent] = useState<ContentItem | null>(null);

  useEffect(() => {
    let active = true;
    ContentRepository.list("news", locale)
      .then(data => { if (active) setItems(data); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, [locale]);

  useEffect(() => {
    if (authOpen || document.querySelector("dialog[open]")) return;
    const featured = items?.find(item => isEvent(item) && Date.parse(item.specs.eventEnd || "") >= Date.now());
    if (!featured) return;
    const key = "aptus.event." + featured.id + "." + (featured.updatedAt || featured.publishedAt || "");
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "seen");
      setEvent(featured);
    } catch { /* A disabled session store must not break the home page. */ }
  }, [items, authOpen]);

  if (!items) return null;
  const news = items.filter(item => !isEvent(item)).sort((a, b) =>
    Number(b.specs.Featured === "true") - Number(a.specs.Featured === "true") ||
    (b.publishedAt || "").localeCompare(a.publishedAt || ""),
  );
  return <div className="home-updates section-inner">
    <UpdateGrid title="مهم‌ترین اخبار" items={news.slice(0, 8)} listing="/news/latest"/>
    <UpdateGrid title="رویدادها" items={items.filter(isEvent).slice(0, 8)} listing="/news/events" onSelect={setEvent}/>
    {event && <Modal title={event.title} onClose={() => setEvent(null)} className="event-dialog">
      <p>{event.abstract}</p>
      {event.body.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
      <Link className="solid-button" to={"/news/" + event.slug}>صفحه رویداد ←</Link>
    </Modal>}
  </div>;
}
