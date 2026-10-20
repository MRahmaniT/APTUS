const apiBase = (process.env.API_BASE || "http://127.0.0.1:3000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, options);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed (${response.status}): ${typeof data === "string" ? data : data?.message || text}`);
  }
  return data;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const email = `ci-${Date.now()}@aptus.local`;
const password = "Aptus-CI-Password-123!";

const signup = await request("/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "APTUS CI Manager", email, password }),
});

assert(signup?.user?.role === "manager", "First account should become manager");
assert(signup?.session?.access_token, "Signup should create a session token");
const token = signup.session.access_token;
const authHeaders = { Authorization: `Bearer ${token}` };

const me = await request("/auth/me", { headers: authHeaders });
assert(me?.user?.email === email, "Authenticated /me should return the created account");

const created = await request("/content", {
  method: "POST",
  headers: { ...authHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "product",
    slug: "ci-test-product",
    locale: "en",
    status: "published",
    templateKey: "showcase",
    title: "CI Test Product",
    abstract: "PostgreSQL integration test content.",
    body: "Created by the automated self-hosted API smoke test.",
    coverImage: "",
    category: "Test",
    highlights: ["Local database"],
    specs: { Database: "PostgreSQL" },
    cta: {},
    seo: {},
    media: [],
  }),
});
assert(created?.id, "Content creation should return an id");

const publicItem = await request("/content/product/ci-test-product?locale=en");
assert(publicItem?.title === "CI Test Product", "Published content should be publicly readable");

await request("/settings", {
  method: "PUT",
  headers: { ...authHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ key: "ci:setting", value: { ok: true } }),
});
const setting = await request("/settings?key=ci%3Asetting");
assert(setting?.ok === true, "Site settings should round-trip through PostgreSQL");

await request("/analytics/view", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ date: "2026-09-17", path: "/ci-smoke" }),
});
const analytics = await request("/analytics?date=2026-09-17", { headers: authHeaders });
assert(Number(analytics?.views || 0) >= 1, "Analytics view should be persisted");

const profile = await request(`/profile/${signup.user.id}`, {
  method: "PATCH",
  headers: { ...authHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "APTUS CI Manager Updated", phone: "+1 555 0100", bio: "Smoke test" }),
});
assert(profile?.name === "APTUS CI Manager Updated", "Profile changes should persist");

await request("/auth/logout", { method: "POST", headers: authHeaders });
console.log("APTUS PostgreSQL/API smoke test passed");
