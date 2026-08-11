import pg from "pg";

const { Pool } = pg;

const rawConnectionString = process.env.POSTGRES_URL;
if (!rawConnectionString) {
  throw new Error(
    "POSTGRES_URL must be set in the environment (see .env.example). " +
      "On Vercel, add the Postgres storage integration and it's set automatically."
  );
}

// Vercel/Supabase/Neon Postgres requires SSL; a local Postgres for dev typically doesn't use it.
const isLocal = /localhost|127\.0\.0\.1/.test(rawConnectionString);

// Managed Postgres providers (Supabase in particular) often embed an
// sslmode=... query param in the connection string. node-postgres derives
// its own SSL settings from that param, which can conflict with — and
// sometimes win over — the explicit `ssl` option below, causing a
// "self-signed certificate in certificate chain" error even when we've
// asked it not to verify. Stripping the param removes the ambiguity so our
// explicit ssl config below is the only thing in effect.
function stripSslQueryParams(urlStr) {
  try {
    const url = new URL(urlStr);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("ssl");
    return url.toString();
  } catch {
    return urlStr; // if it's not a parseable URL, leave it untouched
  }
}

const connectionString = stripSslQueryParams(rawConnectionString);

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5,
});

export async function query(text, params) {
  return pool.query(text, params);
}

let schemaReady = null;

// Idempotent — safe to call on every request. The promise is memoized so the
// CREATE TABLE statements only actually run once per warm serverless instance.
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          class_level TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          answers_json JSONB NOT NULL,
          results_json JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS saved_careers (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          career_id TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE(user_id, career_id)
        );
      `);
      await query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK (role IN ('user','assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await query(`CREATE INDEX IF NOT EXISTS idx_saved_careers_user ON saved_careers(user_id);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);`);
    })();
  }
  return schemaReady;
}
