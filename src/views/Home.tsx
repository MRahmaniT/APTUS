import React, { useEffect, useState } from "react";
import HomeUpdates from "../components/HomeUpdates";
import HomeShowcase from "../components/HomeShowcase";
import CatalogParts from "../components/CatalogParts";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";
import { catalogAsset } from "../data/catalogDetails";
import { catalogPresentation } from "../data/catalogPresentation";
import "../styles/catalog-home.css";

function EnglishBrand({className}:{className:string}){
 return <p className={"cover-en "+className} lang="en" dir="ltr"><span className="en-l1"><b>A</b>ptus <b>I</b>ndustrial <b>P</b>refabricated <b>S</b>ystem</span><span className="en-l2"><b>F</b>ast <b>F</b>abricated <b>P</b>roduct <span className="en-abbr">(AIPS-FFP)</span></span></p>;
}
export default function Home() {
 const {locale}=useAppContext(),ui=catalogPresentation[locale];
 const [cmsData,setCmsData]=useState<{title?:string,subtitle?:string}>({});
 useEffect(()=>{let active=true;ApiService.getCMSContent("home").then(value=>{if(active&&value)setCmsData(value);}).catch(console.error);return()=>{active=false;};},[]);
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
  <HomeShowcase/>
  <CatalogParts/>
  <section id="system" className="page-section system-section">
   <div className="section-inner">
    <div className="section-head"><div><span className="eyebrow"/><h2>{ui.system.title}</h2></div></div>
    <div className="system-grid">
     <div className="system-picture"><figure className="system-photo"><img src={catalogAsset("render.png")} alt={ui.system.imageAlt} loading="lazy"/></figure><figure className="system-cad"><img src={catalogAsset("system-3d-view.png")} alt={ui.system.imageAlt} loading="lazy"/></figure></div>
     <div className="system-copy"><p>{ui.system.p1}</p><p>{ui.system.p2}</p><a className="system-catalog-link" href="/catalog-assets/aptus-catalog.pdf" download>دانلود کاتالوگ <span aria-hidden="true">↓</span></a></div>
    </div>
   </div>
  </section>
  <HomeUpdates/>
 </div></div>;
}

