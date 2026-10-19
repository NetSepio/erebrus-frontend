/** Real PostgreSQL + two Next workers + a persistent Chromium profile.
 * Gateway is a deterministic local contract fixture; no real accounts are used.
 * Run pnpm test:session-e2e (Chrome installed, or PLAYWRIGHT_CHANNEL=chromium).
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import EmbeddedPostgres from "embedded-postgres";
import { chromium } from "@playwright/test";

const directory = await mkdtemp(join(tmpdir(), "erebrus-session-e2e-"));
const encryptionKey = randomBytes(32);
const previousNextEnv = await readFile("next-env.d.ts", "utf8").catch(() => undefined);
const ports = { database: 15543, gateway: 15544, a: 15545, b: 15546 };
const pg = new EmbeddedPostgres({ databaseDir: join(directory, "db"), user: "postgres", password: "test-only", port: ports.database, persistent: false, onLog() {}, onError() {} });
const processes = [];
let context;
let db;
let tests = 0;
let refreshCount = 0;
let upgradeCount = 0;
let logoutCount = 0;
let refreshMode = "success";
let refreshDelay = 0;
let forceExpiry = false;
const sessions = new Map();
const requests = [];
function credentials(s) {
  const now = Date.now();
  return { access_token: s.access, token: s.access, refresh_token: s.refresh, token_type: "Bearer", expires_in: 86400,
    expires_at: new Date(now + 86400000).toISOString(), refresh_expires_in: 30 * 86400,
    refresh_expires_at: new Date(now + 30 * 86400000).toISOString(), session_id: s.id, user_id: "test-user", role: "user" };
}
function newSession() {
  const id = randomBytes(6).toString("hex");
  const s = { id, access: `v4.public.${id}-1`, refresh: `secret-${id}-1`, version: 1, revoked: false };
  sessions.set(id, s); return s;
}
const gateway = createServer(async (req, res) => {
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString();
  const body = (() => { try { return JSON.parse(rawBody); } catch { return {}; } })();
  const json = (value, status = 200, headers = {}) => { res.writeHead(status, { "Content-Type": "application/json", ...headers }); res.end(JSON.stringify(value)); };
  if (["/api/v2/auth/google", "/api/v2/auth/apple", "/api/v2/auth/email/login/verify", "/api/v2/auth"].includes(req.url) && req.method === "POST") return json(credentials(newSession()));
  if (req.url === "/api/v2/auth/session") {
    upgradeCount++;
    if (req.headers.authorization === "Bearer legacy-valid") return json(credentials(newSession()));
    return json({ code: req.headers.authorization === "Bearer legacy-modern" ? "SESSION_ALREADY_REFRESHABLE" : "ACCESS_TOKEN_EXPIRED" }, req.headers.authorization === "Bearer legacy-modern" ? 409 : 401);
  }
  if (req.url === "/api/v2/auth/refresh") {
    refreshCount++;
    if (refreshMode === "429") return json({ code: "RATE_LIMITED" }, 429, { "Retry-After": "120" });
    if (refreshMode === "503") return json({ code: "UNAVAILABLE" }, 503);
    const s = [...sessions.values()].find((s) => s.refresh === body.refresh_token && !s.revoked);
    if (!s) return json({ code: "REFRESH_TOKEN_REUSED" }, 401);
    s.version++; s.access = `v4.public.${s.id}-${s.version}`; s.refresh = `secret-${s.id}-${s.version}`;
    if (refreshDelay) await new Promise((resolve) => setTimeout(resolve, refreshDelay));
    if (refreshMode === "lost") { res.destroy(); return; }
    return json(credentials(s));
  }
  if (req.url === "/api/v2/auth/logout") {
    logoutCount++;
    const s = [...sessions.values()].find((s) => s.refresh === body.refresh_token);
    if (s) s.revoked = true;
    res.writeHead(204); return res.end();
  }
  const s = [...sessions.values()].find((s) => `Bearer ${s.access}` === req.headers.authorization && !s.revoked);
  requests.push({ rawBody, key: req.headers["idempotency-key"], access: req.headers.authorization });
  if (forceExpiry) { forceExpiry = false; return json({ code: "ACCESS_TOKEN_EXPIRED" }, 401); }
  if (!s) return json({ code: "SESSION_REVOKED" }, 401);
  return json({ ok: true, user_id: "test-user" });
});
function startWorker(name) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--webpack", "-p", String(ports[name]), "-H", "127.0.0.1"], {
    env: { ...process.env, EREBRUS_TEST_DIST_DIR: `.next-session-e2e-${name}`, EREBRUS_TEST_TSCONFIG: `.next-session-e2e-${name}/tsconfig.json`, SESSION_DATABASE_URL: `postgres://postgres:test-only@127.0.0.1:${ports.database}/postgres`, SESSION_ENCRYPTION_KEY: encryptionKey.toString("base64"), GATEWAY_URL: `http://127.0.0.1:${ports.gateway}`, APP_ORIGIN: `http://localhost:${ports[name]}`, NEXT_PUBLIC_PROJECT_ID: "test-project", NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (data) => { output += data; });
  child.stderr.on("data", (data) => { output += data; });
  child.on("exit", (code) => { if (code) console.error(`Next worker ${name} exited ${code}: ${output.slice(-1500)}`); });
  processes.push(child); return child;
}
async function ready(name) {
  const end = Date.now() + 90000;
  while (Date.now() < end) {
    try { const r = await fetch(`http://localhost:${ports[name]}/api/session`, { signal: AbortSignal.timeout(10000) }); if (r.status === 200) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Next worker ${name} failed to become ready`);
}
const browserOptions = { headless: true, channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome" };
async function launch() {
  context = await chromium.launchPersistentContext(join(directory, "browser"), browserOptions);
  const page = await context.newPage(); await page.goto(`http://localhost:${ports.a}/favicon.ico`); return page;
}
async function api(page, path, method = "GET", body, extra = {}) {
  return page.evaluate(async ({ path, method, body, extra }) => {
    const r = await fetch(path, { method, headers: { "X-Erebrus-CSRF": "1", ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...extra }, ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}) });
    return { status: r.status, body: await r.json(), retryAfter: r.headers.get("retry-after") };
  }, { path, method, body, extra });
}
async function login(page) {
  const r = await api(page, "/api/gateway/auth/google", "POST", { id_token: "fixture-only" });
  assert.equal(r.status, 200); assert.equal(r.body.authenticated, true);
  assert.equal(r.body.token, undefined); assert.equal(r.body.refresh_token, undefined);
}
function decrypt(value, id) {
  const bytes = Buffer.from(value, "base64"); const decipher = createDecipheriv("aes-256-gcm", encryptionKey, bytes.subarray(0, 12));
  decipher.setAAD(Buffer.from(id)); decipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
}
function encrypt(value, id) {
  const iv = randomBytes(12); const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv); cipher.setAAD(Buffer.from(id));
  const body = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]); return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}
async function editSession(edit) {
  const cookie = (await context.cookies()).find((c) => c.name === "__Host-erebrus_session"); assert.ok(cookie);
  const id = createHash("sha256").update(cookie.value).digest("hex");
  const result = await db.query("SELECT payload FROM erebrus_web_sessions WHERE id=$1", [id]);
  const session = decrypt(result.rows[0].payload, cookie.value); edit(session);
  await db.query("UPDATE erebrus_web_sessions SET payload=$2, expires_at=$3 WHERE id=$1", [id, encrypt(session, cookie.value), new Date(session.expiresAt)]);
}
async function check(name, work) { await work(); tests++; console.log(`PASS ${name}`); }
try {
  await pg.initialise(); await pg.start(); db = pg.getPgClient(); await db.connect();
  await db.query(await readFile("scripts/session-store.sql", "utf8"));
  await new Promise((resolve) => gateway.listen(ports.gateway, "127.0.0.1", resolve));
  for (const name of ["a", "b"]) {
    await mkdir(`.next-session-e2e-${name}`, { recursive: true });
    await writeFile(`.next-session-e2e-${name}/tsconfig.json`, JSON.stringify({ extends: "../tsconfig.json", compilerOptions: { baseUrl: ".." }, include: ["../src/**/*.ts", "../src/**/*.tsx", "../next-env.d.ts"], exclude: ["../node_modules"] }));
  }
  startWorker("a"); startWorker("b"); await Promise.all([ready("a"), ready("b")]);
  let page = await launch();
  await check("Secure HttpOnly persistent cookie and restart restore", async () => {
    await login(page);
    const cookie = (await context.cookies()).find((c) => c.name === "__Host-erebrus_session");
    assert.ok(cookie.secure && cookie.httpOnly && cookie.expires > Date.now() / 1000 + 86400);
    assert.ok(!(await page.evaluate(() => document.cookie)).includes("__Host-erebrus_session"));
    await context.close(); page = await launch();
    assert.equal((await api(page, "/api/session")).body.authenticated, true);
  });
  await check("25-hour return rotates and renews cookie expiry", async () => {
    await editSession((s) => { s.credentials.accessExpiresAt = Date.now() - 3600000; s.credentials.refreshExpiresAt = Date.now() + 100000; s.expiresAt = s.credentials.refreshExpiresAt; });
    const count = refreshCount;
    assert.equal((await api(page, "/api/gateway/profile")).status, 200);
    assert.equal(refreshCount, count + 1);
    assert.ok((await context.cookies()).find((c) => c.name === "__Host-erebrus_session").expires > Date.now() / 1000 + 29 * 86400);
  });
  const other = await context.newPage(); await other.goto(`http://localhost:${ports.b}/favicon.ico`);
  await check("concurrent tabs across two backend instances rotate exactly once", async () => {
    await editSession((s) => { s.credentials.accessExpiresAt = Date.now() - 1; });
    const count = refreshCount; refreshDelay = 150;
    const responses = await Promise.all(Array.from({ length: 12 }, (_, i) => api(i % 2 ? page : other, "/api/gateway/profile")));
    refreshDelay = 0; assert.ok(responses.every((r) => r.status === 200)); assert.equal(refreshCount, count + 1);
  });
  await check("expiry 401 replay preserves body/idempotency key", async () => {
    forceExpiry = true; requests.length = 0;
    assert.equal((await api(page, "/api/gateway/profile", "PUT", "unchanged-body", { "Idempotency-Key": "same-key" })).status, 200);
    assert.equal(requests.length, 2);
    assert.ok(requests.every((r) => r.rawBody === "unchanged-body" && r.key === "same-key"));
    assert.notEqual(requests[0].access, requests[1].access);
  });
  await check("gateway 429 preserves identity and honors Retry-After across instances", async () => {
    await editSession((s) => { s.credentials.accessExpiresAt = Date.now() - 1; }); refreshMode = "429";
    const count = refreshCount;
    const r = await api(page, "/api/gateway/profile"); assert.equal(r.status, 429); assert.equal(r.retryAfter, "120");
    assert.equal((await api(other, "/api/gateway/profile")).status, 429); assert.equal(refreshCount, count + 1);
    assert.equal((await api(page, "/api/session")).body.authenticated, true);
    refreshMode = "success"; await login(page);
  });
  await check("lost rotation response keeps auth and is never blindly retried", async () => {
    await editSession((s) => { s.credentials.accessExpiresAt = Date.now() - 1; }); refreshMode = "lost";
    const count = refreshCount;
    assert.equal((await api(page, "/api/gateway/profile")).status, 503);
    assert.equal((await api(other, "/api/gateway/profile")).status, 503); assert.equal(refreshCount, count + 1);
    assert.equal((await api(page, "/api/session")).body.authenticated, true);
    assert.equal((await api(page, "/api/session/logout", "POST")).body.remote_logout_confirmed, false);
    refreshMode = "success"; await login(page);
  });
  await check("logout during refresh waits, revokes rotated credentials and blocks late restore", async () => {
    await editSession((s) => { s.credentials.accessExpiresAt = Date.now() - 1; }); refreshDelay = 300;
    const count = refreshCount; const protectedCall = api(page, "/api/gateway/profile");
    while (refreshCount === count) await new Promise((resolve) => setTimeout(resolve, 10));
    const logout = await api(other, "/api/session/logout", "POST");
    assert.equal(logout.body.remote_logout_confirmed, true); await protectedCall; refreshDelay = 0;
    assert.equal((await api(page, "/api/session")).body.authenticated, false);
  });
  await check("legacy upgrade is once across tabs; expired/modern legacy requires login", async () => {
    const legacy = (value) => context.addCookies([{ name: "erebrus_session_token", value, url: `http://localhost:${ports.a}` }]);
    await legacy("legacy-valid"); const count = upgradeCount;
    const replies = await Promise.all([api(page, "/api/session/upgrade", "POST"), api(other, "/api/session/upgrade", "POST")]);
    assert.ok(replies.every((r) => r.status === 200)); assert.equal(upgradeCount, count + 1);
    await api(page, "/api/session/logout", "POST");
    for (const token of ["legacy-expired", "legacy-modern"]) {
      await legacy(token);
      assert.equal((await api(page, "/api/session/upgrade", "POST")).body.code, "LEGACY_LOGIN_REQUIRED");
    }
    await context.clearCookies();
  });
  await check("CSRF blocks cross-origin requests and simple form POSTs", async () => {
    const result = await page.evaluate(async () => {
      const r = await fetch("/api/gateway/auth/google", { method: "POST", body: "{}" }); return r.status;
    }); assert.equal(result, 403);
  });
  await check("desktop access-token callback remains available without refresh disclosure", async () => {
    const r = await api(page, "/api/gateway/auth/google", "POST", { id_token: "fixture-only" }, { "X-Erebrus-Desktop-Auth": "1" });
    assert.ok(r.body.token.startsWith("v4.public.")); assert.equal(r.body.refresh_token, undefined);
  });
  await check("durable credentials are encrypted and cookie identifiers hashed in PostgreSQL", async () => {
    const rows = await db.query("SELECT payload FROM erebrus_web_sessions");
    assert.ok(rows.rows.every((r) => !r.payload.includes("secret-") && !r.payload.includes("refresh_token")));
  });
  console.log(`${tests} browser/PostgreSQL integration scenarios passed; ${refreshCount} refresh calls, ${logoutCount} logout calls.`);
} finally {
  await context?.close();
  for (const child of processes) child.kill("SIGTERM");
  await Promise.all(processes.map((child) => child.exitCode !== null ? Promise.resolve() : new Promise((resolve) => child.once("exit", resolve))));
  if (previousNextEnv !== undefined) await writeFile("next-env.d.ts", previousNextEnv);
  gateway.closeAllConnections(); await new Promise((resolve) => gateway.close(resolve));
  await db?.end(); await pg.stop(); await rm(directory, { recursive: true, force: true });
}
