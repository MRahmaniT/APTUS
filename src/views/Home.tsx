import React, { useEffect, useState } from "react";
import AccordionGallery from "../components/AccordionGallery";
import CatalogParts from "../components/CatalogParts";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";
import { catalogDetails, catalogAsset } from "../data/catalogDetails";
import { catalogPresentation } from "../data/catalogPresentation";
import "../styles/catalog-home.css";

function EnglishBrand({className}:{className:string}){
 return <p className={"cover-en "+className} lang="en" dir="ltr"><span className="en-l1"><b>A</b>ptus <b>I</b>ndustrial <b>P</b>refabricated <b>S</b>ystem</span><span className="en-l2"><b>F</b>ast <b>F</b>abricated <b>P</b>roduct <span className="en-abbr">(AIPS-FFP)</span></span></p>;
}
export default function Home() {
 const {locale}=useAppContext(),d=catalogDetails(locale),ui=catalogPresentation[locale];
 const [cmsData,setCmsData]=useState<{title?:string,subtitle?:string}>({});
 useEffect(()=>{let active=true;ApiService.getCMSContent("home").then(value=>{if(active&&value)setCmsData(value);}).catch(console.error);return()=>{active=false;};},[]);
 const applicationRoutes:Record<string,string>={industry:"industrial",storage:"warehouses",production:"manufacturing",sport:"sports",education:"educational"};
 const gallery=["industry","storage","production","sport","education"].map(id=>{
  const a=d.applications.find(a=>a.id===id)!;
  return {image:a.image,label:a.title,alt:a.title,link:"/applications/"+applicationRoutes[id]};
 });
 return <div className="aptus-home"><div className="catalog-home">
  <section id="cover" className="cover-section" aria-labelledby="cover-title">
   <div className="cover-copy">
    <div className="cover-title-wrap"><div className="cover-hero">
     {cmsData.title ? <h1 id="cover-title">{cmsData.title}</h1> : <h1 id="cover-title" dangerouslySetInnerHTML={{__html:ui.cover.title}}/>}
     {locale==="fa"&&<EnglishBrand className="cover-en--inflow"/>}
     {cmsData.subtitle&&<p className="cover-hero-sub">{cmsData.subtitle}</p>}
    </div></div>
   </div>
   {locale==="fa"&&<EnglishBrand className="cover-en--side"/>}
   <div className="cover-visual"><div className="visual-stage"><img src={catalogAsset("cover-render3.png")} alt={ui.cover.visualAlt}/></div></div>
  </section>
  <AccordionGallery className="aptus-applications" items={gallery} defaultIndex={2} expandRatio={0.52} trigger="hover" duration={0.5} height={500} gap={8} radius={16} grayscale={true} showLabels={true} accentColor="#f58220" overlayColor="#333333"/>
  <section id="about" className="page-section about-section">
   <div className="section-inner">
    <div className="section-head"><div><span className="eyebrow"/><h2>{ui.about.title}</h2></div></div>
    <div className="about-grid"><div className="about-quote"><span className="large-quote" aria-hidden="true">“</span><p>{ui.about.quote}</p></div><div className="about-copy"><p>{d.about}</p><a className="solid-button" href="/about/contact">{d.more}<span aria-hidden="true">→</span></a></div></div>
   </div>
  </section>
  <CatalogParts/>
  <section id="system" className="page-section system-section">
   <div className="section-inner">
    <div className="section-head"><div><span className="eyebrow"/><h2>{ui.system.title}</h2></div></div>
    <div className="system-grid">
     <div className="system-picture"><figure className="system-photo"><img src={catalogAsset("render.png")} alt={ui.system.imageAlt} loading="lazy"/></figure><figure className="system-cad"><img src={catalogAsset("system-3d-view.png")} alt={ui.system.imageAlt} loading="lazy"/></figure></div>
     <div className="system-copy"><p>{ui.system.p1}</p><p>{ui.system.p2}</p></div>
    </div>
   </div>
  </section>
 </div></div>;
}
