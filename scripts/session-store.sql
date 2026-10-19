-- Run once with the migration role. The application needs SELECT/INSERT/UPDATE.
CREATE TABLE IF NOT EXISTS erebrus_web_sessions (
  id text PRIMARY KEY,
  payload text NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS erebrus_web_sessions_expiry ON erebrus_web_sessions (expires_at);
-- Run periodically (e.g. hourly) with a maintenance role:
-- DELETE FROM erebrus_web_sessions WHERE expires_at < NOW();
