import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("qa-artifacts",{recursive:true});
const browser = await chromium.launch();
const comparisons=[];
const differences=[];
const groups=[
 ["header",".site-header",".aptus-header",["borderRadius","backgroundImage","boxShadow","backdropFilter","minHeight","paddingTop","paddingRight"]],
 ["cover",".cover-section",".catalog-home .cover-section",["borderRadius","minHeight","boxShadow"]],
 ["cover-copy",".cover-copy",".catalog-home .cover-copy",["width","paddingTop","paddingBottom","paddingLeft","paddingRight"]],
 ["cover-vignette",".cover-hero",".catalog-home .cover-hero",["backgroundImage","filter","backdropFilter","inset"],"::before"],
 ["cover-image-effects",".cover-visual",".catalog-home .cover-visual",["backgroundImage","filter","backdropFilter","maskImage","display"],"::after"],
 ["cover-title",".cover-hero h1",".catalog-home .cover-hero h1",["fontSize","fontWeight","lineHeight","color","textShadow","letterSpacing"]],
 ["cover-emphasis",".cover-hero h1 em",".catalog-home .cover-hero h1 em",["fontSize","fontWeight","lineHeight","color"]],
 ["cover-english",".cover-en--side",".catalog-home .cover-en--side",["fontSize","fontWeight","lineHeight","color","textShadow"]],
 ["system-grid",".system-grid",".catalog-home .system-grid",["gridTemplateColumns","gap","alignItems"]],
 ["system-copy",".system-copy",".catalog-home .system-copy",["borderRadius","backgroundImage","boxShadow","paddingTop","paddingRight"]],
 ["system-picture",".system-picture",".catalog-home .system-picture",["borderRadius","minHeight","paddingTop","gap"]],
 ["system-cad",".system-cad",".catalog-home .system-cad",["aspectRatio","backgroundColor"]],
 ["parts-frame",".model-frame",".catalog-home .model-frame",["aspectRatio","width"]],
 ["parts-pin",".pin",".catalog-home .pin",["borderRadius","backgroundColor","width","height"]],
 ["parts-dock",".part-dock",".catalog-home .part-dock",["borderRadius","backgroundColor","paddingTop","gap"]],
 ["footer",".site-footer",".aptus-footer",["borderRadius","backgroundColor","boxShadow"]],
];
async function styles(page,selector,keys,pseudo=null){
  return page.locator(selector).first().evaluate((el,{names,pseudo})=>{
    const css=getComputedStyle(el,pseudo);
    const canonical=value=>String(value).replaceAll("to left","270deg").replaceAll("to right","90deg").replaceAll("to bottom","180deg").replaceAll("to top","0deg");
    return Object.fromEntries(names.map(key=>[key,canonical(css[key])]));
  },{names:keys,pseudo});
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
  for(const [component,refSelector,siteSelector,keys,pseudo]of groups){
    const expected=await styles(reference,refSelector,keys,pseudo);
    const actual=await styles(website,siteSelector,keys,pseudo);
    const mismatch=keys.filter(key=>expected[key]!==actual[key]);
    comparisons.push({viewport:name,component,expected,actual,mismatch});
    for(const key of mismatch) differences.push(name+" "+component+" "+key+": "+actual[key]+" != "+expected[key]);
  }
  await reference.evaluate(()=>document.querySelector(".qa-card").remove());
  await capture(reference,name+"-catalog-cover",null,name==="desktop");
  await capture(website,name+"-website-cover",null,true);
  assert.equal(await website.locator(".cover-hero h1").innerHTML(),await reference.locator(".cover-hero h1").innerHTML(),"Catalog title text and emphasis");
  assert.deepEqual(await website.locator(".system-copy p").allTextContents(),await reference.locator(".system-copy p").allTextContents(),"Catalog AIPS paragraphs");
  if(name==="desktop"){
    await capture(reference,"catalog-applications",".applications-grid",true);
    await capture(website,"website-applications",".aptus-applications",true);
    await capture(website,"website-introduction",".catalog-home .about-section",true);
    await capture(website,"website-product-grid",".catalog-home .explore-dock",true);
    await capture(reference,"catalog-system",".system-grid");
    await capture(website,"website-system",".catalog-home .system-grid",true);
    await capture(website,"website-footer",".aptus-footer",true);
  }
  await context.close();
 }
 await writeFile("qa-artifacts/catalog-style-comparison.json",JSON.stringify(comparisons,null,2));
 console.log("Catalog visual comparison:",JSON.stringify(comparisons));
 if(differences.length){
  const diagnostic=await browser.newPage();
  await diagnostic.goto("http://127.0.0.1:3000/",{waitUntil:"networkidle"});
  console.log("Backdrop CSS diagnostic:",await diagnostic.evaluate(async()=>{
    const texts=await Promise.all([...document.querySelectorAll('link[rel="stylesheet"]')].map(async link=>await (await fetch(link.href)).text()));
    return {supports:CSS.supports("backdrop-filter","blur(18px)"),rules:texts.flatMap(css=>(css.match(/[^{}]*aptus-(?:header|content-card|applications)[^{}]*\\{[^}]*\\}/g)||[]).filter(rule=>rule.includes("backdrop")))};
  }));
  await diagnostic.close();
 }
 assert.deepEqual(differences,[],"Shared components must match the actual catalog's computed styles.");
 console.log("PASS: catalog cover text, emphasis, effects, component diagram and AIPS introduction match at desktop and mobile sizes; website navigation retained.");
}finally{await browser.close();}
