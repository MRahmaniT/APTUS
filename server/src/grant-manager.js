import { pool, withTransaction } from "./db.js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || process.argv.length !== 3) {
  console.error("Usage: npm run grant-manager --prefix server -- <verified-account-email>");
  process.exitCode = 1;
} else {
  try {
    await withTransaction(async client => {
      await client.query("select pg_advisory_xact_lock(hashtext('aptus-role-management'))");
      const result = await client.query("update users set role = 'manager' where lower(email) = $1 returning id", [email]);
      if (result.rowCount !== 1) throw new Error("Use one existing account with an unambiguous email address.");
    });
    console.log("Manager access granted to the specified account.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally { await pool.end(); }
}
