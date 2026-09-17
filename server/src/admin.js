import { Router } from "express";
import { optionalUser, requireEditor, requireUser, publicUser } from "./auth.js";
import { query } from "./db.js";

const adminRouter = Router();

function isEditor(user) {
  return Boolean(user && ["admin", "manager"].includes(user.role));
}

adminRouter.get("/profile/:id", optionalUser, requireUser, async (req, res) => {
  if (req.user.id !== req.params.id && !isEditor(req.user)) {
    return res.status(403).json({ message: "You can only read your own profile." });
  }
  const result = await query("select * from users where id = $1 limit 1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Profile not found." });
  res.json(publicUser(result.rows[0]));
});

adminRouter.patch("/profile/:id", optionalUser, requireUser, async (req, res) => {
  if (req.user.id !== req.params.id && !isEditor(req.user)) {
    return res.status(403).json({ message: "You can only edit your own profile." });
  }
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ message: "Display name is required." });
  const result = await query(
    `update users
        set name = $1, phone = $2, photo_url = $3, bio = $4
      where id = $5
      returning *`,
    [
      name,
      String(req.body?.phone || "").trim() || null,
      String(req.body?.photoURL || "").trim() || null,
      String(req.body?.bio || "").trim() || null,
      req.params.id,
    ],
  );
  if (!result.rows[0]) return res.status(404).json({ message: "Profile not found." });
  res.json(publicUser(result.rows[0]));
});

adminRouter.get("/profiles", optionalUser, requireEditor, async (_req, res) => {
  const rows = (await query("select * from users order by created_at desc")).rows;
  res.json(rows.map(publicUser));
});

adminRouter.patch("/profiles/:id/role", optionalUser, requireEditor, async (req, res) => {
  const role = String(req.body?.role || "");
  if (!["member", "admin", "manager"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }
  if (req.user.id === req.params.id && req.user.role === "manager" && role !== "manager") {
    const managers = Number((await query("select count(*)::int as count from users where role = 'manager'")).rows[0].count);
    if (managers <= 1) return res.status(400).json({ message: "The last manager cannot demote their own account." });
  }
  const result = await query("update users set role = $1 where id = $2 returning *", [role, req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: "User not found." });
  res.json(publicUser(result.rows[0]));
});

adminRouter.get("/settings", async (req, res) => {
  const key = String(req.query.key || "");
  if (!key) return res.status(400).json({ message: "Setting key is required." });
  const result = await query("select value from site_settings where key = $1 limit 1", [key]);
  if (!result.rows[0]) return res.status(404).json({ message: "Setting not found." });
  res.json(result.rows[0].value);
});

adminRouter.put("/settings", optionalUser, requireEditor, async (req, res) => {
  const key = String(req.body?.key || "").trim();
  const value = req.body?.value;
  if (!key || !value || typeof value !== "object" || Array.isArray(value)) {
    return res.status(400).json({ message: "A setting key and object value are required." });
  }
  await query(
    `insert into site_settings(key, value, updated_by)
     values($1, $2::jsonb, $3)
     on conflict(key) do update set value = excluded.value, updated_by = excluded.updated_by`,
    [key, JSON.stringify(value), req.user.id],
  );
  res.status(204).end();
});

adminRouter.post("/analytics/view", async (req, res) => {
  const day = String(req.body?.date || new Date().toISOString().slice(0, 10));
  const path = String(req.body?.path || "/").slice(0, 500) || "/";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return res.status(400).json({ message: "Invalid analytics date." });
  await query(
    `insert into analytics_daily(day, path, views)
     values($1, $2, 1)
     on conflict(day, path) do update set views = analytics_daily.views + 1`,
    [day, path],
  );
  res.status(204).end();
});

adminRouter.get("/analytics", optionalUser, requireEditor, async (req, res) => {
  const day = String(req.query.date || new Date().toISOString().slice(0, 10));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return res.status(400).json({ message: "Invalid analytics date." });
  const result = await query("select coalesce(sum(views), 0)::bigint as views from analytics_daily where day = $1", [day]);
  res.json({ views: Number(result.rows[0]?.views || 0) });
});

export { adminRouter };
