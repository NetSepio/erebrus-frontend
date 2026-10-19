import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { SessionError, type ServerSession, type SessionStore } from "./types";

let pool: Pool | undefined;
function database() {
  if (!process.env.SESSION_DATABASE_URL) throw new SessionError("SESSION_STORE_UNAVAILABLE");
  if (!pool) {
    pool = new Pool({ connectionString: process.env.SESSION_DATABASE_URL, max: 10, connectionTimeoutMillis: 5000, query_timeout: 10000, statement_timeout: 10000 });
    // Idle database disconnects are expected during outages. Never print pg
    // error objects: connection diagnostics may include private configuration.
    pool.on("error", () => {});
  }
  return pool;
}
function key() {
  const value = Buffer.from(process.env.SESSION_ENCRYPTION_KEY ?? "", "base64");
  if (value.length !== 32) throw new SessionError("SESSION_STORE_NOT_CONFIGURED");
  return value;
}
export function seal(session: ServerSession, id: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(id));
  const body = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}
export function unseal(value: string, id: string): ServerSession {
  const bytes = Buffer.from(value, "base64");
  const cipher = createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
  cipher.setAAD(Buffer.from(id));
  cipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString("utf8"));
}

/** Dedicated PostgreSQL connection: requires direct or session-pooled connections.
 * Every write autocommits while the advisory lock remains held. The durable
 * "refreshing" marker therefore survives a worker crash or a lost DB connection.
 */
export const sessionStore: SessionStore = {
  async locked(id, work) {
    const storageId = createHash("sha256").update(id).digest("hex");
    const db = await database().connect();
    const lockKey = createHash("sha256").update(id).digest().readBigInt64BE().toString();
    let acquired = false;
    let broken = false;
    const onError = () => { broken = true; };
    db.on("error", onError);
    try {
      const deadline = Date.now() + 15000;
      do {
        const result = await db.query("SELECT pg_try_advisory_lock($1::bigint) AS acquired", [lockKey]);
        acquired = result.rows[0].acquired;
        if (!acquired) await new Promise((resolve) => setTimeout(resolve, 50));
      } while (!acquired && Date.now() < deadline);
      if (!acquired) throw new SessionError("SESSION_BUSY", 503, "1");
      return await work({
        async read() {
          const result = await db.query("SELECT payload FROM erebrus_web_sessions WHERE id = $1 AND expires_at > NOW()", [storageId]);
          return result.rows[0] ? unseal(result.rows[0].payload, id) : null;
        },
        async write(session) {
          if (broken) throw new SessionError("SESSION_STORE_UNAVAILABLE");
          await db.query(
            `INSERT INTO erebrus_web_sessions (id, payload, expires_at) VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, expires_at = EXCLUDED.expires_at`,
            [storageId, seal(session, id), new Date(session.expiresAt)]
          );
        },
      });
    } finally {
      try { if (acquired && !broken) await db.query("SELECT pg_advisory_unlock($1::bigint)", [lockKey]); }
      catch { broken = true; }
      db.removeListener("error", onError);
      db.release(broken);
    }
  },
};
