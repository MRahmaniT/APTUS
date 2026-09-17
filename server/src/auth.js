import { Router } from "express";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { query, withTransaction } from "./db.js";

const scrypt = promisify(scryptCallback);
const authRouter = Router();
const sessionDays = Math.max(1, Number(process.env.SESSION_TTL_DAYS || 30));

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    phone: row.phone || "",
    photoURL: row.photo_url || "",
    bio: row.bio || "",
  };
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${Buffer.from(derived).toString("base64url")}`;
}

async function verifyPassword(password, encoded) {
  const [algorithm, saltText, hashText] = String(encoded || "").split("$");
  if (algorithm !== "scrypt" || !saltText || !hashText) return false;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(hashText, "base64url");
  const actual = Buffer.from(await scrypt(password, salt, expected.length));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);
  await query("delete from sessions where expires_at <= now()");
  await query(
    "insert into sessions(token_hash, user_id, expires_at) values($1, $2, $3)",
    [tokenHash(token), userId, expiresAt],
  );
  return { access_token: token, expires_at: Math.floor(expiresAt.getTime() / 1000) };
}

function bearerToken(req) {
  const header = req.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export async function optionalUser(req, _res, next) {
  const token = bearerToken(req);
  req.authToken = token || null;
  req.user = null;
  if (!token) return next();

  const result = await query(
    `select u.*
       from sessions s
       join users u on u.id = s.user_id
      where s.token_hash = $1 and s.expires_at > now()
      limit 1`,
    [tokenHash(token)],
  );
  req.user = result.rows[0] || null;
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  next();
}

export function requireEditor(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Authentication required." });
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ message: "Admin or manager access required." });
  }
  next();
}

const attempts = new Map();
function authRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.startedAt > 10 * 60 * 1000) {
    attempts.set(key, { startedAt: now, count: 1 });
    return next();
  }
  current.count += 1;
  if (current.count > 30) {
    return res.status(429).json({ message: "Too many authentication attempts. Try again later." });
  }
  next();
}

authRouter.post("/signup", authRateLimit, async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!name || !email || !email.includes("@")) {
    return res.status(400).json({ message: "A valid name and email are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await withTransaction(async (client) => {
      await client.query("lock table users in exclusive mode");
      const count = Number((await client.query("select count(*)::int as count from users")).rows[0].count);
      const role = count === 0 ? "manager" : "member";
      const result = await client.query(
        `insert into users(email, password_hash, name, role)
         values($1, $2, $3, $4)
         returning *`,
        [email, passwordHash, name, role],
      );
      return result.rows[0];
    });
  } catch (error) {
    if (error?.code === "23505") {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    throw error;
  }

  const session = await createSession(user.id);
  res.status(201).json({ session, user: publicUser(user) });
});

authRouter.post("/login", authRateLimit, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const result = await query("select * from users where lower(email) = $1 limit 1", [email]);
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  const session = await createSession(user.id);
  res.json({ session, user: publicUser(user) });
});

authRouter.get("/me", optionalUser, requireUser, async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

authRouter.post("/logout", optionalUser, async (req, res) => {
  if (req.authToken) {
    await query("delete from sessions where token_hash = $1", [tokenHash(req.authToken)]);
  }
  res.status(204).end();
});

authRouter.post("/password-reset/request", authRateLimit, async (_req, res) => {
  res.status(501).json({
    message: "Password-reset email is not configured on this self-hosted server yet. Contact an administrator to reset the account password.",
  });
});

export { authRouter, publicUser };
