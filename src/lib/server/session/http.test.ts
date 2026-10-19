import { describe, expect, it } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { checkCsrf, clearSessionCookie, sessionFailure, setSessionCookie, SESSION_COOKIE } from "./http";
import { SessionError } from "./types";
import { parseCredentials } from "./service";
import { seal, unseal } from "./store";

function request(method = "POST", headers = {}) { return new NextRequest("https://erebrus.test/api/session/logout", { method, headers }); }
describe("session HTTP boundary", () => {
  it("rejects cross-origin and simple form mutations, including login CSRF", () => {
    expect(() => checkCsrf(request())).toThrow("CSRF_REJECTED");
    expect(() => checkCsrf(request("POST", { origin: "https://evil.test", "x-erebrus-csrf": "1" }))).toThrow();
    expect(() => checkCsrf(request("POST", { origin: "https://erebrus.test" }))).toThrow();
    expect(() => checkCsrf(request("GET", { "sec-fetch-site": "cross-site" }))).toThrow();
    expect(() => checkCsrf(request("POST", { origin: "https://erebrus.test", "x-erebrus-csrf": "1" }))).not.toThrow();
  });
  it("persists only an opaque Secure HttpOnly cookie until the returned refresh expiry", () => {
    const now = Date.now();
    const credentials = parseCredentials({ access_token: "opaque-access", refresh_token: "secret-refresh", user_id: "u", session_id: "s", expires_in: 86400, refresh_expires_in: 123456 }, now);
    const response = NextResponse.json({});
    setSessionCookie(response, "a".repeat(64), { credentials, method: "email", walletAddress: "", state: "active", expiresAt: credentials.refreshExpiresAt });
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toContain(`${SESSION_COOKIE}=${"a".repeat(64)}`);
    expect(cookie).toContain("Secure"); expect(cookie).toContain("HttpOnly"); expect(cookie).toContain("SameSite=lax");
    expect(cookie).toContain(`Expires=${new Date(credentials.refreshExpiresAt).toUTCString()}`);
    expect(cookie).not.toContain("secret-refresh"); expect(cookie).not.toContain("opaque-access");
  });
  it("clears session cookies only for terminal errors, preserving Retry-After", async () => {
    for (const code of ["REFRESH_TOKEN_INVALID", "REFRESH_TOKEN_REUSED", "SESSION_REVOKED"]) {
      expect(sessionFailure(new SessionError(code, 401, undefined, true)).headers.get("set-cookie")).toContain("Max-Age=0");
    }
    for (const status of [400, 401, 429, 503]) {
      const response = sessionFailure(new SessionError("TEMPORARY", status, "120"));
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(response.headers.get("retry-after")).toBe("120");
    }
    const unknown = sessionFailure(new Error("secret-refresh in diagnostic"));
    expect(await unknown.text()).not.toContain("secret-refresh");
  });
  it("deletes legacy credential cookies on logout", () => {
    const response = NextResponse.json({}); clearSessionCookie(response);
    expect(response.headers.get("set-cookie")).toContain("erebrus_token_solana=;");
    expect(response.headers.get("set-cookie")).toContain("erebrus_session_token=;");
  });
  it("encrypts stored credentials, authenticates the session ID and detects tampering", () => {
    process.env.SESSION_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
    const session = { method: "email", walletAddress: "", state: "active" as const, expiresAt: Date.now() + 10000 };
    const encrypted = seal(session, "session-a");
    expect(encrypted).not.toContain("email"); expect(unseal(encrypted, "session-a")).toEqual(session);
    expect(() => unseal(encrypted, "session-b")).toThrow();
    const bytes = Buffer.from(encrypted, "base64"); bytes[bytes.length - 1] ^= 1;
    expect(() => unseal(bytes.toString("base64"), "session-a")).toThrow();
  });
});
