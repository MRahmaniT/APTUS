import { Router } from "express";
import { optionalUser, requireEditor } from "./auth.js";
import { query, withTransaction } from "./db.js";

const contentRouter = Router();
const contentTypes = new Set(["product", "news", "project"]);
const locales = new Set(["en", "fa", "tr"]);
const statuses = new Set(["draft", "published"]);
const templates = new Set(["showcase", "editorial", "technical", "case-study", "gallery"]);

function isEditor(user) {
  return Boolean(user && ["admin", "manager"].includes(user.role));
}

function rowToItem(row, media = []) {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    locale: row.locale,
    status: row.status,
    templateKey: row.template_key,
    title: row.title,
    abstract: row.abstract || "",
    body: row.body || "",
    coverImage: row.cover_image || "",
    category: row.category || undefined,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    specs: row.specs || {},
    cta: row.cta || {},
    seo: row.seo || {},
    media: media.map((entry) => ({
      id: entry.id,
      mediaType: entry.media_type,
      url: entry.url,
      caption: entry.caption || undefined,
      alt: entry.alt || undefined,
      sortOrder: entry.sort_order || 0,
    })),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

async function hydrateRows(rows) {
  if (!rows.length) return [];
  const ids = rows.map((row) => row.id);
  const mediaRows = (await query(
    `select * from content_media
      where content_id = any($1::uuid[])
      order by content_id, sort_order, created_at`,
    [ids],
  )).rows;
  const mediaByContent = new Map();
  for (const media of mediaRows) {
    const list = mediaByContent.get(media.content_id) || [];
    list.push(media);
    mediaByContent.set(media.content_id, list);
  }
  return rows.map((row) => rowToItem(row, mediaByContent.get(row.id) || []));
}

function cleanText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizePayload(body) {
  const type = cleanText(body?.type);
  const locale = cleanText(body?.locale, "en");
  const status = cleanText(body?.status, "draft");
  const templateKey = cleanText(body?.templateKey, "showcase");
  const slug = cleanText(body?.slug).toLowerCase();
  const title = cleanText(body?.title);
  const abstract = cleanText(body?.abstract);

  if (!contentTypes.has(type)) throw Object.assign(new Error("Invalid content type."), { statusCode: 400 });
  if (!locales.has(locale)) throw Object.assign(new Error("Invalid content language."), { statusCode: 400 });
  if (!statuses.has(status)) throw Object.assign(new Error("Invalid content status."), { statusCode: 400 });
  if (!templates.has(templateKey)) throw Object.assign(new Error("Invalid content template."), { statusCode: 400 });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Object.assign(new Error("Slug must use lowercase letters, numbers, and hyphens."), { statusCode: 400 });
  if (!title || !abstract) throw Object.assign(new Error("Title and abstract are required."), { statusCode: 400 });

  return {
    type,
    locale,
    status,
    templateKey,
    slug,
    title,
    abstract,
    body: typeof body?.body === "string" ? body.body.trim() : "",
    coverImage: cleanText(body?.coverImage) || null,
    category: cleanText(body?.category) || null,
    publishedAt: status === "published" ? (body?.publishedAt || new Date().toISOString()) : null,
    highlights: Array.isArray(body?.highlights) ? body.highlights.filter((value) => typeof value === "string") : [],
    specs: body?.specs && typeof body.specs === "object" && !Array.isArray(body.specs) ? body.specs : {},
    cta: body?.cta && typeof body.cta === "object" && !Array.isArray(body.cta) ? body.cta : {},
    seo: body?.seo && typeof body.seo === "object" && !Array.isArray(body.seo) ? body.seo : {},
    media: Array.isArray(body?.media) ? body.media : [],
  };
}

async function replaceMedia(client, contentId, media) {
  await client.query("delete from content_media where content_id = $1", [contentId]);
  for (let index = 0; index < media.length; index += 1) {
    const entry = media[index] || {};
    const mediaType = entry.mediaType === "video" ? "video" : "image";
    const url = cleanText(entry.url);
    if (!url) continue;
    await client.query(
      `insert into content_media(content_id, media_type, url, caption, alt, sort_order)
       values($1, $2, $3, $4, $5, $6)`,
      [contentId, mediaType, url, cleanText(entry.caption) || null, cleanText(entry.alt) || null, Number.isInteger(entry.sortOrder) ? entry.sortOrder : index],
    );
  }
}

contentRouter.get("/", optionalUser, async (req, res) => {
  const type = cleanText(req.query.type);
  const locale = cleanText(req.query.locale, "en");
  const includeDrafts = req.query.includeDrafts === "true";
  if (!contentTypes.has(type) || !locales.has(locale)) {
    return res.status(400).json({ message: "Valid type and locale are required." });
  }
  if (includeDrafts && !isEditor(req.user)) {
    return res.status(403).json({ message: "Editor access is required to read drafts." });
  }

  const params = [type, locale];
  const statusSql = includeDrafts ? "" : " and status = 'published'";
  const rows = (await query(
    `select * from content_items
      where type = $1 and locale = $2${statusSql}
      order by published_at desc nulls last, updated_at desc`,
    params,
  )).rows;
  res.json(await hydrateRows(rows));
});

contentRouter.get("/:type/:slug", optionalUser, async (req, res) => {
  const { type, slug } = req.params;
  const locale = cleanText(req.query.locale, "en");
  const includeDrafts = req.query.includeDrafts === "true";
  if (!contentTypes.has(type) || !locales.has(locale)) {
    return res.status(400).json({ message: "Valid type and locale are required." });
  }
  if (includeDrafts && !isEditor(req.user)) {
    return res.status(403).json({ message: "Editor access is required to read drafts." });
  }

  const statusSql = includeDrafts ? "" : " and status = 'published'";
  const rows = (await query(
    `select * from content_items
      where type = $1 and slug = $2 and locale = $3${statusSql}
      limit 1`,
    [type, slug, locale],
  )).rows;
  if (!rows[0]) return res.status(404).json({ message: "Content not found." });
  res.json((await hydrateRows(rows))[0]);
});

contentRouter.post("/", optionalUser, requireEditor, async (req, res) => {
  const item = normalizePayload(req.body);
  try {
    const savedId = await withTransaction(async (client) => {
      const result = await client.query(
        `insert into content_items(
          type, slug, locale, status, template_key, title, abstract, body,
          cover_image, category, published_at, highlights, specs, cta, seo, created_by
        ) values(
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14::jsonb,$15::jsonb,$16
        ) returning id`,
        [
          item.type, item.slug, item.locale, item.status, item.templateKey, item.title, item.abstract, item.body,
          item.coverImage, item.category, item.publishedAt, JSON.stringify(item.highlights), JSON.stringify(item.specs),
          JSON.stringify(item.cta), JSON.stringify(item.seo), req.user.id,
        ],
      );
      const id = result.rows[0].id;
      await replaceMedia(client, id, item.media);
      return id;
    });
    const rows = (await query("select * from content_items where id = $1", [savedId])).rows;
    res.status(201).json((await hydrateRows(rows))[0]);
  } catch (error) {
    if (error?.code === "23505") return res.status(409).json({ message: "That slug already exists for this content type and language." });
    throw error;
  }
});

contentRouter.put("/:id", optionalUser, requireEditor, async (req, res) => {
  const item = normalizePayload(req.body);
  try {
    const changed = await withTransaction(async (client) => {
      const result = await client.query(
        `update content_items set
          type=$1, slug=$2, locale=$3, status=$4, template_key=$5, title=$6, abstract=$7,
          body=$8, cover_image=$9, category=$10, published_at=$11, highlights=$12::jsonb,
          specs=$13::jsonb, cta=$14::jsonb, seo=$15::jsonb
         where id=$16 returning id`,
        [
          item.type, item.slug, item.locale, item.status, item.templateKey, item.title, item.abstract, item.body,
          item.coverImage, item.category, item.publishedAt, JSON.stringify(item.highlights), JSON.stringify(item.specs),
          JSON.stringify(item.cta), JSON.stringify(item.seo), req.params.id,
        ],
      );
      if (!result.rows[0]) return false;
      await replaceMedia(client, req.params.id, item.media);
      return true;
    });
    if (!changed) return res.status(404).json({ message: "Content not found." });
    const rows = (await query("select * from content_items where id = $1", [req.params.id])).rows;
    res.json((await hydrateRows(rows))[0]);
  } catch (error) {
    if (error?.code === "23505") return res.status(409).json({ message: "That slug already exists for this content type and language." });
    throw error;
  }
});

contentRouter.delete("/:id", optionalUser, requireEditor, async (req, res) => {
  const result = await query("delete from content_items where id = $1", [req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: "Content not found." });
  res.status(204).end();
});

export { contentRouter };
