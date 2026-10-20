import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
const git=(...args)=>execFileSync("git",args,{encoding:"utf8",maxBuffer:16*1024*1024});
const baseline="b01a0571a1cf2d440e82ef852038b9298f74dcb4";
const changed=git("diff","--name-only",baseline,"HEAD").trim().split("\n");
assert.deepEqual(changed.filter(p=>p.startsWith("server/")||p.startsWith("local-db/")||p==="src/routes.tsx"||p.includes("AuthModal")||p.includes("ProtectedRoutes")||p.includes("AppContext")||p.includes("Admin")),[],"Preserve website routes, CMS controls, accounts and backend");
const home=readFileSync("src/views/Home.tsx","utf8");
for(const hook of ['id="cover"','id="about"','<CatalogParts','id="system"','<AccordionGallery'])assert.ok(home.includes(hook),hook);
const manifest=JSON.parse(readFileSync("public/catalog-assets/manifest.json","utf8"));
for(const asset of manifest.assets){
 assert.equal(git("hash-object","public/catalog-assets/"+asset.path).trim(),asset.sha,asset.path);
 assert.ok(readFileSync("public/catalog-assets/"+asset.path).length>140,asset.path);
}
console.log("PASS: website structure and functionality preserved; all imported catalog assets match pinned source bytes");
