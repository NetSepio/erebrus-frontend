import Cookies from "js-cookie";

export interface StoredSession {
  token: string;
  userId: string;
  wallet?: string;
  expiresAt: number;
}

export interface SessionSnapshot {
  session: StoredSession | null;
  status: "checking" | "authenticated" | "signed-out" | "unavailable";
}

// Helper to get cookie key with chain suffix
const getChainCookieKey = (key: string, chainType: string) => `${key}_${chainType}`;

// Client-side token lifetime (adjust to server TTL if known)
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const EXPIRY_KEY = "erebrus_token_exp";

// ── Non-wallet session (email / Google / Apple login) ───────────────────────
// Wallet-optional accounts: stored under distinct keys so the wallet-disconnect
// cleanup never clears them.
const SESSION_TOKEN = "erebrus_session_token";
const SESSION_USERID = "erebrus_session_userid";
const SESSION_METHOD = "erebrus_session_method";
const SESSION_EXP = "erebrus_session_exp";
const SESSION_EVENT = "erebrus:session-change";
const options = {
  expires: 7,
  path: "/",
  sameSite: "Strict" as const,
  secure: process.env.NODE_ENV === "production",
};

export const getAuthFromCookies = (chainType: "solana" | "evm") => {
  const token = Cookies.get(getChainCookieKey("erebrus_token", chainType));
  const wallet = Cookies.get(getChainCookieKey("erebrus_wallet", chainType));
  const userId = Cookies.get(getChainCookieKey("erebrus_userid", chainType));
  const expiry = Cookies.get(getChainCookieKey(EXPIRY_KEY, chainType));

  // Enhanced validation: check for empty strings and null values
  if (!token?.trim() || !wallet?.trim() || !userId?.trim()) {
    return { token: undefined, wallet: undefined, userId: undefined, expired: true, expiresAt: 0 };
  }

  // Improved expiry logic with better error handling
  let expired = true; // Default to expired for safety
  const expiresAt = Number(expiry);
  if (Number.isSafeInteger(expiresAt) && expiresAt > 0) {
    expired = Date.now() >= expiresAt;
  } else {
    // If expiry timestamp is invalid, consider it expired
    expired = true;
  }
  return { token, wallet, userId, expired, expiresAt };
};

export const getWebSession = () => {
  const token = Cookies.get(SESSION_TOKEN);
  const userId = Cookies.get(SESSION_USERID);
  const expiresAt = Number(Cookies.get(SESSION_EXP));
  return {
    token: token?.trim() && userId?.trim() ? token : undefined,
    userId,
    method: Cookies.get(SESSION_METHOD),
    expiresAt,
    expired: !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now(),
  };
};

export function getStoredSession(): StoredSession | null {
  const identities = new Set<string>();
  for (const [tokenKey, userKey] of [
    ["erebrus_token_solana", "erebrus_userid_solana"],
    ["erebrus_token_evm", "erebrus_userid_evm"],
    [SESSION_TOKEN, SESSION_USERID],
  ]) {
    const userId = Cookies.get(userKey);
    if (Cookies.get(tokenKey)?.trim() && userId?.trim()) identities.add(userId);
  }
  if (identities.size > 1) return null;
  const candidates: StoredSession[] = [];
  // Return the token that's not expired
  for (const chain of ["solana", "evm"] as const) {
    const s = getAuthFromCookies(chain);
    if (s.token && s.userId && !s.expired) {
      candidates.push({ token: s.token, userId: s.userId, wallet: s.wallet, expiresAt: s.expiresAt });
    }
  }
  // Non-wallet (email / Google / Apple) session
  const web = getWebSession();
  if (web.token && web.userId && !web.expired) {
    candidates.push({ token: web.token, userId: web.userId, expiresAt: web.expiresAt });
  }
  // Fallback to legacy token
  const hasNamespacedToken = ["erebrus_token_solana", "erebrus_token_evm", SESSION_TOKEN]
    .some((key) => !!Cookies.get(key));
  if (!hasNamespacedToken) {
    const token = Cookies.get("erebrus_token");
    const userId = Cookies.get("erebrus_userid");
    const wallet = Cookies.get("erebrus_wallet");
    const expiresAt = Number(Cookies.get(EXPIRY_KEY));
    if (token?.trim() && userId?.trim() && wallet?.trim() && Number.isSafeInteger(expiresAt) && expiresAt > Date.now()) {
      candidates.push({ token, userId, wallet, expiresAt });
    }
  }
  return candidates[0] ?? null;
}

// Helper function to get current authentication token
export const getCurrentAuthToken = () => getStoredSession()?.token ?? null;
export const hasWebSession = () => {
  const web = getWebSession();
  return !!web.token && !web.expired && getCurrentAuthToken() === web.token;
};

function removeSessionCookies() {
  for (const chain of ["solana", "evm"] as const) {
    for (const key of ["erebrus_token", "erebrus_wallet", "erebrus_userid", EXPIRY_KEY]) {
      Cookies.remove(getChainCookieKey(key, chain), { path: "/" });
    }
  }
  for (const key of ["erebrus_token", "erebrus_wallet", "erebrus_userid", EXPIRY_KEY,
    SESSION_TOKEN, SESSION_USERID, SESSION_METHOD, SESSION_EXP]) {
    Cookies.remove(key, { path: "/" });
  }
}

// Cookie management utilities
export const setAuthCookies = (
  chainType: "solana" | "evm",
  token: string,
  walletAddress: string,
  userId: string,
) => {
  if (!token.trim() || !walletAddress.trim() || !userId.trim()) throw new Error("Incomplete session");
  removeSessionCookies();
  const wallet = chainType === "evm" ? walletAddress.toLowerCase() : walletAddress;
  const expiryTs = (Date.now() + TOKEN_TTL_MS).toString();
  Cookies.set(getChainCookieKey("erebrus_token", chainType), token, options);
  Cookies.set(getChainCookieKey("erebrus_wallet", chainType), wallet, options);
  Cookies.set(getChainCookieKey("erebrus_userid", chainType), userId, options);
  Cookies.set(getChainCookieKey(EXPIRY_KEY, chainType), expiryTs, options);

  // Backwards compatibility (legacy unsuffixed keys possibly read elsewhere)
  Cookies.set("erebrus_token", token, options);
  Cookies.set("erebrus_wallet", wallet, options);
  Cookies.set("erebrus_userid", userId, options);
  Cookies.set(EXPIRY_KEY, expiryTs, options);
  sessionChanged();
};

export const setWebSession = (token: string, userId: string, method: string) => {
  if (!token.trim() || !userId.trim()) throw new Error("Incomplete session");
  removeSessionCookies();
  Cookies.set(SESSION_TOKEN, token, options);
  Cookies.set(SESSION_USERID, userId, options);
  Cookies.set(SESSION_METHOD, method, options);
  Cookies.set(SESSION_EXP, (Date.now() + TOKEN_TTL_MS).toString(), options);
  sessionChanged();
};

export const clearWebSession = () => {
  [SESSION_TOKEN, SESSION_USERID, SESSION_METHOD, SESSION_EXP].forEach((key) => Cookies.remove(key, { path: "/" }));
  sessionChanged();
};

export function signOut() {
  removeSessionCookies();
  sessionChanged();
}

export function invalidateSession(token: string) {
  if (getCurrentAuthToken() === token) signOut();
}

const serverSnapshot: SessionSnapshot = { session: null, status: "checking" };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
let validation: { session: StoredSession; promise: Promise<void> } | null = null;

export const getSessionSnapshot = () => snapshot;
export const getServerSessionSnapshot = () => serverSnapshot;

function publish(session: StoredSession | null, status: SessionSnapshot["status"]) {
  snapshot = { session, status };
  if (expiryTimer) clearTimeout(expiryTimer);
  if (session && listeners.size) {
    expiryTimer = setTimeout(refreshSession, Math.min(Math.max(0, session.expiresAt - Date.now()), 2_147_483_647));
  }
  listeners.forEach((listener) => listener());
}

function reconcileSession() {
  const stored = getStoredSession();
  if (snapshot.session?.token !== stored?.token || snapshot.session?.expiresAt !== stored?.expiresAt ||
    snapshot.session?.userId !== stored?.userId || (!stored && snapshot.status !== "signed-out")) {
    publish(stored, stored ? "checking" : "signed-out");
  }
}

export function retrySessionValidation(): Promise<void> {
  reconcileSession();
  const current = snapshot.session;
  if (!current || snapshot.status === "authenticated") return Promise.resolve();
  if (validation?.session === current) return validation.promise;
  publish(current, "checking");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  const promise = (async () => {
    try {
      const response = await fetch("/api/gateway/account/profile", {
        headers: { Accept: "application/json", Authorization: `Bearer ${current.token}`, "X-Erebrus-Client": "webapp" },
        cache: "no-store",
        signal: controller.signal,
      });
      const profile = response.ok ? await response.json() as { id?: string; user_id?: string } : null;
      if (!response.ok) await response.body?.cancel();
      reconcileSession();
      if (snapshot.session !== current) {
        refreshSession();
        return;
      }
      if (response.status === 401) {
        invalidateSession(current.token);
      } else {
        const verified = response.ok && (profile?.id ?? profile?.user_id) === current.userId;
        publish(current, verified ? "authenticated" : "unavailable");
      }
    } catch {
      reconcileSession();
      if (snapshot.session === current) publish(current, "unavailable");
      else refreshSession();
    } finally {
      clearTimeout(timeout);
      if (validation?.session === current) validation = null;
    }
  })();
  validation = { session: current, promise };
  return promise;
}

export function refreshSession() {
  reconcileSession();
  if (listeners.size && snapshot.status === "checking") void retrySessionValidation();
}

function sessionChanged() {
  refreshSession();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SESSION_EVENT, `${Date.now()}:${Math.random()}`);
    } catch {
      return;
    }
  }
}

function onStorage(event: StorageEvent) {
  if (event.key === SESSION_EVENT || event.key === null) refreshSession();
}

function onFocus() {
  refreshSession();
  if (snapshot.status === "unavailable") void retrySessionValidation();
}

function onVisible() {
  if (document.visibilityState === "visible") onFocus();
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    refreshSession();
    if (snapshot.session) publish(snapshot.session, snapshot.status);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      if (expiryTimer) clearTimeout(expiryTimer);
    }
  };
}

export function safeAuthReturnPath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n\t]/.test(value)) return "/dashboard";
  const url = new URL(value, "https://erebrus.invalid");
  return url.origin === "https://erebrus.invalid" && !url.pathname.startsWith("//")
    ? `${url.pathname}${url.search}${url.hash}` : "/dashboard";
}
