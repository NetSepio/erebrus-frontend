import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cookies = vi.hoisted(() => new Map<string, string>());
vi.mock("js-cookie", () => ({ default: {
  get: (key: string) => cookies.get(key),
  set: (key: string, value: string) => cookies.set(key, value),
  remove: (key: string) => cookies.delete(key),
} }));

let session: typeof import("./auth-session");
let unsubscribe: (() => void) | undefined;
let browser: EventTarget & { localStorage: { setItem: ReturnType<typeof vi.fn> } };

function wallet(chain = "evm", token = "wallet-token", userId = "user-1", expiry = Date.now() + 60_000) {
  cookies.set(`erebrus_token_${chain}`, token);
  cookies.set(`erebrus_wallet_${chain}`, "0xabc");
  cookies.set(`erebrus_userid_${chain}`, userId);
  cookies.set(`erebrus_token_exp_${chain}`, String(expiry));
}

function profile() {
  return new Response(JSON.stringify({ id: "user-1" }), { status: 200 });
}

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  cookies.clear();
  browser = Object.assign(new EventTarget(), { localStorage: { setItem: vi.fn() } });
  vi.stubGlobal("window", browser);
  vi.stubGlobal("document", Object.assign(new EventTarget(), { visibilityState: "visible" }));
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => profile()));
  session = await import("./auth-session");
});

afterEach(() => {
  unsubscribe?.();
  unsubscribe = undefined;
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("stored session selection", () => {
  it.each(["evm", "solana"])("restores %s without a wallet connection or pathname", (chain) => {
    wallet(chain);
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
  });

  it.each(["", "NaN", "Infinity", "123abc", "0"])("rejects invalid expiry %j", (expiry) => {
    wallet();
    cookies.set("erebrus_token_exp_evm", expiry);
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("rejects a session at its expiry boundary", () => {
    wallet("evm", "expired", "user-1", Date.now());
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("requires the companion identity cookies", () => {
    wallet();
    cookies.delete("erebrus_userid_evm");
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("does not use an unchecked legacy token", () => {
    cookies.set("erebrus_token", "legacy");
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("accepts a complete non-expired legacy-only session", () => {
    cookies.set("erebrus_token", "legacy");
    cookies.set("erebrus_wallet", "0xabc");
    cookies.set("erebrus_userid", "user-1");
    cookies.set("erebrus_token_exp", String(Date.now() + 60_000));
    expect(session.getCurrentAuthToken()).toBe("legacy");
  });

  it("does not resurrect an expired namespaced session through legacy cookies", () => {
    wallet("evm", "old", "user-1", Date.now() - 1);
    cookies.set("erebrus_token", "old");
    cookies.set("erebrus_wallet", "0xabc");
    cookies.set("erebrus_userid", "user-1");
    cookies.set("erebrus_token_exp", String(Date.now() + 60_000));
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("requires sign-in rather than choosing between different accounts", () => {
    wallet("evm", "a", "user-a");
    wallet("solana", "b", "user-b");
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("does not silently select a different account when one of several sessions expires", () => {
    wallet("evm", "a", "user-a", Date.now() - 1);
    wallet("solana", "b", "user-b");
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it.each(["email", "google", "apple"])("a new %s login replaces old wallet sessions", (method) => {
    wallet();
    session.setWebSession("web-token", "user-1", method);
    expect(session.getCurrentAuthToken()).toBe("web-token");
    expect(cookies.has("erebrus_token_evm")).toBe(false);
  });

  it("a new wallet login replaces the previous account", () => {
    session.setWebSession("web-token", "old-user", "email");
    session.setAuthCookies("solana", "new-token", "CaseSensitiveWallet", "user-1");
    expect(session.getCurrentAuthToken()).toBe("new-token");
    expect(cookies.has("erebrus_session_token")).toBe(false);
    expect(cookies.get("erebrus_wallet_solana")).toBe("CaseSensitiveWallet");
  });
});

describe("safe reauthentication destinations", () => {
  it("preserves the requested workspace and billing query", () => {
    expect(session.safeAuthReturnPath("/workspace/org?tab=billing#status")).toBe("/workspace/org?tab=billing#status");
  });

  it.each([undefined, "https://evil.example", "//evil.example", "/\\evil.example", "/a/..//evil.example", "javascript:alert(1)"])("rejects an external destination %j", (path) => {
    expect(session.safeAuthReturnPath(path)).toBe("/dashboard");
  });
});

describe("shared session lifecycle", () => {
  it("preserves the session across billing, workspace, and dashboard navigation", async () => {
    wallet();
    for (const pathname of ["/billing/return", "/workspace/org", "/dashboard"]) {
      Object.assign(browser, { location: { pathname } });
      unsubscribe = session.subscribeSession(vi.fn());
      await session.retrySessionValidation();
      await vi.advanceTimersByTimeAsync(1500);
      expect(session.getSessionSnapshot().status).toBe("authenticated");
      expect(session.getCurrentAuthToken()).toBe("wallet-token");
      unsubscribe();
      unsubscribe = undefined;
    }
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("does not authenticate a malformed profile response", async () => {
    wallet();
    vi.mocked(fetch).mockResolvedValue(new Response("<html>Unavailable</html>"));
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("unavailable");
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
  });

  it("does not authenticate a different account from a mismatched identity cookie", async () => {
    wallet();
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: "other-user" })));
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("unavailable");
  });

  it("bounds validation time without deleting the session", async () => {
    wallet();
    vi.mocked(fetch).mockImplementation((_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    unsubscribe = session.subscribeSession(vi.fn());
    await vi.advanceTimersByTimeAsync(15_000);
    expect(session.getSessionSnapshot().status).toBe("unavailable");
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
  });

  it("does not restore a session if an in-flight validation succeeds after logout", async () => {
    wallet();
    let respond!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => { respond = resolve; }));
    unsubscribe = session.subscribeSession(vi.fn());
    const pending = session.retrySessionValidation();
    session.signOut();
    respond(profile());
    await pending;
    expect(session.getSessionSnapshot().status).toBe("signed-out");
  });

  it("validates once for multiple subscribers and retains the session past the old disconnect timer", async () => {
    wallet();
    unsubscribe = session.subscribeSession(vi.fn());
    const second = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(session.getSessionSnapshot().status).toBe("authenticated");
    await vi.advanceTimersByTimeAsync(1500);
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
    second();
  });

  it("provides a stable checking snapshot during SSR", () => {
    expect(session.getServerSessionSnapshot()).toBe(session.getServerSessionSnapshot());
    expect(session.getServerSessionSnapshot().status).toBe("checking");
  });

  it("expires and notifies all subscribers even without a wallet event", async () => {
    wallet("evm", "wallet-token", "user-1", Date.now() + 2000);
    const listener = vi.fn();
    unsubscribe = session.subscribeSession(listener);
    await session.retrySessionValidation();
    listener.mockClear();
    await vi.advanceTimersByTimeAsync(2000);
    expect(session.getSessionSnapshot().status).toBe("signed-out");
    expect(session.getCurrentAuthToken()).toBeNull();
    expect(listener).toHaveBeenCalled();
  });

  it.each([403, 429, 500, 502, 504])("preserves cookies on validation HTTP %s", async (status) => {
    wallet();
    vi.mocked(fetch).mockResolvedValue(new Response("", { status }));
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("unavailable");
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
  });

  it("preserves the session on network failure and permits retry", async () => {
    wallet();
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("fetch failed"));
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("unavailable");
    expect(session.getCurrentAuthToken()).toBe("wallet-token");
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("authenticated");
  });

  it("clears all copies of the rejected current session on 401", async () => {
    session.setAuthCookies("evm", "wallet-token", "0xabc", "user-1");
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 401 }));
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    expect(session.getSessionSnapshot().status).toBe("signed-out");
    expect(cookies.has("erebrus_token")).toBe(false);
    expect(session.getCurrentAuthToken()).toBeNull();
  });

  it("does not clear a newer session when an old API request returns 401", () => {
    session.setWebSession("new-token", "user-1", "email");
    session.invalidateSession("old-token");
    expect(session.getCurrentAuthToken()).toBe("new-token");
  });

  it("ignores a stale validation response after a new login", async () => {
    wallet();
    let respond!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => { respond = resolve; }));
    unsubscribe = session.subscribeSession(vi.fn());
    const oldValidation = session.retrySessionValidation();
    session.setWebSession("new-token", "user-1", "email");
    await session.retrySessionValidation();
    respond(new Response("", { status: 401 }));
    await oldValidation;
    expect(session.getCurrentAuthToken()).toBe("new-token");
    expect(session.getSessionSnapshot().status).toBe("authenticated");
  });

  it("logs out every cookie family and broadcasts no credentials", async () => {
    session.setAuthCookies("evm", "sensitive-token", "0xabc", "user-1");
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    session.signOut();
    expect(cookies.size).toBe(0);
    expect(session.getSessionSnapshot().status).toBe("signed-out");
    expect(JSON.stringify(browser.localStorage.setItem.mock.calls)).not.toContain("sensitive-token");
    expect(browser.localStorage.setItem).toHaveBeenCalled();
  });

  it("reconciles cookies when another tab reports a session change", async () => {
    wallet();
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    cookies.clear();
    const event = Object.assign(new Event("storage"), { key: "erebrus:session-change" });
    browser.dispatchEvent(event);
    expect(session.getSessionSnapshot().status).toBe("signed-out");
  });

  it("rechecks cookies on focus when storage events are unavailable", async () => {
    wallet();
    unsubscribe = session.subscribeSession(vi.fn());
    await session.retrySessionValidation();
    cookies.clear();
    browser.dispatchEvent(new Event("focus"));
    expect(session.getSessionSnapshot().status).toBe("signed-out");
  });
});
