import { useEffect, useState } from "react";
import { catalogAsset } from "../data/catalogDetails";

export interface Slide {id:string;title:string;description:string;image:string;href:string;label?:string}
export default function Slideshow({ title, slides, className="" }: {title:string;slides:Slide[];className?:string}) {
  const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false),[focus,setFocus]=useState(false),[reduced,setReduced]=useState(false);
  useEffect(()=>{const m=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(m.matches);update();m.addEventListener("change",update);return()=>m.removeEventListener("change",update);},[]);
  useEffect(()=>{if(paused||hover||focus||reduced||slides.length<2)return;const timer=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%slides.length);},6500);return()=>clearInterval(timer);},[paused,hover,focus,reduced,slides.length]);
  if(!slides.length)return null;
  const current=slides[index%slides.length];
  return <section className={"site-slideshow section-inner "+className} aria-label={title} aria-roledescription="نمایش اسلاید" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocus(false);}}>
    <div className="slideshow-heading"><h2>{title}</h2><div className="slideshow-controls"><button aria-label="اسلاید قبلی" onClick={()=>setIndex(i=>(i-1+slides.length)%slides.length)}>→</button><button aria-label="اسلاید بعدی" onClick={()=>setIndex(i=>(i+1)%slides.length)}>←</button><button aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?"ادامه":"توقف"}</button></div></div>
    <article className="slideshow-slide" key={current.id} aria-label={`${index%slides.length+1} از ${slides.length}`}><img src={current.image} alt={current.title} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=catalogAsset("render.png");}}/><div className="slideshow-copy"><p>{current.label}</p><h3>{current.title}</h3><p>{current.description}</p><a className="solid-button" href={current.href}>اطلاعات بیشتر ←</a></div></article>
    <div className="slideshow-dots">{slides.map((slide,i)=><button key={slide.id} aria-label={"نمایش اسلاید "+(i+1)} aria-current={index%slides.length===i?"true":undefined} onClick={()=>setIndex(i)}/>)}</div>
  </section>;
}
