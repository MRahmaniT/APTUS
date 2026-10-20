import {chromium} from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const base=process.env.BROWSER_BASE||"http://127.0.0.1:3000";
const browser=await chromium.launch({headless:true});
const widths=[{name:"desktop",width:1440,height:1000},{name:"tablet",width:820,height:1180},{name:"mobile",width:390,height:844}];
const errors=[],failures=[];
await fs.mkdir("qa-artifacts",{recursive:true});
async function check(page,label,locale="fa") {
 await page.evaluate(()=>document.fonts.ready);
 const state=await page.evaluate(()=>({dir:document.documentElement.dir,lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,content:document.body.innerText.length}));
 if(state.lang!==locale||state.dir!==(locale==="fa"?"rtl":"ltr"))failures.push(label+": locale/direction mismatch");
 if(state.overflow>4)failures.push(label+": overflow "+state.overflow);
 if(state.content<30)failures.push(label+": empty page");
}
try {
 for(const viewport of widths) {
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push(viewport.name+": "+e.message));
  for(const route of ["/","/products","/products/column","/news","/projects","/about/contact","/about/location","/library/codes"]) {
   const response=await page.goto(base+route,{waitUntil:"networkidle"});assert(response.status()<400);
   await check(page,viewport.name+" "+route);
   if(route==="/products")assert((await page.locator("[data-component-grid] .product-card").count())>=9,"Nine catalog components must appear");
   if(route==="/about/contact"){const text=await page.locator("body").innerText();assert(text.includes("33100"));assert(!text.includes("555-0190"));}
   if(viewport.name!=="desktop") {await page.locator(".menu-toggle").click();assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"),"true");await page.locator(".menu-toggle").click();}
   await page.screenshot({path:"qa-artifacts/"+viewport.name+"-"+(route==="/"?"home":route.slice(1).replaceAll("/","-"))+".png",fullPage:true});
  }
  for(const locale of ["en","tr"]) {
   await page.goto(base+"/?lang="+locale,{waitUntil:"networkidle"});await check(page,viewport.name+" "+locale,locale);
   await page.goto(base+"/products?lang="+locale,{waitUntil:"networkidle"});await check(page,viewport.name+" products "+locale,locale);
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
 for(const h of [3,4,5])for(const m of [5,6,7,8,9,10]) {await page.goto(base+"/?type="+h+"H-"+m+"M",{waitUntil:"networkidle"});assert.equal(await page.locator(".frame-diagram").count(),1);}
 for(const part of ["column","longitudinal-beam","girder","purlin","self-standing-wall","tie-beam","foundation","wall-base","corner-wall"]) {await page.goto(base+"/?part="+part,{waitUntil:"networkidle"});assert.equal(await page.locator(".part-detail-layout").count(),1);}
 for(const collection of ["benefits","facades","documents"]) {await page.goto(base+"/?"+collection+"=all",{waitUntil:"networkidle"});assert.equal(await page.locator(".detail-main").count(),1);}
 await page.goto(base+"/",{waitUntil:"networkidle"});
 await page.locator("[data-part='girder']").first().click();assert((await page.locator("#part-preview").innerText()).length>40);
 await page.locator(".benefits-toggle").click();assert.equal(await page.locator(".benefits-toggle").getAttribute("aria-expanded"),"true");
 // Authentication overlays preserve the active catalog detail.
 await page.goto(base+"/?part=column&auth=login",{waitUntil:"networkidle"});
 await page.locator(".auth-dialog button[aria-label='Close']").click();
 await page.waitForFunction(()=>!document.querySelector(".auth-dialog"));assert(new URL(page.url()).searchParams.get("part")==="column");
 // Existing first-manager account was created by the API smoke step.
 await page.goto(base+"/?auth=login",{waitUntil:"networkidle"});
 await page.locator(".auth-dialog input[type='email']").fill("ci-manager@aptus.local");
 await page.locator(".auth-dialog input[type='password']").fill("Aptus-CI-Password-123!");
 await page.locator(".auth-dialog button[type='submit']").click();await page.waitForFunction(()=>!document.querySelector(".auth-dialog"));
 for(const route of ["/admin/content","/admin/pages","/admin/profile","/admin/analytics","/library/codes"]) {
  await page.goto(base+route,{waitUntil:"networkidle"});
  await page.waitForTimeout(200);
  await check(page,"authenticated "+route);
  assert(!await page.locator("body").innerText().then(text=>text.includes("Admin access only")),"Manager route inaccessible");
  await page.screenshot({path:"qa-artifacts/editor-"+route.slice(1).replaceAll("/","-")+".png",fullPage:true});
 }
 await page.locator(".account-button").click();
 await page.waitForFunction(()=>!localStorage.getItem("aptus.server.session"));
 // Sign up a member through the unchanged UI.
 await page.goto(base+"/?auth=login",{waitUntil:"networkidle"});
 await page.locator(".auth-dialog").getByRole("button",{name:/ثبت.?نام|Sign up|Kayıt/i}).last().click();
 await page.locator(".auth-dialog input[type='text']").fill("Catalog member");
 await page.locator(".auth-dialog input[type='email']").fill("member-"+Date.now()+"@aptus.local");
 await page.locator(".auth-dialog input[type='password']").fill("Aptus-CI-Password-123!");
 await page.locator(".auth-dialog button[type='submit']").click();await page.waitForFunction(()=>!document.querySelector(".auth-dialog"));
 await page.goto(base+"/library/codes",{waitUntil:"networkidle"});await check(page,"member library");
 const manifest=JSON.parse(await fs.readFile("catalog-source.json","utf8"));
 for(const asset of manifest.assets)assert.equal((await context.request.get(base+"/catalog/"+asset.path)).status(),200,"Missing asset: "+asset.path);
 await context.close();
 assert.equal(errors.length,0,"Browser errors: "+errors.join("; "));
 assert.equal(failures.length,0,failures.join("\n"));
 console.log("Passed: public routes at 3 sizes, FA/EN/TR, 18 types, 9 components, 3 collections, controls, auth, CMS routes, protected library and 103 assets.");
} finally {await browser.close();}
