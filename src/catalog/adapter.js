import { company,parts,spans,heights } from "./content.js";
import { copy,translatedParts } from "./i18n.js";
import { partCopy,facades } from "./supplied-content.js";
import { editorialUI,editorialParts } from "./editorial-i18n.js";
export const catalogAliases={"columns":"column","foundations":"foundation","beams":"girder","tie-beams":"tie-beam","wall-panels":"self-standing-wall","architectural-panels":"self-standing-wall","corner-elements":"corner-wall"};
export function catalogParts(locale) {
 return parts.map(part=>({...part,...(partCopy[part.id]||{}),...(locale==="fa"?{name:partCopy[part.id]?.sourceTitle||part.name}:{}),...(translatedParts[locale]?.[part.id]||{}),...(editorialParts[locale]?.[part.id]||{})}));
}
export const CATALOG_CONTENT=["en","fa","tr"].flatMap(locale=>{
 const ui=copy[locale],extra=editorialUI[locale];
 const category=locale==="fa"?"اجزای پیش‌ساخته":locale==="tr"?"Prefabrik bileşenler":"Precast components";
 const items=catalogParts(locale).map(part=>({
  id:"seed-catalog-"+locale+"-"+part.id,type:"product",slug:part.id,locale,status:"published",templateKey:"technical",
  title:part.name,abstract:part.description,body:(part.paragraphs||[part.description]).join("\n\n"),coverImage:part.image,category,
  highlights:part.points||[],specs:{AIPS:part.english},cta:{label:ui.footer.contact,url:"/about/contact"},seo:{title:part.name+" | "+company.englishName,description:part.description},
  media:(part.gallery?.length?part.gallery:[part.image]).map((url,index)=>({mediaType:"image",url,alt:part.name,sortOrder:index}))
 }));
 items.push({id:"seed-catalog-"+locale+"-single",type:"product",slug:"single-storey-design",locale,status:"published",templateKey:"technical",title:ui.system.title,abstract:ui.system.p1,body:ui.system.p1+"\n\n"+ui.system.p2,coverImage:"/catalog/assets/render.png",category:"AIPS",highlights:[],specs:{M:"2.4 m",H:"2.4 m",Types:String(spans.length*heights.length)},cta:{label:extra.nav.types,url:"/?lang="+locale+"#types"},seo:{},media:[{mediaType:"image",url:"/catalog/assets/system-3d-view.png",alt:ui.system.imageAlt,sortOrder:0}]});
 items.push({id:"seed-catalog-"+locale+"-facades",type:"product",slug:"facades",locale,status:"published",templateKey:"gallery",title:extra.facades.title,abstract:extra.facades.aside||extra.facades.note,body:extra.facades.note,coverImage:facades[0].image,category:"AIPS",highlights:[],specs:{},cta:{label:ui.footer.contact,url:"/about/contact"},seo:{},media:facades.map((item,index)=>({mediaType:"image",url:item.image,alt:extra.facades.caption+" "+(index+1),sortOrder:index}))});
 return items;
});
