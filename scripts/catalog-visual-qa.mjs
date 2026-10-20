import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch();
await mkdir("qa-artifacts",{recursive:true});
const context = await browser.newContext({ viewport:{width:1440,height:1000},deviceScaleFactor:0.667 });
const page = await context.newPage();
async function capture(name,url,selector) {
  await page.goto(url,{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  if(selector) await page.locator(selector).first().scrollIntoViewIfNeeded();
  const bytes=await page.screenshot({type:"jpeg",quality:60,path:"qa-artifacts/"+name+".jpg"});
  const data=bytes.toString("base64");
  for(let i=0;i<data.length;i+=12000) console.log("VISUAL|"+name+"|"+String(i).padStart(7,"0")+"|"+data.slice(i,i+12000));
}
try{
  await capture("catalog-cover","http://127.0.0.1:3001/");
  await capture("website-cover","http://127.0.0.1:3000/");
  await capture("catalog-about","http://127.0.0.1:3001/",".about-rich");
  await capture("website-products","http://127.0.0.1:3000/",".aptus-home > section:nth-child(2)");
  await capture("catalog-system","http://127.0.0.1:3001/",".system-grid");
  await capture("website-system","http://127.0.0.1:3000/",".aptus-home > section:nth-child(3)");
  await capture("catalog-cards","http://127.0.0.1:3001/?part=all",".part-card");
}catch(error){console.error(error);throw error;}finally{await browser.close();}
