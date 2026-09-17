import express from "express";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { authRouter, optionalUser, requireEditor } from "./auth.js";
import { contentRouter } from "./content.js";
import { adminRouter } from "./admin.js";
import { pool, query } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || path.join(projectRoot, "data/uploads"));
const staticDir = path.resolve(process.env.STATIC_DIR || path.join(projectRoot, "dist"));
const maxUploadMb = Math.max(1, Number(process.env.MAX_UPLOAD_MB || 100));

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", immutable: false }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", async (_req, res) => {
  await query("select 1");
  res.json({ status: "ok", database: "postgresql" });
});

app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api", adminRouter);

app.post(
  "/api/media",
  optionalUser,
  requireEditor,
  express.raw({ type: () => true, limit: `${maxUploadMb}mb` }),
  async (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) {
      return res.status(400).json({ message: "Upload body is empty." });
    }
    const reportedType = String(req.get("x-file-type") || req.get("content-type") || "application/octet-stream").toLowerCase();
    if (!(reportedType.startsWith("image/") || reportedType.startsWith("video/"))) {
      return res.status(415).json({ message: "Only image and video uploads are supported." });
    }

    const original = String(req.get("x-file-name") || "upload.bin").toLowerCase();
    const safeName = original.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload.bin";
    const day = new Date().toISOString().slice(0, 10);
    const relativeDir = day;
    const fileName = `${randomUUID()}-${safeName}`;
    const targetDir = path.join(uploadsDir, relativeDir);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, fileName), req.body, { flag: "wx" });
    res.status(201).json({ url: `/uploads/${relativeDir}/${fileName}` });
  },
);

if (existsSync(path.join(staticDir, "index.html"))) {
  app.use(express.static(staticDir, { index: false }));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) return next();
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

app.use((req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ message: "API route not found." });
  res.status(404).send("Not found");
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: `Upload exceeds the ${maxUploadMb} MB limit.` });
  }
  res.status(error?.statusCode || 500).json({ message: error?.statusCode ? error.message : "Server error." });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`APTUS server listening on port ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
