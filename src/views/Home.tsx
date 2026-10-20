import React, { useEffect, useState } from "react";
import AccordionGallery from "../components/AccordionGallery";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";
import { catalogDetails, catalogAsset } from "../data/catalogDetails";

export default function Home() {
 const { locale } = useAppContext();
 const d = catalogDetails(locale);
 const [cmsData,setCmsData] = useState<{title?:string,subtitle?:string}>({});
 useEffect(()=>{let active=true; ApiService.getCMSContent("home").then(value=>{if(active && value)setCmsData(value);}).catch(console.error);return()=>{active=false;};},[]);
 const applicationRoutes: Record<string,string> = {industry:"industrial",storage:"warehouses",production:"manufacturing",sport:"sports",education:"educational"};
 const gallery = ["industry","storage","production","sport","education"].map(id=>{
   const a = d.applications.find(a=>a.id===id)!;
   return {image:a.image,label:a.title,alt:a.title,link:"/applications/"+applicationRoutes[id]};
 });
 // Six existing homepage card slots; product URLs stay compatible with saved links.
 const products = [["self-standing-wall","wall-panels"],["column","columns"],["purlin","slabs"],["girder","beams"],["facades","facades"],["longitudinal-beam","modular"]].map(([id,slug])=>{
  const p=d.parts.find(p=>p.id===id);
  return {src:p?.image||catalogAsset("facades/facade-01.jpg"),title:p?.name||d.facades.title,description:p?.description||d.facades.note,link:"/products/"+slug};
 });
 const stats = [{value:"3",label:d.labels.heights},{value:"6",label:d.labels.spans},{value:"18",label:d.labels.types},{value:"2.4 m",label:d.labels.base}];
 return <div className="aptus-home">
  <section className="aptus-hero-section">
   <div className="aptus-cover">
    <img className="aptus-cover-image" src={catalogAsset("cover-render3.png")} alt={d.system.imageAlt}/>
    <div className="aptus-cover-copy mb-8">
     <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-3">{d.companyName}</p>
     <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] text-[#111] max-w-2xl mb-4 whitespace-pre-line">{cmsData.title || d.coverTitle}</h1>
     <p className="text-base font-light text-[#666] max-w-lg leading-relaxed whitespace-pre-line">{cmsData.subtitle || d.coverSubtitle}</p>
    </div>
   </div>
   <AccordionGallery className="aptus-applications" items={gallery} defaultIndex={2} expandRatio={0.52} trigger="hover" duration={0.5} height={500} gap={8} radius={8} grayscale={false} showLabels={true} accentColor="#f58220" overlayColor="#333333"/>
  </section>
  <section className="aptus-products-section page-section">
   <div className="aptus-products-layout section-inner grid lg:grid-cols-[1fr_1.4fr] gap-14 items-start">
    <div className="aptus-intro-copy lg:sticky lg:top-24">
     <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-4">{d.labels.products}</p>
     <h2 className="text-4xl font-semibold leading-tight text-[#111] mb-6">{d.companyName}</h2>
     <p className="aptus-intro-paragraph text-justify text-[15px] text-[#444] leading-relaxed mb-4">{d.about}</p>
     <p className="aptus-intro-paragraph text-justify text-[15px] text-[#444] leading-relaxed mb-4">{d.aboutUI.quote}</p>
     <p className="aptus-intro-paragraph text-justify text-[15px] text-[#444] leading-relaxed mb-8">{d.system.p2}</p>
     <div className="aptus-stat-strip grid grid-cols-2 gap-6 border-t border-[#e5e5e0] pt-8">{stats.map(s=><div key={s.label}><p className="text-3xl font-semibold text-[#111]" dir="ltr">{s.value}</p><p className="text-xs text-[#888] mt-1 leading-snug">{s.label}</p></div>)}</div>
     <a href="/projects" className="solid-button inline-flex items-center gap-2 mt-10 px-6 py-3 text-sm font-medium rounded-full">{d.more}<span aria-hidden="true">→</span></a>
    </div>
    <div className="aptus-product-grid grid grid-cols-2 md:grid-cols-3 gap-4">
     {products.map(p=><a href={p.link} key={p.link} className="aptus-content-card group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#e0e0db] block">
      <img src={p.src} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500"/>
      <div className="part-caption absolute inset-0 p-6 flex flex-col justify-end text-white">
       <h3 className="text-xl font-bold mb-3">{p.title}</h3>
       <div><p className="text-sm leading-relaxed mb-5">{p.description}</p><span className="inline-flex items-center gap-2 text-xs font-semibold">{d.more}<span aria-hidden="true">→</span></span></div>
      </div>
     </a>)}
    </div>
   </div>
  </section>
  <section className="aptus-system-section page-section">
   <div className="section-inner max-w-7xl mx-auto px-6 md:px-10">
    <div className="aptus-system-layout system-grid grid lg:grid-cols-2 gap-16 items-center">
     <div className="aptus-system-copy system-copy">
      <p className="text-xs font-semibold tracking-[0.2em] mb-4 uppercase">AIPS</p>
      <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">{d.labels.system}</h2>
      <div className="text-justify space-y-6 text-lg font-light leading-relaxed"><p>{d.system.p1}</p><p>{d.system.p2}</p></div>
      <div className="mt-12 grid grid-cols-2 gap-8">
       <div><h4 className="text-xl font-bold mb-2">{d.labels.crane}</h4><p className="text-sm">{d.labels.craneLabel}</p></div>
       <div><h4 className="text-xl font-bold mb-2">{d.labels.wall}</h4><p className="text-sm">{d.labels.wallLabel}</p></div>
      </div>
      <a href="/products/single-storey-design" className="solid-button inline-flex items-center gap-2 mt-12 px-8 py-3.5 text-sm font-semibold rounded-full">{d.more}</a>
     </div>
     <div className="aptus-system-picture system-picture relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden">
      <img src={catalogAsset("render.png")} alt={d.system.imageAlt} loading="lazy" className="w-full h-full object-contain"/>
      <div className="absolute bottom-8 left-8 rounded-xl p-5"><p className="text-sm font-medium">{d.aboutUI.quote}</p><p className="text-xs">{d.labels.company}</p></div>
     </div>
    </div>
   </div>
  </section>
 </div>;
}
