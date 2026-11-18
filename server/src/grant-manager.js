import { pool, withTransaction } from "./db.js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || process.argv.length !== 3) {
  console.error("Usage: npm run grant-manager --prefix server -- <verified-account-email>");
  process.exitCode = 1;
} else {
  try {
    const changed = await withTransaction(async client => {
      await client.query("select pg_advisory_xact_lock(hashtext('aptus-role-management'))");
      return client.query("update users set role = 'manager' where lower(email) = $1 returning id", [email]);
    });
    if (changed.rowCount !== 1) throw new Error("No matching account. Create your own account and verify ownership first.");
    console.log("Manager access granted to the specified account.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally { await pool.end(); }
}
