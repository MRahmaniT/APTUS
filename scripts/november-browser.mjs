import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const base="http://127.0.0.1:3000";
await mkdir("qa-artifacts",{recursive:true});
const browser=await chromium.launch();const errors=[];
try{
 for(const [name,width,height] of [["desktop",1440,1000],["tablet",820,1180],["mobile",390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:"reduce"});
  await context.addInitScript(()=>localStorage.setItem("locale","en"));const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
  for(const path of ["/","/types","/components","/products/columns","/projects","/news/latest","/news/events","/applications/industrial","/applications/warehouses","/applications/manufacturing","/applications/sports","/applications/educational","/about","/about/contact","/about/partners","/about/statistics","/library/articles","/library/articles/ci-article"]){
   await page.goto(base+path,{waitUntil:"networkidle"});assert.equal(await page.locator("html").getAttribute("lang"),"fa");assert.equal(await page.locator("html").getAttribute("dir"),"rtl");assert.ok((await page.locator("main").innerText()).length>25,path);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=4,name+" "+path+" overflow");
   if(path==="/"){
    assert.equal(await page.locator(".aptus-applications .ag-panel").count(),5);assert.equal(await page.locator(".part-selector button").count(),9);
    for(const control of await page.locator(".part-selector button").all()){await control.click();const dialog=page.locator(".part-dialog");await dialog.waitFor({state:"visible"});assert.ok((await dialog.innerText()).length>80);if(await control.getAttribute("data-part")==="column")await dialog.screenshot({path:"qa-artifacts/"+name+"-component-dialog.png"});assert.equal(await dialog.locator("a[href^='/products/']").count(),1);await page.keyboard.press("Escape");await dialog.waitFor({state:"detached"});}
    for(const pin of await page.locator(".model-frame .pin").all()){await pin.click();await page.locator(".part-dialog").waitFor();await page.keyboard.press("Escape");}
    const slides=page.locator(".design-project-slides");const first=await slides.locator("h3").innerText();await slides.getByRole("button",{name:"اسلاید بعدی",exact:true}).click();assert.notEqual(await slides.locator("h3").innerText(),first);
    assert.equal(await page.locator(".news-slides").count(),1);
    const event=page.locator(".event-announcement").first();await event.click();await page.locator(".event-dialog").waitFor();await page.keyboard.press("Escape");
    assert.equal(await page.locator(".catalog-download a[download]").count(),1);
    assert.equal(await page.locator(".footer-about a[href='/about']").count(),3);assert.equal(await page.locator(".footer-map img").count(),1);
    if(width===1440){const about=await page.locator(".footer-about").boundingBox(),contact=await page.locator(".footer-contact").boundingBox();assert.ok(about.x<contact.x,"About summary belongs on the left");}
    if(width<1260){await page.locator(".aptus-menu-toggle").click();const menu=page.locator(".aptus-mobile-menu");await menu.waitFor();for(const href of ["/types","/components","/projects","/library/articles","/about/statistics"])assert.equal(await menu.locator('a[href="'+href+'"]').count(),1);assert.equal(await menu.getByRole("button",{name:"EN",exact:true}).count(),0);await menu.locator('a[href="/types"]').click();await page.waitForURL("**/types");}
    await page.goto(base+"/",{waitUntil:"networkidle"});await page.screenshot({path:"qa-artifacts/november-"+name+"-home.png",fullPage:true});
   }
   if(path==="/types"){assert.equal(await page.locator(".type-family").count(),3);assert.ok((await page.locator("main").innerText()).includes("دودهانه نامتقارن"));}
   if(path==="/library/articles/ci-article"){assert.ok((await page.locator("main").innerText()).includes("چکیده عمومی مقاله"));assert.ok(!(await page.locator("main").innerText()).includes("PRIVATE_ARTICLE_BODY"));}
  }
  const pdf=await context.request.get(base+"/catalog-assets/aptus-catalog.pdf");assert.equal(pdf.status(),200);assert.equal((await pdf.body()).subarray(0,5).toString(),"%PDF-");
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));await page.goto(base+"/library/articles/ci-article?auth=login",{waitUntil:"networkidle"});const modal=page.locator(".aptus-auth-modal");
 await modal.screenshot({path:"qa-artifacts/mobile-code-login.png"});
 const email="browser-"+Date.now()+"@aptus.test";await modal.getByLabel("شماره همراه یا ایمیل",{exact:true}).fill(email);await modal.getByRole("button",{name:"ارسال کد",exact:true}).click();await modal.getByLabel("کد تأیید",{exact:true}).waitFor();
 const delivered=await context.request.get("http://127.0.0.1:3002/messages?to="+encodeURIComponent(email));const code=(await delivered.json()).code;await modal.getByLabel("کد تأیید",{exact:true}).fill(code);await modal.getByRole("button",{name:"تأیید و ورود",exact:true}).click();await modal.waitFor({state:"detached"});await page.getByText("PRIVATE_ARTICLE_BODY",{exact:true}).waitFor();
 await page.goto(base+"/library/codes",{waitUntil:"networkidle"});assert.equal(await page.locator("main h1").count(),1);await context.close();assert.deepEqual(errors,[]);
 console.log("PASS: 54 Persian page/viewport checks, disabled language switch, nine component pop-ups, eight pins, slideshows, events, application links, footer placement/map, PDF download and OTP article unlock.");
}finally{await browser.close();}
