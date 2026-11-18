import assert from "node:assert/strict";
import { chromium } from "playwright";

const production = "http://127.0.0.1:3000";
const development = "http://127.0.0.1:3003";
const password = "Aptus-CI-Password-123!";
const editorPaths = ["/projects", "/projects/ci-private-project", "/work", "/about/statistics", "/applications/industrial"];
const libraryPaths = ["/library/codes", "/library/books", "/library/glossary"];
const browser = await chromium.launch({ executablePath: process.env.APTUS_CHROME || undefined });
const errors = [];
const ready = async (page, base, path = "/") => {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.locator("main").waitFor();
};

async function assertHidden(page) {
  assert.equal(await page.locator('header a[href="/projects"], footer a[href="/projects"], .header-dropdown a[href="/about/statistics"], .admin-applications, .home-showcase a[href^="/projects/"]').count(), 0);
}

async function assertDenied(page, base, routes) {
  for (const path of routes) {
    await ready(page, base, path);
    await page.locator(".access-gate").waitFor();
    assert.equal(await page.locator("main").getByText("PRIVATE_PROJECT_BODY", { exact: true }).count(), 0);
  }
}

try {
  const memberContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const member = await memberContext.newPage();
  member.on("pageerror", e => errors.push(e.message));
  await ready(member, production);
  await assertHidden(member);
  await assertDenied(member, production, [...editorPaths, ...libraryPaths]);

  await ready(member, production, "/library/articles/ci-article");
  assert.equal(await member.getByText("PRIVATE_ARTICLE_BODY").count(), 0);
  await member.getByRole("button", { name: "ورود و مطالعه متن کامل" }).click();
  const codeForm = member.locator(".aptus-auth-modal[open]");
  const email = "browser-" + Date.now() + "@aptus.test";
  await codeForm.getByLabel("شماره همراه یا ایمیل").fill(email);
  await codeForm.getByRole("button", { name: "ارسال کد", exact: true }).click();
  await codeForm.getByLabel("کد تأیید").waitFor();
  await codeForm.screenshot({ path: "qa-artifacts/mobile-code-login.png" });
  const message = await memberContext.request.get("http://127.0.0.1:3002/messages?to=" + encodeURIComponent(email));
  assert.equal(message.status(), 200);
  const { code } = await message.json();
  await codeForm.getByLabel("کد تأیید").fill(code);
  await codeForm.getByRole("button", { name: "تأیید و ورود" }).click();
  await codeForm.waitFor({ state: "detached" });
  await member.getByText("PRIVATE_ARTICLE_BODY", { exact: true }).waitFor();
  for (const path of libraryPaths) {
    await ready(member, production, path);
    await member.getByText("PRIVATE_LIBRARY_BODY", { exact: true }).waitFor();
  }
  await assertDenied(member, production, editorPaths);
  await ready(member, production);
  await assertHidden(member);
  await member.locator(".aptus-menu-toggle").click();
  assert.equal(await member.locator(".aptus-mobile-menu a[href='/projects'], .aptus-mobile-menu a[href='/about/statistics']").count(), 0);
  await member.locator(".aptus-mobile-menu").getByRole("button", { name: "خروج", exact: true }).click();
  await ready(member, production, "/library/articles/ci-article");
  await member.getByRole("button", { name: "ورود و مطالعه متن کامل" }).waitFor();
  await memberContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const admin = await adminContext.newPage();
  admin.on("pageerror", e => errors.push(e.message));
  await ready(admin, development, "/?view=check");
  await admin.locator(".desktop-account .account-login").click();
  const modal = admin.locator(".aptus-auth-modal[open]");
  await modal.getByRole("button", { name: "ورود با رمز عبور", exact: true }).click();
  assert.equal(new URL(admin.url()).searchParams.get("view"), "check");
  await modal.getByLabel("ایمیل", { exact: true }).fill("ci-admin@aptus.test");
  await modal.getByLabel("رمز عبور", { exact: true }).fill("wrong-password");
  await modal.getByRole("button", { name: "ورود", exact: true }).click();
  await modal.getByRole("alert").waitFor();
  assert.equal(await modal.isVisible(), true);
  await modal.getByLabel("رمز عبور", { exact: true }).fill(password);
  await modal.getByRole("button", { name: "ورود", exact: true }).click();
  await modal.waitFor({ state: "detached" });
  assert.equal(new URL(admin.url()).searchParams.get("view"), "check");

  await admin.locator(".admin-applications").waitFor();
  assert.equal(await admin.locator(".admin-applications .ag-panel").count(), 5);
  const projectsLink = admin.locator(".aptus-desktop-nav .desktop-nav-entry").first().locator("a[href='/projects']");
  assert.equal(await projectsLink.isVisible(), true);
  await admin.locator(".home-showcase a[href='/projects/ci-private-project']").waitFor();
  await admin.screenshot({ path: "qa-artifacts/admin-home.png", fullPage: true });
  await admin.getByRole("button", { name: "درباره ما", exact: true }).click();
  await admin.locator(".header-dropdown:visible").getByRole("link", { name: "آمار سایت", exact: true }).click();
  await admin.locator(".stats-total").waitFor();
  await admin.screenshot({ path: "qa-artifacts/admin-statistics.png" });
  await projectsLink.click();
  await admin.getByText("پروژه آزمایشی مدیریت", { exact: true }).waitFor();
  await admin.locator("main a[href='/projects/ci-private-project']").first().click();
  await admin.getByText("PRIVATE_PROJECT_BODY", { exact: true }).waitFor();

  for (const path of ["/applications/industrial", "/applications/warehouses", "/applications/manufacturing",
    "/applications/sports", "/applications/educational", "/admin/content", "/admin/pages", "/admin/analytics", "/admin/profile"]) {
    await ready(admin, development, path);
    assert.equal(await admin.locator(".access-gate").count(), 0, path);
    await admin.locator("main h1").waitFor();
  }

  await admin.locator(".desktop-account").getByRole("button", { name: "خروج", exact: true }).click();
  await admin.locator(".access-gate").waitFor();
  await assertHidden(admin);
  await admin.locator(".desktop-account .account-login").click();
  await admin.keyboard.press("Escape");
  await modal.waitFor({ state: "detached" });
  assert.equal(new URL(admin.url()).searchParams.has("auth"), false);
  await adminContext.close();

  const fallback = await browser.newPage();
  fallback.on("pageerror", e => errors.push(e.message));
  await fallback.route("**/api/auth/otp/channels", route => route.fulfill({ json: { email: false, sms: false } }));
  await ready(fallback, development);
  await fallback.locator(".desktop-account .account-login").click();
  const passwordForm = fallback.locator(".aptus-auth-modal[open]");
  await passwordForm.getByLabel("رمز عبور", { exact: true }).waitFor();
  assert.equal(await passwordForm.getByRole("button", { name: "ارسال کد", exact: true }).count(), 0);
  await passwordForm.getByRole("button", { name: "بستن پنجره" }).click();
  await passwordForm.waitFor({ state: "detached" });
  assert.deepEqual(errors, []);
  console.log("PASS: development StrictMode login, bad password and retry, mobile OTP, password-only fallback, logout and guest/member/admin access.");
} finally { await browser.close(); }
