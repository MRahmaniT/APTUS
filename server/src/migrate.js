import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pool } from "./db.js";

const migrationsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../local-db/migrations");

async function migrate() {
  await pool.query(`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const files = (await readdir(migrationsDir)).filter((name) => name.endsWith(".sql")).sort();
  const applied = new Set((await pool.query("select name from schema_migrations")).rows.map((row) => row.name));

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("insert into schema_migrations(name) values($1)", [file]);
      await client.query("COMMIT");
      console.log(`Applied migration ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

migrate()
  .then(() => pool.end())
  .catch(async (error) => {
    console.error("Database migration failed", error);
    await pool.end();
    process.exit(1);
  });
