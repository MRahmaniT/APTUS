import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("qa-artifacts",{recursive:true});
const browser = await chromium.launch();
const comparisons=[];
const differences=[];
const groups=[
  ["header",".site-header",".aptus-header",["borderRadius","backgroundImage","boxShadow","backdropFilter","minHeight","paddingTop","paddingRight"]],
  ["cover",".cover-section",".aptus-cover",["borderRadius","minHeight","boxShadow"]],
  ["cover-title",".cover-hero h1",".aptus-cover-copy h1",["fontSize","fontWeight","lineHeight","color","textShadow"]],
  ["application-card",".application-card",".aptus-applications .ag-panel",["borderRadius","backgroundImage","boxShadow","backdropFilter","minHeight"]],
  ["product-card",".qa-card",".aptus-content-card",["borderRadius","backgroundImage","boxShadow","backdropFilter"]],
  ["card-caption",".qa-card .part-caption",".aptus-content-card .part-caption",["borderRadius","backgroundColor","paddingTop","paddingRight","minHeight"]],
  ["system-copy",".system-copy",".aptus-system-copy",["borderRadius","backgroundImage","boxShadow","paddingTop"]],
  ["primary-button",".section-action .solid-button",".aptus-intro-copy .solid-button",["borderRadius","backgroundColor","boxShadow","paddingTop","paddingRight","fontSize","fontWeight"]],
  ["footer",".site-footer",".aptus-footer",["borderRadius","backgroundColor","boxShadow"]],
];
async function styles(page,selector,keys){
  return page.locator(selector).first().evaluate((el,names)=>{
    const css=getComputedStyle(el);return Object.fromEntries(names.map(key=>[key,css[key]]));
  },keys);
}
async function capture(page,name,selector,inline=false){
  if(selector) await page.locator(selector).first().evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-116,behavior:"instant"}));
  else await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  const bytes=await page.screenshot({type:"jpeg",quality:65,path:"qa-artifacts/"+name+".jpg"});
  if(inline){
    const data=bytes.toString("base64");
    for(let i=0;i<data.length;i+=12000) console.log("VISUAL|"+name+"|"+String(i).padStart(7,"0")+"|"+data.slice(i,i+12000));
  }
}
try{
 for(const [name,width,height] of [["desktop",1440,1000],["mobile",390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:name==="desktop"?0.667:1});
  const reference=await context.newPage();
  const website=await context.newPage();
  await reference.goto("http://127.0.0.1:3001/",{waitUntil:"networkidle"});
  await website.goto("http://127.0.0.1:3000/",{waitUntil:"networkidle"});
  await reference.evaluate(()=>document.fonts.ready);
  await website.evaluate(()=>document.fonts.ready);
  // This fixture uses the catalog's real shared card classes and original stylesheet cascade.
  await reference.evaluate(()=>{
    const el=document.createElement("article");el.className="part-card qa-card";
    el.style.cssText="position:absolute;left:-9999px;top:0;width:320px";
    el.innerHTML='<div class="part-image"></div><div class="part-caption"><h3>APTUS</h3><p class="preview-excerpt">APTUS</p><a class="card-more">APTUS</a></div>';
    document.body.append(el);
  });
  for(const [component,refSelector,siteSelector,keys]of groups){
    const expected=await styles(reference,refSelector,keys);
    const actual=await styles(website,siteSelector,keys);
    const mismatch=keys.filter(key=>expected[key]!==actual[key]);
    comparisons.push({viewport:name,component,expected,actual,mismatch});
    for(const key of mismatch) differences.push(name+" "+component+" "+key+": "+actual[key]+" != "+expected[key]);
  }
  await capture(reference,name+"-catalog-cover",null,name==="desktop");
  await capture(website,name+"-website-cover",null,true);
  if(name==="desktop"){
    await capture(reference,"catalog-applications",".applications-grid",true);
    await capture(website,"website-applications",".aptus-applications",true);
    await capture(website,"website-introduction",".aptus-intro-copy",true);
    await capture(website,"website-product-grid",".aptus-product-grid",true);
    await capture(reference,"catalog-system",".system-grid");
    await capture(website,"website-system",".aptus-system-layout",true);
    await capture(website,"website-footer",".aptus-footer",true);
  }
  await context.close();
 }
 await writeFile("qa-artifacts/catalog-style-comparison.json",JSON.stringify(comparisons,null,2));
 console.log("Catalog visual comparison:",JSON.stringify(comparisons));
 assert.deepEqual(differences,[],"Shared components must match the actual catalog's computed styles.");
 console.log("PASS: catalog header, cover, typography, application cards, product cards, buttons, system panels and footer match at desktop and mobile sizes.");
}finally{await browser.close();}
