// Applies supabase/schema.sql to the database. Runs automatically before every build
// (locally and on Vercel), so a push is enough. The schema is idempotent: safe to re-run.
import { readFileSync } from "node:fs";
import pg from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DIRECT_URL not set, skipping database setup.");
  process.exit(0);
}

const sql = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  // Tell the Supabase API to pick up new tables/functions immediately
  await client.query("notify pgrst, 'reload schema'");
  console.log("[migrate] Database schema is up to date.");
} catch (error) {
  console.error("[migrate] Failed:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
