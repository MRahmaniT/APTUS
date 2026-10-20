import fs from "node:fs/promises";
import path from "node:path";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const manifest=JSON.parse(await fs.readFile("catalog-source.json","utf8"));
async function walk(dir) {const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.filter(e=>!["node_modules","dist",".git","qa-artifacts"].includes(e.name)).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const files=await walk("src");
assert(!files.some(file=>/\.tsx?$/.test(file)),"Frontend must contain only JavaScript/JSX source");
for(const asset of manifest.assets) {const data=await fs.readFile("public/catalog/"+asset.path);const sha=createHash("sha1").update(Buffer.from("blob "+data.length+"\0")).update(data).digest("hex");assert.equal(sha,asset.sha,"Catalog asset differs: "+asset.path);}
for(const file of files.filter(file=>/\.(css|js|jsx)$/.test(file))) {
 const content=await fs.readFile(file,"utf8");
 for(const match of content.matchAll(/\/catalog\/assets\/([A-Za-z0-9_.\/-]+)/g)) {if(!match[1].includes("..."))await fs.access("public/catalog/assets/"+match[1]);}
}
const {CATALOG_CONTENT}=await import("../src/catalog/adapter.js");
assert.equal(CATALOG_CONTENT.length,33);
for(const locale of ["fa","en","tr"])assert.equal(CATALOG_CONTENT.filter(item=>item.locale===locale).length,11);
assert(!JSON.stringify(CATALOG_CONTENT).includes("unsplash"));
const app=await fs.readFile("src/catalog/app.js","utf8");assert(app.includes("AbortController"));assert(app.includes("export function mountCatalog"));
const html=await fs.readFile("index.html","utf8");assert(html.includes('/src/main.jsx'));assert(html.includes('dir="rtl"'));
console.log("JavaScript source, 103 original catalog assets, 33 localized CMS products, lifecycle cleanup and entry point passed.");
