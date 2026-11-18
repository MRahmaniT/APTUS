import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:3000";
const slugs = ["single-storey-design", "double-storey-design", "multi-storey-design"];
const publicRoutes = ["/types", ...slugs.map(slug => "/types/" + slug), "/components", "/products/columns", "/products/facades",
  "/news", "/news/latest", "/news/events", "/news/aips-building-system-introduction", "/about", "/about/contact", "/about/location",
  "/about/partners", "/about/memberships", "/about/affiliations", "/library/articles", "/library/articles/ci-article"];
const errors = [];

await mkdir("qa-artifacts", { recursive: true });
const browser = await chromium.launch();

async function checkHome(page, name, width) {
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".home-showcase .ag-panel").count(), 6);
  assert.equal(await page.locator("main #about, main .applications-heading, .explore-dock .part-dock").count(), 0);
  assert.equal(await page.locator(".system-copy > p + a[download]").count(), 1);
  assert.equal(await page.locator(".part-selector button").count(), 9);
  for (const control of await page.locator(".part-selector button, .model-frame .pin").all()) {
    await control.click();
    const dialog = page.locator("dialog.part-dialog[open]");
    await dialog.waitFor();
    assert.ok((await dialog.innerText()).length > 60);
    assert.equal(await dialog.locator(".dock-text").count() <= 2, true);
    if (await control.getAttribute("data-part") === "column") await dialog.screenshot({ path: "qa-artifacts/" + name + "-part-dialog.png" });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
  }
  const news = page.getByRole("region", { name: "مهم‌ترین اخبار" });
  assert.equal(await news.locator(".update-card").count(), width >= 650 ? 2 : 1);
  const secondPage = news.getByRole("button", { name: "صفحه 2" });
  if (await secondPage.count()) {
    const firstTitle = await news.locator("h3").first().innerText();
    await secondPage.click();
    assert.notEqual(await news.locator("h3").first().innerText(), firstTitle);
  }
  assert.equal(await page.locator(".slideshow-controls").count(), 0);
  await page.getByRole("region", { name: "رویدادها", exact: true }).locator(".update-card button").first().click();
  await page.locator(".event-dialog[open]").waitFor();
  await page.keyboard.press("Escape");
  await page.locator(".event-dialog").waitFor({ state: "detached" });

  const about = await page.locator(".footer-about").boundingBox();
  const contact = await page.locator(".footer-contact").boundingBox();
  assert.ok(width > 800 ? about.x > contact.x : about.y < contact.y);
  assert.equal(await page.locator(".footer-about img").count(), 0);
  assert.equal(await page.locator(".footer-map img").count(), 1);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.screenshot({ path: "qa-artifacts/" + name + "-home.png", fullPage: true });
  await page.locator(".footer-links a[href='/types']").click();
  await page.waitForURL("**/types");
  await page.waitForFunction(() => scrollY === 0);

  if (name === "desktop") {
    const menu = page.getByRole("button", { name: "درباره محصول", exact: true });
    await menu.hover();
    const link = page.locator(".header-dropdown:visible").getByRole("link", { name: "تیپ‌بندی", exact: true });
    const bounds = await link.boundingBox();
    await page.mouse.move(bounds.x + bounds.width - 30, bounds.y + bounds.height / 2, { steps: 18 });
    assert.equal(await link.isVisible(), true, "Hover menu remains open along the path from the trigger");
    await menu.click();
    await page.mouse.move(2, 500);
    assert.equal(await link.isVisible(), true, "Click pins the menu open");
    await page.keyboard.press("Escape");
    await link.waitFor({ state: "hidden" });
    await menu.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    assert.equal(await link.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press("Enter");
    await page.waitForURL("**/types");
  } else {
    await page.locator(".aptus-menu-toggle").click();
    const menu = page.locator(".aptus-mobile-menu");
    assert.equal(await menu.locator("a[href='/types']").count(), 1);
    assert.equal(await menu.getByRole("button", { name: "EN", exact: true }).count(), 0);
    await menu.locator("a[href='/types']").click();
  }
}

try {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["tablet", 820, 1180], ["mobile", 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce",
      ...(name === "mobile" ? { hasTouch: true, isMobile: true } : {}) });
    await context.addInitScript(() => localStorage.setItem("locale", "en"));
    const page = await context.newPage();
    page.on("pageerror", e => errors.push(e.message));
    await checkHome(page, name, width);
    for (const route of publicRoutes) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator("html").getAttribute("lang"), "fa");
      assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
      assert.ok((await page.locator("main").innerText()).trim().length > 12, route);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 4, name + " " + route);
      if (route === "/types") {
        assert.equal(await page.locator(".type-family").count(), 3);
        assert.equal(await page.locator("main h1").innerText(), "تیپ‌بندی");
      }
      if (route.startsWith("/types/")) {
        assert.equal(await page.locator(".types-table tbody tr").count(), 3);
        assert.equal(await page.locator(".types-table .type-cell").count(), 18);
        await page.locator(".types-table .type-cell").first().click();
        await page.locator(".type-matrix-dialog[open]").waitFor();
        if (name === "mobile") await page.locator(".type-matrix-dialog button").click();
        else await page.keyboard.press("Escape");
        if (route.endsWith(slugs[0])) await page.screenshot({ path: "qa-artifacts/" + name + "-type-matrix.png" });
        await page.getByRole("link", { name: "بازگشت به تیپ‌بندی‌ها" }).click();
        await page.waitForURL("**/types");
        await page.waitForFunction(() => scrollY === 0);
      }
      if (route.endsWith("ci-article")) {
        assert.ok((await page.locator("main").innerText()).includes("چکیده عمومی مقاله"));
        assert.ok(!(await page.locator("main").innerText()).includes("PRIVATE_ARTICLE_BODY"));
      }
    }
    await page.goto(base + "/products");
    await page.waitForURL("**/types");
    await page.goto(base + "/products/" + slugs[0]);
    await page.waitForURL("**/types/" + slugs[0]);
    const pdf = await context.request.get(base + "/catalog-assets/aptus-catalog.pdf");
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: public pages at three widths, continuous and pinned navigation, six-panel showcase, part and event dialogs, type matrices, footer placement and catalog PDF.");
} finally { await browser.close(); }
