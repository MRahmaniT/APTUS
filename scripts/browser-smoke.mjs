import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.WEB_BASE || "http://127.0.0.1:3000";
await mkdir("qa-artifacts", { recursive: true });
const browser = await chromium.launch();
const errors = [];
const routes = ["/", "/products", "/products/columns", "/products/double-storey-design",
  "/products/multi-storey-design", "/products/wall-panels", "/products/slabs", "/products/beams", "/products/facades", "/products/modular", "/products/tie-beams", "/products/foundations", "/products/architectural-panels", "/products/corner-elements", "/news", "/projects", "/about/contact", "/about/location"];
try {
  for (const [name, width, height] of [["desktop",1440,1000],["tablet",820,1180],["mobile",390,844]]) {
    for (const locale of ["fa", "en", "tr"]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.addInitScript(value => localStorage.setItem("locale", value), locale);
      const page = await context.newPage();
      page.on("pageerror", error => errors.push(error.message));
      for (const route of routes) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        await page.waitForFunction(lang => document.documentElement.lang === lang, locale);
        await page.locator("main").waitFor();
        assert.equal(await page.locator("html").getAttribute("dir"), locale === "fa" ? "rtl" : "ltr");
        assert.ok((await page.locator("main").innerText()).trim().length > 30, name + locale + route);
        assert.equal(await page.locator("#model-frame").count(), route === "/" ? 1 : 0);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert.ok(overflow <= 4, name + " " + locale + " " + route + ": overflow " + overflow);
        if (route === "/") {
          assert.equal(await page.locator(".catalog-home > section").count(), 4);
          assert.equal(await page.locator(".accordion-gallery .ag-panel").count(), 5);
          assert.equal(await page.locator(".part-selector button").count(), 9);
          assert.equal(await page.locator(".model-frame .pin").count(), 8);
          const components = ["column","longitudinal-beam","girder","purlin","self-standing-wall","tie-beam","foundation","wall-base","corner-wall"];
          for(const id of components){
            const control=page.locator('.part-selector button[data-part="'+id+'"]');
            await control.click();
            await page.waitForFunction(selected=>document.querySelector('.part-selector button[data-part="'+selected+'"]')?.getAttribute("aria-pressed")==="true",id);
            assert.equal(await page.locator(".part-selector button[aria-pressed=true]").count(),1);
            assert.equal(await page.locator("#part-preview h3").innerText(),(await control.innerText()).replace(/^[0-9]+ */,""));
            assert.ok((await page.locator("#part-preview a").getAttribute("href")).startsWith("/products/"));
            if(id!=="corner-wall")assert.equal(await page.locator('.leader-lines line[data-pin-of="'+id+'"].is-active').count(),1);
          }
          await page.locator('.model-frame .pin[data-part="column"]').click();
          assert.equal(await page.locator('.part-selector button[data-part="column"]').getAttribute("aria-pressed"),"true");
          const panels=page.locator(".aptus-applications .ag-panel");
          await page.keyboard.press("Tab");
          await panels.nth(0).focus();
          await page.waitForFunction(()=>document.querySelector(".aptus-applications .ag-panel")?.getAttribute("aria-current")==="true");
          await page.waitForFunction(()=>{
            const p=[...document.querySelectorAll(".aptus-applications .ag-panel")];
            return parseFloat(getComputedStyle(p[0]).flexGrow)>2*parseFloat(getComputedStyle(p[1]).flexGrow);
          });
          await panels.nth(0).press("ArrowRight");
          await page.waitForFunction(()=>document.querySelectorAll(".aptus-applications .ag-panel")[1]?.getAttribute("aria-current")==="true");
          if(width>=1024){await panels.nth(4).hover();await page.waitForFunction(()=>document.querySelectorAll(".aptus-applications .ag-panel")[4]?.getAttribute("aria-current")==="true");}
          await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
          assert.ok((await page.locator("h1").innerText()).includes(
            locale === "fa" ? "سوله بتنی" : locale === "en" ? "industrial sheds" : "beton"));
          assert.equal(await page.locator(".accordion-gallery img[src='/catalog-assets/applications/industry.jpg']").count(), 1);
          const theme = await page.locator(".aptus-header").evaluate(el => ({
            radius: getComputedStyle(el).borderRadius,
            orange: getComputedStyle(el).getPropertyValue("--aptus-orange").trim(),
            font: getComputedStyle(el).fontFamily,
          }));
          assert.ok(["#f58220", "rgb(245, 130, 32)"].includes(theme.orange));
          assert.ok(parseInt(theme.radius) >= 26);
          if (locale === "fa") assert.ok(theme.font.includes("APTUS Sans"));
          await page.evaluate(() => document.fonts.ready);
          if (locale === "fa") assert.ok(await page.evaluate(() => document.fonts.check('16px "APTUS Sans"')));
          // Local website media must contain image bytes rather than Git LFS pointer text.
          for (const path of ["/catalog-assets/cover-render3.png", "/images/aptus-brand.svg", "/catalog-assets/applications/industry.jpg"]) {
            const response = await context.request.get(base + path);
            assert.equal(response.status(), 200);
            assert.ok((await response.body()).length > 1024, path + " must be a real image");
          }
          await page.screenshot({ path: "qa-artifacts/" + name + "-" + locale + "-home.png", fullPage: true });
          if (width < 1024) {
            await page.locator(".aptus-menu-toggle").click();
            const menu = page.locator(".aptus-mobile-menu");
            await menu.waitFor({ state: "visible" });
            assert.equal(await menu.locator("a[href='/library/books']").count(), 1);
            assert.equal(await menu.locator("a[href='/news/events']").count(), 1);
            await menu.locator("a[href='/products']").click();
            await page.waitForURL("**/products");
            assert.equal(await menu.count(), 0);
          }
        }
        const images = await page.locator('main img[src^="/catalog-assets/"]').evaluateAll(async elements => {
          return Promise.all(elements.map(async el => {
            el.loading = "eager";
            try { await el.decode(); } catch {}
            return {src:el.getAttribute("src"),loaded:el.naturalWidth>0};
          }));
        });
        for(const image of images) assert.ok(image.loaded, name+" "+locale+" "+route+" "+image.src);
        if (route === "/products/columns") {
          assert.ok((await page.locator("main").innerText()).includes(locale==="fa"?"ستون":locale==="en"?"column":"kolon"));
          assert.equal(await page.locator('a[href="/catalog-assets/technical/column.pdf"]').count(),1);
        }
        if (route === "/products") {
          for (const slug of ["columns", "double-storey-design", "multi-storey-design"]) {
            assert.equal(await page.locator(".aptus-content-card[href='/products/" + slug + "']").count(), 1);
          }
          const card = page.locator(".aptus-content-card").first();
          assert.equal(await card.evaluate(el => getComputedStyle(el).borderRadius), width <= 580 ? "20px" : "27px");
          await page.screenshot({ path: "qa-artifacts/" + name + "-" + locale + "-products.png", fullPage: true });
        }
      }
      await context.close();
    }
  }
  // Exercise the original account dialog and member library access against the running API.
  const context = await browser.newContext({ viewport: { width:1440, height:1000 } });
  await context.addInitScript(() => localStorage.setItem("locale", "en"));
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "/library/codes", { waitUntil: "networkidle" });
  const guestText = await page.locator("main").innerText();
  await page.goto(base + "/?auth=login", { waitUntil: "networkidle" });
  const modal = page.locator(".aptus-auth-modal");
  await modal.getByRole("button", { name:"Sign up", exact:true }).click();
  const email = "visual-" + Date.now() + "@example.com";
  const password = "Aptus-Browser-Check-2026!";
  await modal.locator("input[type=text]").fill("Visual QA Member");
  await modal.locator("input[type=email]").fill(email);
  await modal.locator("input[type=password]").fill(password);
  await modal.locator("button[type=submit]").click();
  await modal.waitFor({ state: "hidden" });
  await page.getByTitle("Logout", { exact:true }).waitFor();
  await page.goto(base + "/library/codes", { waitUntil: "networkidle" });
  assert.notEqual(await page.locator("main").innerText(), guestText);
  assert.equal(await page.locator("main h1").count(), 1);
  await page.getByTitle("Logout", { exact:true }).click();
  await page.goto(base + "/?auth=login", { waitUntil:"networkidle" });
  await modal.locator("input[type=email]").fill(email);
  await modal.locator("input[type=password]").fill(password);
  await modal.locator("button[type=submit]").click();
  await modal.waitFor({ state:"hidden" });
  await page.getByTitle("Logout", { exact:true }).waitFor();
  await context.close();
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log("PASS: public routes in three viewports and languages; catalog content, real images, technical PDFs, original sections, mobile menus, account and protected library.");
} finally {
  await browser.close();
}
