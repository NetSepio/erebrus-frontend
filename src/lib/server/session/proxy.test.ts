import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("./store", async () => {
  const { TestStore } = await import("./test-store");
  return { sessionStore: new TestStore() };
});
import { sessions } from "./http";
import { GET, POST, PUT } from "@/app/api/gateway/[...path]/route";
const json = (body: unknown, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });
function payload() { return { access_token: "access-original", refresh_token: "refresh-original", user_id: "u", role: "user", session_id: "s", expires_in: 86400, refresh_expires_in: 2592000 }; }
function request(path: string, id?: string, method = "GET", body?: string, extra = {}) {
  return new NextRequest(`https://erebrus.test/api/gateway/${path}`, { method, body,
    headers: { origin: "https://erebrus.test", "x-erebrus-csrf": "1", ...(id ? { cookie: `__Host-erebrus_session=${id}` } : {}), ...extra } });
}
const params = (path: string) => ({ params: Promise.resolve({ path: path.split("/") }) });
beforeEach(() => { vi.stubGlobal("fetch", vi.fn()); });
afterEach(() => { vi.unstubAllGlobals(); });
describe("BFF gateway proxy", () => {
  it.each(["auth", "auth/email/login/verify", "auth/google", "auth/apple"])("captures %s credentials without exposing any aliases", async (path) => {
    vi.mocked(fetch).mockResolvedValue(json(payload()));
    const response = await POST(request(path, undefined, "POST", JSON.stringify({ public_key: "SoLaNa" })), params(path));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.user_id).toBe("u"); expect(body.token).toBeUndefined(); expect(body.access_token).toBeUndefined(); expect(body.refresh_token).toBeUndefined();
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    if (path === "auth") expect(body.wallet_address).toBe("SoLaNa");
  });
  it("preserves the explicit desktop access handoff without replacing the web session or exporting refresh", async () => {
    vi.mocked(fetch).mockResolvedValue(json(payload()));
    const response = await POST(request("auth/google", undefined, "POST", "{}", { "x-erebrus-desktop-auth": "1" }), params("auth/google"));
    const body = await response.json();
    expect(body.token).toBe("access-original"); expect(body.refresh_token).toBeUndefined();
    expect(response.headers.has("set-cookie")).toBe(false);
  });
  it("retries an ACCESS_TOKEN_EXPIRED request once with identical body and idempotency key", async () => {
    const { id } = await sessions.create(payload(), "", "email");
    const sent: Array<{ body: string; authorization: string | null; key: string | null }> = [];
    vi.mocked(fetch).mockImplementation(async (url, init) => {
      if (String(url).endsWith("auth/refresh")) return json({ ...payload(), access_token: "access-new", refresh_token: "refresh-new" });
      sent.push({ body: await new Response(init?.body).text(), authorization: new Headers(init?.headers).get("authorization"), key: new Headers(init?.headers).get("idempotency-key") });
      return sent.length === 1 ? json({ code: "ACCESS_TOKEN_EXPIRED" }, 401) : json({ done: true });
    });
    const response = await PUT(request("drop/uploads/id/content", id, "PUT", "exact bytes\u0000with binary", { "idempotency-key": "stable-key" }), params("drop/uploads/id/content"));
    expect(response.status).toBe(200);
    expect(sent).toEqual([
      { body: "exact bytes\u0000with binary", authorization: "Bearer access-original", key: "stable-key" },
      { body: "exact bytes\u0000with binary", authorization: "Bearer access-new", key: "stable-key" },
    ]);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(3);
  });
  it("does not recursively retry a second expiry response or sign out on business 401", async () => {
    const { id } = await sessions.create(payload(), "", "email");
    vi.mocked(fetch).mockImplementation(async (url) => String(url).endsWith("auth/refresh") ? json({ ...payload(), access_token: "new", refresh_token: "new-refresh" }) : json({ code: "ACCESS_TOKEN_EXPIRED" }, 401));
    const response = await GET(request("profile", id), params("profile"));
    expect(response.status).toBe(401); expect(vi.mocked(fetch)).toHaveBeenCalledTimes(3);
    expect((await sessions.read(id)).state).toBe("active");
  });
  it("preserves business errors and Retry-After without clearing authentication", async () => {
    const { id } = await sessions.create(payload(), "", "email");
    vi.mocked(fetch).mockResolvedValue(json({ code: "BUSINESS" }, 429, { "Retry-After": "180" }));
    const response = await GET(request("profile", id), params("profile"));
    expect(response.status).toBe(429); expect(response.headers.get("retry-after")).toBe("180");
    expect(response.headers.get("set-cookie")).not.toContain("Max-Age=0");
    expect((await sessions.read(id)).state).toBe("active");
  });
  it("rejects direct refresh/session/logout and path bypasses", async () => {
    for (const path of ["auth/refresh", "auth/logout", "auth/session", "auth%2frefresh", "auth/../refresh"]) {
      const response = await POST(request(path, undefined, "POST", "{}"), params(path));
      expect([400, 404]).toContain(response.status);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  it("preserves authenticated email-linking routes and Drop WebUI asset filenames", async () => {
    const { id } = await sessions.create(payload(), "", "email");
    vi.mocked(fetch).mockResolvedValue(json({ ok: true }));
    const email = await POST(request("auth/email", id, "POST", JSON.stringify({ email: "test@example.com" })), params("auth/email"));
    expect(email.status).toBe(200);
    expect(new Headers(vi.mocked(fetch).mock.calls[0][1]?.headers).get("authorization")).toBe("Bearer access-original");
    expect((await GET(request("drop/webui/id/static/app.js", id), params("drop/webui/id/static/app.js"))).status).toBe(200);
  });
  it("never forwards browser-supplied access bearers or API keys", async () => {
    vi.mocked(fetch).mockResolvedValue(json([]));
    await GET(request("nodes", undefined, "GET", undefined, { authorization: "Bearer browser-secret", "x-api-key": "key" }), params("nodes"));
    const headers = new Headers(vi.mocked(fetch).mock.calls[0][1]?.headers);
    expect(headers.has("authorization")).toBe(false); expect(headers.has("x-api-key")).toBe(false);
  });
});
