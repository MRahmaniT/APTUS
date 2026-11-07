import { useEffect, useState } from "react";
import { useAppContext } from "../controllers/AppContext";
import { ContentRepository } from "../repositories/ContentRepository";
import { ContentItem } from "../models";
import { catalogAsset } from "../data/catalogDetails";
import Slideshow from "./Slideshow";
import Modal from "./Modal";

const isEvent=(item:ContentItem)=>/رویداد|نمایشگاه|event|exhibition/i.test(item.category||"");
export default function HomeUpdates({kind}:{kind:"projects"|"news"}) {
  const {locale}=useAppContext();
  const [items,setItems]=useState<ContentItem[]>([]),[event,setEvent]=useState<ContentItem|null>(null);
  useEffect(()=>{let active=true;const types=kind==="projects"?["product","project"] as const:["news"] as const;
    Promise.all(types.map(type=>ContentRepository.list(type,locale))).then(groups=>{if(active)setItems(groups.flat());}).catch(console.error);return()=>{active=false;};
  },[locale,kind]);
  const events=items.filter(isEvent);
  useEffect(()=>{if(kind!=="news")return;const upcoming=events.find(item=>{const end=Date.parse(item.specs.eventEnd||"");return Number.isFinite(end)&&end>=Date.now();});if(!upcoming)return;const key="aptus.event."+upcoming.id+"."+(upcoming.updatedAt||upcoming.publishedAt||"");try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,"seen");setEvent(upcoming);}catch{}},[items,kind]);
  const selected=kind==="projects"?items.filter(i=>i.type==="project"||["single-storey-design","double-storey-design","multi-storey-design"].includes(i.slug)):items.filter(i=>!isEvent(i)).sort((a,b)=>Number(b.specs.Featured==="true")-Number(a.specs.Featured==="true")||(b.publishedAt||"").localeCompare(a.publishedAt||""));
  const slides=selected.slice(0,8).map(i=>({id:i.id,title:i.title,description:i.abstract,image:i.coverImage||catalogAsset("render.png"),href:(i.type==="project"?"/projects/":i.type==="news"?"/news/":"/products/")+i.slug,label:i.type==="project"?"پروژه‌ها":i.type==="product"?"تیپ‌بندی":"اخبار آپتوس"}));
  return <><Slideshow className={kind==="projects"?"design-project-slides":"news-slides"} title={kind==="projects"?"تیپ‌بندی و پروژه‌ها":"مهم‌ترین اخبار اخیر"} slides={slides}/>{kind==="news"&&events.length>0&&<section className="home-events section-inner" aria-label="رویدادها"><h2>رویدادها</h2>{events.slice(0,3).map(item=><button className="event-announcement" key={item.id} onClick={()=>setEvent(item)}><span>رویداد</span><strong>{item.title}</strong><span>مشاهده جزئیات ↗</span></button>)}</section>}{event&&<Modal title={event.title} onClose={()=>setEvent(null)} className="event-dialog"><p>{event.abstract}</p>{event.body.split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}<a className="solid-button" href={"/news/"+event.slug}>صفحه رویداد ←</a></Modal>}</>;
}
