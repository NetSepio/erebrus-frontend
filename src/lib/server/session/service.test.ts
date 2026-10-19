import { beforeEach, describe, expect, it, vi } from "vitest";
import { SessionService, parseCredentials, publicSession } from "./service";
import { TestStore } from "./test-store";
import type { GatewayFetch } from "./service";

let time = Date.UTC(2026, 9, 19);
function payload(version = 1, overrides = {}) {
  return { access_token: `v4.public.access-${version}`, token: "legacy-alias", token_type: "Bearer", expires_in: 86400,
    expires_at: new Date(time + 86400000).toISOString(), refresh_token: `refresh-${version}`, refresh_expires_in: 30 * 86400,
    refresh_expires_at: new Date(time + 30 * 86400000).toISOString(), session_id: "s1", user_id: "u1", role: "user", ...overrides };
}
const json = (body: unknown, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });
let store: TestStore;
let gateway: ReturnType<typeof vi.fn<GatewayFetch>>;
let service: SessionService;
beforeEach(() => {
  time = Date.UTC(2026, 9, 19);
  process.env.SESSION_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
  store = new TestStore(); gateway = vi.fn<GatewayFetch>(); service = new SessionService(store, gateway, () => time);
});
async function login() { return service.create(payload(), "SoLaNaAddress", "wallet"); }

describe("durable rotating sessions", () => {
  it("uses gateway expiry metadata and treats PASETO as opaque", () => {
    const parsed = parseCredentials(payload(1, { expires_at: (time + 120000) / 1000, refresh_expires_at: undefined, refresh_expires_in: 123456 }), time);
    expect(parsed.accessExpiresAt).toBe(time + 120000);
    expect(parsed.refreshExpiresAt).toBe(time + 123456000);
    expect(parsed.accessToken).toBe("v4.public.access-1");
  });
  it("restores after browser/backend restart without a wallet connection", async () => {
    const { id } = await login();
    const restarted = new SessionService(store, gateway, () => time);
    expect(publicSession(await restarted.access(id))).toMatchObject({ authenticated: true, user_id: "u1", wallet_address: "SoLaNaAddress" });
    expect(gateway).not.toHaveBeenCalled();
  });
  it("returns after >24 hours and extends the durable session deadline on rotation", async () => {
    const { id, session } = await login(); const oldExpiry = session.expiresAt;
    time += 25 * 3600000;
    gateway.mockResolvedValue(json(payload(2)));
    const refreshed = await service.access(id);
    expect(refreshed.expiresAt).toBeGreaterThan(oldExpiry);
    expect(store.rows.get(id)?.credentials?.refreshToken).toBe("refresh-2");
    expect(gateway.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
  });
  it("serializes many tabs/requests across service instances and commits before waking waiters", async () => {
    const { id } = await login(); time += 86400000;
    gateway.mockImplementation(async () => { await new Promise((resolve) => setTimeout(resolve, 5)); return json(payload(2)); });
    const other = new SessionService(store, gateway, () => time);
    const results = await Promise.all(Array.from({ length: 25 }, (_, i) => (i % 2 ? other : service).access(id)));
    expect(gateway).toHaveBeenCalledTimes(1);
    expect(results.every((s) => s.credentials?.refreshToken === "refresh-2")).toBe(true);
  });
  it("refreshes at the 60-second boundary and reuses another request's replacement on expiry 401", async () => {
    const { id } = await login(); time += 86400000 - 60000;
    gateway.mockResolvedValue(json(payload(2)));
    await service.access(id);
    expect((await service.access(id, "v4.public.access-1")).credentials?.accessToken).toBe("v4.public.access-2");
    expect(gateway).toHaveBeenCalledTimes(1);
  });
  it.each(["REFRESH_TOKEN_INVALID", "REFRESH_TOKEN_REUSED", "SESSION_REVOKED"])("clears only terminal %s", async (code) => {
    const { id } = await login(); time += 86400000;
    gateway.mockResolvedValue(json({ code }, 401));
    await expect(service.access(id)).rejects.toMatchObject({ terminal: true, code });
    expect(store.rows.get(id)?.credentials).toBeUndefined();
  });
  it("honors Retry-After and preserves identity during rate limiting", async () => {
    const { id } = await login(); time += 86400000;
    gateway.mockResolvedValueOnce(json({ code: "TOO_MANY_REQUESTS" }, 429, { "Retry-After": "120" })).mockImplementation(async () => json(payload(2)));
    await expect(service.access(id)).rejects.toMatchObject({ status: 429, retryAfter: "120" });
    expect(publicSession(await service.read(id)).authenticated).toBe(true);
    await expect(service.access(id)).rejects.toMatchObject({ status: 429 });
    expect(gateway).toHaveBeenCalledTimes(1);
    time += 120000;
    expect((await service.access(id)).state).toBe("active");
  });
  it.each(["network", "5xx", "business", "malformed"])("preserves auth after %s without replaying a potentially consumed credential", async (kind) => {
    const { id } = await login(); time += 86400000;
    if (kind === "network") gateway.mockRejectedValue(new Error("lost response"));
    else gateway.mockResolvedValue(kind === "malformed" ? json({}) : json({ code: kind === "5xx" ? "UNAVAILABLE" : "BUSINESS_ERROR" }, kind === "5xx" ? 503 : 400));
    await expect(service.access(id)).rejects.toBeDefined();
    expect(publicSession(await service.read(id)).user_id).toBe("u1");
    await expect(service.access(id)).rejects.toMatchObject({ code: "REFRESH_OUTCOME_UNKNOWN" });
    expect(gateway).toHaveBeenCalledTimes(1);
  });
  it("does not replay a refresh after worker death with a durable in-progress marker", async () => {
    const { id } = await login(); time += 86400000;
    store.rows.get(id)!.state = "refreshing";
    const restarted = new SessionService(store, gateway, () => time);
    await expect(restarted.access(id)).rejects.toMatchObject({ code: "REFRESH_OUTCOME_UNKNOWN" });
    expect(gateway).not.toHaveBeenCalled();
  });
  it("logout waits for rotation and revokes the replacement; late requests cannot revive it", async () => {
    const { id } = await login(); time += 86400000;
    let finish!: (r: Response) => void;
    gateway.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; })).mockResolvedValueOnce(new Response(null, { status: 204 }));
    const refresh = service.access(id);
    await vi.waitFor(() => expect(gateway).toHaveBeenCalledTimes(1));
    const logout = service.revoke(id);
    finish(json(payload(2)));
    await refresh;
    expect(await logout).toBe(true);
    expect(JSON.parse(String(gateway.mock.calls[1][1].body))).toEqual({ refresh_token: "refresh-2" });
    await expect(service.access(id)).rejects.toMatchObject({ code: "SESSION_REVOKED" });
  });
  it("logout winning the lock prevents a refresh", async () => {
    const { id } = await login(); time += 86400000;
    gateway.mockResolvedValue(new Response(null, { status: 204 }));
    await Promise.all([service.revoke(id), expect(service.access(id)).rejects.toMatchObject({ code: "SESSION_REVOKED" })]);
    expect(gateway.mock.calls.map(([path]) => path)).toEqual(["auth/logout"]);
  });
  it("reports unconfirmed remote logout accurately, including repeated logout", async () => {
    const { id } = await login(); gateway.mockRejectedValue(new Error("offline"));
    expect(await service.revoke(id)).toBe(false);
    expect(await service.revoke(id)).toBe(false);
    await expect(service.access(id)).rejects.toMatchObject({ terminal: true });
  });
  it("never replays an uncertain refresh token for logout", async () => {
    const { id } = await login(); time += 86400000;
    gateway.mockRejectedValue(new Error("response lost"));
    await expect(service.access(id)).rejects.toBeDefined();
    expect(await service.revoke(id)).toBe(false);
    expect(gateway).toHaveBeenCalledTimes(1);
  });
  it("expires the session at the returned refresh deadline", async () => {
    const { id } = await login(); time += 30 * 86400000;
    await expect(service.access(id)).rejects.toMatchObject({ terminal: true });
    expect(gateway).not.toHaveBeenCalled();
  });
  it("upgrades legacy once across tabs without prompting for a signature", async () => {
    gateway.mockImplementation(async () => json(payload()));
    const results = await Promise.all(Array.from({ length: 10 }, () => service.upgrade("legacy-paseto", "wallet")));
    expect(new Set(results.map((r) => r.id)).size).toBe(1);
    expect(gateway).toHaveBeenCalledTimes(1);
    expect(gateway.mock.calls[0][0]).toBe("auth/session");
    expect(gateway.mock.calls[0][1].headers).toEqual({ Authorization: "Bearer legacy-paseto" });
  });
  it("preserves legacy auth on an ambiguous upgrade failure without retrying or turning it into a terminal error", async () => {
    gateway.mockRejectedValue(new Error("lost response"));
    await expect(service.upgrade("legacy-outage")).rejects.toMatchObject({ code: "LEGACY_UPGRADE_OUTCOME_UNKNOWN", status: 503 });
    await expect(service.upgrade("legacy-outage")).rejects.toMatchObject({ code: "LEGACY_UPGRADE_OUTCOME_UNKNOWN", status: 503 });
    expect(gateway).toHaveBeenCalledTimes(1);
  });
  it("retains the in-progress marker when persisting a rotated response fails", async () => {
    const { id } = await login(); time += 86400000;
    gateway.mockResolvedValue(json(payload(2)));
    // Simulate the commit failure on this connection rather than the next lock.
    const original = store.locked.bind(store);
    store.locked = async (key, work) => original(key, async (row) => work({ ...row, write: async (s) => {
      if (s.state === "active") throw new Error("database unavailable");
      await row.write(s);
    } }));
    await expect(service.access(id)).rejects.toBeDefined();
    expect(store.rows.get(id)?.state).toBe("refreshing");
    await expect(service.access(id)).rejects.toMatchObject({ code: "REFRESH_OUTCOME_UNKNOWN" });
    expect(gateway).toHaveBeenCalledTimes(1);
  });
  it.each([401, 409])("requires one new login for unrecoverable legacy status %i without looping", async (status) => {
    gateway.mockResolvedValue(json({ code: status === 409 ? "SESSION_ALREADY_REFRESHABLE" : "ACCESS_TOKEN_EXPIRED" }, status));
    await expect(service.upgrade("legacy")).rejects.toMatchObject({ code: "LEGACY_LOGIN_REQUIRED" });
    await expect(service.upgrade("legacy")).rejects.toMatchObject({ code: "LEGACY_LOGIN_REQUIRED" });
    expect(gateway).toHaveBeenCalledTimes(1);
  });
});
