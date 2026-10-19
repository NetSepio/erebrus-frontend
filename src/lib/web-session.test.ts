import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
let storage: Map<string, string>;
beforeEach(() => {
  vi.resetModules(); storage = new Map();
  vi.stubGlobal("localStorage", { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) });
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => { vi.unstubAllGlobals(); });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
describe("browser session lifecycle", () => {
  it("restores identity after a new browser module load using only the HttpOnly cookie", async () => {
    const web = await import("./web-session");
    vi.mocked(fetch).mockResolvedValue(json({ authenticated: true, user_id: "u" }));
    await web.restoreWebSession();
    expect(web.sessionSnapshot().session?.user_id).toBe("u");
    expect(storage.size).toBe(0);
    expect(vi.mocked(fetch).mock.calls[0][1]?.credentials).toBe("same-origin");
  });
  it("keeps identity during temporary failures and business 401s", async () => {
    const web = await import("./web-session"); web.acceptWebSession({ authenticated: true, user_id: "u" });
    for (const status of [400, 401, 429, 503]) {
      vi.mocked(fetch).mockResolvedValue(json({ code: "BUSINESS_OR_OUTAGE" }, status));
      await web.restoreWebSession(); expect(web.sessionSnapshot().session?.user_id).toBe("u");
    }
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    await web.restoreWebSession(); expect(web.sessionSnapshot().session?.user_id).toBe("u");
  });
  it("ignores a restore response arriving after logout", async () => {
    const web = await import("./web-session"); web.acceptWebSession({ authenticated: true, user_id: "u" });
    let finish!: (r: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; })).mockResolvedValueOnce(json({ logged_out: true, remote_logout_confirmed: true }));
    const restore = web.restoreWebSession();
    expect(await web.logoutWebSession()).toEqual({ confirmed: true, localCleared: true });
    finish(json({ authenticated: true, user_id: "u" })); await restore;
    expect(web.sessionSnapshot().session).toBeNull();
  });
  it("ignores stale restore results after a new successful login", async () => {
    const web = await import("./web-session"); let finish!: (r: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    const restore = web.restoreWebSession(); web.acceptWebSession({ authenticated: true, user_id: "new-user" });
    finish(json({ authenticated: true, user_id: "old-user" })); await restore;
    expect(web.sessionSnapshot().session?.user_id).toBe("new-user");
  });
  it("persists only logout intent when offline and retries logout after restart instead of restoring login", async () => {
    let web = await import("./web-session"); web.acceptWebSession({ authenticated: true, user_id: "u" });
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));
    expect(await web.logoutWebSession()).toEqual({ confirmed: false, localCleared: false });
    expect([...storage.values()]).toEqual(["pending"]);
    vi.resetModules(); web = await import("./web-session");
    vi.mocked(fetch).mockResolvedValue(json({ logged_out: true, remote_logout_confirmed: true }));
    await web.restoreWebSession(); expect(web.sessionSnapshot().session).toBeNull();
    expect(vi.mocked(fetch).mock.calls.at(-1)?.[0]).toBe("/api/session/logout");
    expect([...storage.values()]).toEqual(["complete"]);
    vi.mocked(fetch).mockClear(); await web.restoreWebSession(); expect(fetch).not.toHaveBeenCalled();
    web.acceptWebSession({ authenticated: true, user_id: "new" }); expect(storage.size).toBe(0);
  });
  it("distinguishes local logout from unconfirmed remote revocation", async () => {
    const web = await import("./web-session");
    vi.mocked(fetch).mockResolvedValue(json({ logged_out: true, remote_logout_confirmed: false }));
    expect(await web.logoutWebSession()).toEqual({ confirmed: false, localCleared: true });
    expect(web.sessionSnapshot().session).toBeNull();
  });
  it("migrates legacy login via a CSRF-protected POST, without reading credentials in JavaScript", async () => {
    const web = await import("./web-session");
    vi.mocked(fetch).mockResolvedValueOnce(json({ authenticated: false, needsMigration: true })).mockResolvedValueOnce(json({ authenticated: true, user_id: "upgraded" }));
    await web.restoreWebSession(); expect(web.sessionSnapshot().session?.user_id).toBe("upgraded");
    expect(vi.mocked(fetch).mock.calls[1][0]).toBe("/api/session/upgrade");
    expect(new Headers(vi.mocked(fetch).mock.calls[1][1]?.headers).get("x-erebrus-csrf")).toBe("1");
  });
  it("clears identity only on terminal server markers", async () => {
    const web = await import("./web-session"); web.acceptWebSession({ authenticated: true, user_id: "u" });
    web.observeSessionResponse(json({ code: "BUSINESS" }, 401)); expect(web.sessionSnapshot().session?.user_id).toBe("u");
    web.observeSessionResponse(new Response(null, { status: 401, headers: { "x-erebrus-session-ended": "1" } }));
    expect(web.sessionSnapshot().session).toBeNull();
  });
});
