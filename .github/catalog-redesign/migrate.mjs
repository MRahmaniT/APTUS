
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {pathToFileURL} from "node:url";
import {execFileSync} from "node:child_process";
import ts from "typescript";
const templates=JSON.parse(await fs.readFile(".github/catalog-redesign/templates.json","utf8"));
const sourceSha="75c645424c5ac5dba0d27c15e889d07a1aeebf91";
const temp=await fs.mkdtemp(path.join(os.tmpdir(),"aptus-catalog-"));
async function walk(dir) {const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.filter(e=>!["node_modules","dist",".git"].includes(e.name)).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
try {
 const response=await fetch("https://codeload.github.com/MRahmaniT/APTUS-Catalog/tar.gz/"+sourceSha);
 if(!response.ok)throw new Error("Catalog download failed: "+response.status);
 await fs.writeFile(path.join(temp,"source.tgz"),Buffer.from(await response.arrayBuffer()));
 execFileSync("tar",["-xzf",path.join(temp,"source.tgz"),"-C",temp]);
 const catalog=path.join(temp,"APTUS-Catalog-"+sourceSha,"dist");
 await fs.mkdir("public/catalog",{recursive:true});
 await fs.cp(path.join(catalog,"assets"),"public/catalog/assets",{recursive:true});
 await fs.mkdir("src/catalog",{recursive:true});
 for(const name of ["content.js","supplied-content.js","i18n.js","editorial-i18n.js","styles.css","glass.css","brand.css","redesign.css"]) {
  let content=await fs.readFile(path.join(catalog,name),"utf8");
  content=content.replaceAll("./assets/","/catalog/assets/");
  await fs.writeFile("src/catalog/"+name,content);
 }
 let original=await fs.readFile(path.join(catalog,"app.js"),"utf8");
 const logo=original.match(/const brandLogo = \(\) => `([\s\S]*?)`;/);
 if(!logo)throw new Error("Missing source logo");
 await fs.writeFile("public/catalog/assets/brand.svg",logo[1]);
 const imports=original.slice(0,original.indexOf("\n\n"));
 let body=original.slice(original.indexOf("const ui = copy[lang];"));
 body='const controller = new AbortController();\nconst params = new URLSearchParams(window.location.search);\nconst lang = locale;\n'+body;
 body=body.replaceAll("./assets/","/catalog/assets/").replaceAll("./index.html","/");
 const headerStart=body.indexOf('function header('),headerEnd=body.indexOf('function roofIcon()',headerStart);
 body=body.slice(0,headerStart)+'function header(){ return ""; }\nfunction footer(){ return ""; }\n\n'+body.slice(headerEnd);
 const menuStart=body.indexOf('  const toggle = document.querySelector(".menu-toggle");');
 const menuEnd=body.indexOf('  const modelImg = document.getElementById("model-img");',menuStart);
 if(menuStart<0||menuEnd<0)throw new Error("Catalog navigation boundary changed");
 body=body.slice(0,menuStart)+body.slice(menuEnd);
 const scrollStart=body.indexOf('  if (!params.has("type") && !params.has("part")) {\n    const setActiveNav');
 const scrollEnd=body.indexOf('\n}\n\nconst typeMatch',scrollStart);
 if(scrollStart<0||scrollEnd<0)throw new Error("Catalog scroll boundary changed");
 body=body.slice(0,scrollStart)+body.slice(scrollEnd);
 body=body.replaceAll('pageLink("parts")','pageLink("explore")');
 body=body.replaceAll("document.querySelectorAll(","app.querySelectorAll(").replaceAll("document.querySelector(","app.querySelector(").replaceAll("document.getElementById(","app.querySelector(\"#\"+");
 body=body.replaceAll("document.body.appendChild(readout)","app.appendChild(readout)");
 body=body.replaceAll("<main>","<div class=\"catalog-main\">").replaceAll("<main class=","<div class=").replaceAll("</main>","</div>");
 const wrapped=imports+'\n\nexport function mountCatalog(app, locale = "fa") {\n'+body+'\nreturn () => { controller.abort(); app.replaceChildren(); };\n}\n';
 const source=ts.createSourceFile("app.js",wrapped,ts.ScriptTarget.ESNext,true,ts.ScriptKind.JS);
 const transformed=ts.transform(source,[(context)=>root=>ts.visitNode(root,function visit(node) {
  const current=ts.visitEachChild(node,visit,context);
  if(ts.isCallExpression(current)&&ts.isPropertyAccessExpression(current.expression)&&current.expression.name.text==="addEventListener") {
   const args=[...current.arguments];
   args[2]=ts.factory.createObjectLiteralExpression([...(args[2]?[ts.factory.createSpreadAssignment(args[2])]:[]),ts.factory.createPropertyAssignment("signal",ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("controller"),"signal"))]);
   return ts.factory.updateCallExpression(current,current.expression,current.typeArguments,args);
  }
  return current;
 })]);
 await fs.writeFile("src/catalog/app.js",ts.createPrinter().printFile(transformed.transformed[0]));
 transformed.dispose();

 let context=await fs.readFile("src/controllers/AppContext.tsx","utf8");
 context=context.replace('useState<Locale>("fa")','useState<Locale>(() => { try { const saved = new URLSearchParams(window.location.search).get("lang") || localStorage.getItem("locale"); return ["fa","en","tr"].includes(saved || "") ? saved as Locale : "fa"; } catch { return "fa"; } })');
 context=context.replace('const savedLocale = localStorage.getItem("locale") as Locale;','const savedLocale = (new URLSearchParams(window.location.search).get("lang") || localStorage.getItem("locale")) as Locale;');
 context=context.replace(/document\.body\.style\.fontFamily = [^;]+;/,'document.body.style.fontFamily = "\\"Noto Arabic\\", Tahoma, Arial, sans-serif";');
 await fs.writeFile("src/controllers/AppContext.tsx",context);
 for(const file of [...await walk("src"),"vite.config.ts"]) {
  if(!/\.tsx?$/.test(file))continue;
  if(file.endsWith(".d.ts")){await fs.rm(file);continue;}
  const content=await fs.readFile(file,"utf8");
  const result=ts.transpileModule(content,{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.Preserve,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,isolatedModules:true,esModuleInterop:true}});
  const errors=(result.diagnostics||[]).filter(item=>item.category===ts.DiagnosticCategory.Error);
  if(errors.length)throw new Error("Invalid TypeScript input: "+file);
  await fs.writeFile(file.replace(/\.tsx$/,".jsx").replace(/\.ts$/,".js"),result.outputText);
  await fs.rm(file);
 }

 // Retain the website's news/project records and translations; replace only product defaults.
 const oldSeeds=await import(pathToFileURL(path.resolve("src/data/contentSeed.js")).href);
 const oldTranslations=await import(pathToFileURL(path.resolve("src/data/contentTranslations.js")).href);
 const editorial=oldSeeds.CONTENT_SEED.filter(item=>item.type!=="product");
 const localizedEditorial=editorial.flatMap(item=>["fa","tr"].flatMap(locale=>{
  const translated=oldTranslations.CONTENT_TRANSLATIONS[locale][item.slug];
  return translated?[{...item,id:item.id+"-"+locale,locale,title:translated.title,abstract:translated.abstract,body:translated.abstract,category:translated.category,highlights:[],specs:{},seo:{title:translated.title,description:translated.abstract},media:item.media.map(entry=>({...entry,alt:translated.title}))}]:[];
 }));
 await fs.writeFile("src/data/editorialContent.js","export const EDITORIAL_CONTENT = "+JSON.stringify([...editorial,...localizedEditorial],null,2)+";\n");
 await fs.writeFile("src/data/contentSeed.js",'import { CATALOG_CONTENT } from "../catalog/adapter.js";\nimport { EDITORIAL_CONTENT } from "./editorialContent.js";\nexport const CONTENT_SEED = [...CATALOG_CONTENT.filter(item => item.locale === "en"), ...EDITORIAL_CONTENT.filter(item => item.locale === "en")];\n');
 await fs.writeFile("src/data/localizedContentSeed.js",'import { CATALOG_CONTENT } from "../catalog/adapter.js";\nimport { EDITORIAL_CONTENT } from "./editorialContent.js";\nexport const LOCALIZED_CONTENT_SEED = [...CATALOG_CONTENT.filter(item => item.locale !== "en"), ...EDITORIAL_CONTENT.filter(item => item.locale !== "en")];\n');

 let repository=await fs.readFile("src/repositories/ContentRepository.js","utf8");
 repository='import { catalogAliases } from "../catalog/adapter.js";\n'+repository;
 repository=repository.replace('return stored ? JSON.parse(stored) : cloneBaseContent();','if (!stored) return cloneBaseContent();\n        const custom = JSON.parse(stored).filter(item => !String(item.id).startsWith("seed-"));\n        const keys = new Set(custom.map(item => [item.type,item.slug,item.locale].join(":")));\n        return [...custom,...cloneBaseContent().filter(item => !keys.has([item.type,item.slug,item.locale].join(":")))];');
 repository=repository.replace('async getBySlug(type, slug, locale, includeDrafts = false) {','async getBySlug(type, slug, locale, includeDrafts = false) {\n        if (type === "product") slug = catalogAliases[slug] || slug;');
 await fs.writeFile("src/repositories/ContentRepository.js",repository);
 let pages=await fs.readFile("src/data/pageSeed.js","utf8");
 pages='import { company } from "../catalog/content.js";\n'+pages;
 pages=pages.replace('abstract: descriptions[locale][section],','abstract: path === "about/contact" || path === "about/location" ? (locale === "fa" ? company.legalDescriptor : company.englishName) : descriptions[locale][section],');
 pages=pages.replace('body: descriptions[locale][section],','body: path === "about/contact" || path === "about/location" ? [locale === "fa" ? company.legalDescriptor : company.englishName,company.address,company.phone].join("\\n\\n") : descriptions[locale][section],');
 pages=pages.replace('heroImage: "",','heroImage: path === "about/location" ? "/catalog/assets/map.png" : "",');
 await fs.writeFile("src/data/pageSeed.js",pages);
 let auth=await fs.readFile("src/components/AuthModal.jsx","utf8");
 auth=auth.replace('navigate(location.pathname, { replace: true });','const next = new URLSearchParams(searchParams);\n        next.delete("auth");\n        navigate({ pathname: window.location.pathname, search: next.toString(), hash: window.location.hash }, { replace: true });');
 auth=auth.replace('className="fixed inset-0 z-[100]','role="dialog" aria-modal="true" aria-labelledby="auth-title" className="auth-dialog fixed inset-0 z-[100]');
 auth=auth.replace('<h2 className=','<h2 id="auth-title" className=');
 await fs.writeFile("src/components/AuthModal.jsx",auth);

 for(const [file,content] of Object.entries(templates)) {await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,content);}
 const pkg=JSON.parse(await fs.readFile("package.json","utf8"));
 delete pkg.devDependencies.typescript;delete pkg.devDependencies["@types/node"];delete pkg.devDependencies["@types/react"];delete pkg.devDependencies["@types/react-dom"];
 pkg.scripts.check="node scripts/check-project.mjs";pkg.scripts.typecheck="npm run check";pkg.scripts["test:browser"]="node scripts/browser-smoke.mjs";
 await fs.writeFile("package.json",JSON.stringify(pkg,null,2)+"\n");
 await fs.rm("tsconfig.json");await fs.rm("bun.lock",{force:true});
 execFileSync("npm",["install","--package-lock-only","--ignore-scripts"],{stdio:"inherit"});
 let smoke=await fs.readFile("server/src/smoke.js","utf8");
 smoke=smoke.replace('const email = `ci-${Date.now()}@aptus.local`;','const email = process.env.SMOKE_EMAIL || `ci-${Date.now()}@aptus.local`;');
 await fs.writeFile("server/src/smoke.js",smoke);
 let readme=await fs.readFile("README.md","utf8");
 readme=readme.replace("- React + Vite frontend","- JavaScript/JSX + React/Vite frontend, using the APTUS catalog design and bundled content");
 readme=readme.replace("frontend typecheck/build","JavaScript/catalog checks, production build");
 readme+='\n## Catalog redesign\n\nSee [catalog redesign](docs/catalog-redesign.md) for the pinned source, shared content, preserved CMS features and validation. Run `npm run check` to verify JavaScript source and copied catalog assets. The finished branch is `main2`.\n';
 await fs.writeFile("README.md",readme);
 await fs.rm(".github/catalog-redesign",{recursive:true});
} finally {await fs.rm(temp,{recursive:true,force:true});}
