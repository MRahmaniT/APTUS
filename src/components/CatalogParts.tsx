import { useState, type CSSProperties } from "react";
import { useAppContext } from "../controllers/AppContext";
import { catalogDetails, catalogAsset } from "../data/catalogDetails";
import { catalogPresentation } from "../data/catalogPresentation";

const routes: Record<string,string> = {column:"columns","longitudinal-beam":"modular",girder:"beams",purlin:"slabs","self-standing-wall":"wall-panels","tie-beam":"tie-beams",foundation:"foundations","wall-base":"architectural-panels","corner-wall":"corner-elements"};
export default function CatalogParts(){
 const {locale}=useAppContext();
 const d=catalogDetails(locale),ui=catalogPresentation[locale];
 const [active,setActive]=useState("column"),[ratio,setRatio]=useState(1.14);
 const selected=d.parts.find(p=>p.id===active)!;
 const paragraphs=("paragraphs" in selected ? selected.paragraphs : undefined) ?? [selected.description];
 const number=(value:string)=>String(Number(value));
 return <section id="explore" className="page-section explore-section explore-full" aria-label={ui.explore.title}>
  <div className="explore-hero">
   <div className="explore-bar"><div className="explore-title"><h2>{ui.explore.title}</h2></div><p>{ui.explore.diagramTitle}</p></div>
   <div className="model-stage"><div className="model-frame" id="model-frame" style={{"--ar":ratio} as CSSProperties}>
    <img id="model-img" src={catalogAsset("semi-assembly.png")} alt={ui.explore.diagramAlt} onLoad={e=>setRatio(Number((e.currentTarget.naturalWidth/e.currentTarget.naturalHeight).toFixed(4)))}/>
    <svg className="leader-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{d.parts.map(p=>p.pin && p.anchor && <line key={p.id} data-pin-of={p.id} className={active===p.id?"is-active":""} x1={p.pin[0]} y1={p.pin[1]} x2={p.anchor[0]} y2={p.anchor[1]}/>)}</svg>
    {d.parts.map(p=>p.pin && p.anchor && <i key={p.id} className={"pin-dot"+(active===p.id?" is-active":"")} data-pin-of={p.id} style={{left:p.anchor[0]+"%",top:p.anchor[1]+"%"}} aria-hidden="true"/>)}
    {d.parts.map(p=>p.pin && <button key={p.id} type="button" className={"pin"+(active===p.id?" is-active":"")} data-part={p.id} style={{left:p.pin[0]+"%",top:p.pin[1]+"%"}} aria-label={ui.explore.select.replace("{name}",p.name)} aria-pressed={active===p.id} onClick={()=>setActive(p.id)}><span>{number(p.number)}</span></button>)}
   </div></div>
  </div>
  <div className="explore-dock">
   <div className="part-selector" role="group" aria-label={ui.explore.selectGroup}>{d.parts.map(p=><button key={p.id} type="button" data-part={p.id} className={active===p.id?"is-active":""} aria-pressed={active===p.id} onClick={()=>setActive(p.id)}><bdi>{number(p.number)}</bdi> {p.name}</button>)}</div>
   <aside className="part-dock" id="part-preview" aria-live="polite" aria-atomic="true">
    <div className="dock-image"><img src={selected.image} alt={ui.explore.imageAlt.replace("{name}",selected.name)}/></div>
    <div className="dock-body" key={selected.id}><div className="dock-top"/><h3>{selected.name}</h3>{paragraphs.slice(0,2).map(p=><p className="dock-text" key={p}>{p}</p>)}<a className="solid-button" href={"/products/"+routes[selected.id]}>{d.more}<svg className="directional-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></a></div>
   </aside>
  </div>
 </section>;
}
