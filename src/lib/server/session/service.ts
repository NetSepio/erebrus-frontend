import { createHmac, randomBytes } from "node:crypto";
import { SessionError, type Credentials, type ServerSession, type SessionStore } from "./types";

const terminalCodes = new Set(["REFRESH_TOKEN_INVALID", "REFRESH_TOKEN_REUSED", "SESSION_REVOKED"]);
export function errorCode(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const d = body as Record<string, unknown>;
  return String(d.code ?? d.error_code ?? (typeof d.error === "object" ? errorCode(d.error) : d.error) ?? "");
}
function expiry(value: unknown, seconds: unknown, now: number): number {
  const absolute = typeof value === "number" ? (value < 1e12 ? value * 1000 : value) : typeof value === "string" ? (/^\d+(\.\d+)?$/.test(value) ? Number(value) * (Number(value) < 1e12 ? 1000 : 1) : Date.parse(value)) : NaN;
  const result = Number.isFinite(absolute) ? absolute : now + Number(seconds) * 1000;
  if (!Number.isFinite(result) || result <= now) throw new SessionError("INVALID_SESSION_PAYLOAD", 502);
  return result;
}
export function parseCredentials(body: unknown, now = Date.now()): Credentials {
  const d = (body ?? {}) as Record<string, unknown>;
  const accessToken = d.access_token ?? d.token;
  if (typeof accessToken !== "string" || !accessToken || typeof d.refresh_token !== "string" || !d.refresh_token || !d.session_id || !d.user_id) {
    throw new SessionError("INVALID_SESSION_PAYLOAD", 502);
  }
  return {
    accessToken, refreshToken: d.refresh_token,
    accessExpiresAt: expiry(d.expires_at, d.expires_in, now),
    refreshExpiresAt: expiry(d.refresh_expires_at, d.refresh_expires_in, now),
    sessionId: String(d.session_id), userId: String(d.user_id), role: String(d.role ?? "user"),
  };
}
export function publicSession(session: ServerSession) {
  return { authenticated: true, user_id: session.credentials!.userId, role: session.credentials!.role,
    wallet_address: session.walletAddress, method: session.method, expires_at: session.expiresAt };
}
export function gatewayUrl(path: string) {
  const base = process.env.GATEWAY_URL ?? process.env.NEXT_PUBLIC_GATEWAY_URL ?? "https://gateway.erebrus.io";
  return new URL(`api/v2/${path}`, `${base.replace(/\/+$/, "")}/`);
}
export type GatewayFetch = (path: string, init: RequestInit) => Promise<Response>;
export const gatewayRequest: GatewayFetch = (path, init) => fetch(gatewayUrl(path), {
  ...init, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(20000),
});

export class SessionService {
  constructor(private store: SessionStore, private gateway: GatewayFetch = gatewayRequest, private now = Date.now) {}
  async create(body: unknown, walletAddress: string, method: string) {
    const credentials = parseCredentials(body, this.now());
    const id = randomBytes(32).toString("hex");
    const session: ServerSession = { credentials, walletAddress, method, state: "active", expiresAt: credentials.refreshExpiresAt };
    await this.store.locked(id, (row) => row.write(session));
    return { id, session };
  }
  async read(id: string): Promise<ServerSession> {
    return this.store.locked(id, async (row) => this.active(await row.read()));
  }
  private active(session: ServerSession | null): ServerSession {
    if (!session || session.state === "revoked" || session.expiresAt <= this.now()) throw new SessionError("SESSION_REVOKED", 401, undefined, true);
    if (session.state === "legacy-unrecoverable" || !session.credentials) throw new SessionError("LEGACY_LOGIN_REQUIRED", 401);
    return session;
  }
  /** rejectedAccess is the exact credential used by a rejected call. A waiter
   * reuses a replacement committed by another instance instead of rotating again. */
  async access(id: string, rejectedAccess?: string): Promise<ServerSession> {
    return this.store.locked(id, async (row) => {
      const session = this.active(await row.read());
      const creds = session.credentials!;
      if (rejectedAccess && rejectedAccess !== creds.accessToken) return session;
      if (!rejectedAccess && creds.accessExpiresAt > this.now() + 60000) return session;
      if (session.retryAt && session.retryAt > this.now()) throw new SessionError("REFRESH_RATE_LIMITED", 429, new Date(session.retryAt).toUTCString());
      if (session.state !== "active") throw new SessionError("REFRESH_OUTCOME_UNKNOWN", 503);
      // Commit intent BEFORE sending. Never replay this credential after an
      // ambiguous response, worker death, or failure persisting its replacement.
      session.state = "refreshing";
      await row.write(session);
      let response: Response;
      try {
        response = await this.gateway("auth/refresh", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: creds.refreshToken }) });
      } catch {
        session.state = "uncertain";
        await row.write(session);
        throw new SessionError("REFRESH_OUTCOME_UNKNOWN", 503);
      }
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const code = errorCode(body);
        if (terminalCodes.has(code)) {
          session.state = "revoked";
          session.remoteLogoutConfirmed = true;
          delete session.credentials;
          await row.write(session);
          throw new SessionError(code, 401, undefined, true);
        }
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        // Only a definitive rate-limit rejection can be attempted later. 5xx,
        // malformed responses and transport failures could hide a rotation.
        session.state = response.status === 429 ? "active" : "uncertain";
        if (response.status === 429) {
          const delay = Number(retryAfter);
          session.retryAt = retryAfter && !Number.isFinite(delay) ? Date.parse(retryAfter) : this.now() + (Number.isFinite(delay) ? delay : 60) * 1000;
          if (!Number.isFinite(session.retryAt)) session.retryAt = this.now() + 60000;
        }
        await row.write(session);
        throw new SessionError(code || "REFRESH_UNAVAILABLE", response.status >= 500 ? response.status : response.status === 429 ? 429 : 503, retryAfter);
      }
      const replacement = parseCredentials(body, this.now());
      if (replacement.userId !== creds.userId || replacement.sessionId !== creds.sessionId || replacement.refreshToken === creds.refreshToken) {
        throw new SessionError("INVALID_SESSION_REPLACEMENT", 502);
      }
      session.credentials = replacement;
      session.state = "active";
      session.expiresAt = replacement.refreshExpiresAt;
      delete session.retryAt;
      await row.write(session);
      return session;
    });
  }
  async revoke(id: string): Promise<boolean> {
    return this.store.locked(id, async (row) => {
      const session = await row.read();
      if (!session) return true;
      if (session.state === "revoked") return session.remoteLogoutConfirmed === true;
      const creds = session.credentials;
      const wasUncertain = session.state === "uncertain" || session.state === "refreshing";
      session.state = "revoked";
      session.remoteLogoutConfirmed = false;
      delete session.credentials;
      // Local revocation is durable even if the gateway is unreachable.
      await row.write(session);
      if (!creds || wasUncertain) return false;
      try {
        const response = await this.gateway("auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: creds.refreshToken }) });
        const confirmed = response.status === 204 || terminalCodes.has(errorCode(await response.json().catch(() => null)));
        session.remoteLogoutConfirmed = confirmed;
        await row.write(session);
        return confirmed;
      } catch { return false; }
    });
  }
  async upgrade(token: string, walletAddress = "", method = "wallet") {
    const secret = process.env.SESSION_ENCRYPTION_KEY;
    if (!secret) throw new SessionError("SESSION_STORE_NOT_CONFIGURED");
    const id = createHmac("sha256", secret).update(`legacy:${token}`).digest("hex");
    return this.store.locked(id, async (row) => {
      const previous = await row.read();
      if (previous) {
        if (previous.credentials || previous.state === "revoked" || previous.state === "legacy-unrecoverable") return { id, session: this.active(previous) };
        if (!previous.retryAt) throw new SessionError("LEGACY_UPGRADE_OUTCOME_UNKNOWN", 503);
        if (previous.retryAt > this.now()) throw new SessionError("LEGACY_UPGRADE_RATE_LIMITED", 429, new Date(previous.retryAt).toUTCString());
      }
      const pending: ServerSession = { state: "uncertain", walletAddress, method, expiresAt: this.now() + 30 * 86400000 };
      // Exactly one upgrade attempt across tabs/instances, even after a crash.
      await row.write(pending);
      let response: Response;
      try { response = await this.gateway("auth/session", { method: "POST", headers: { Authorization: `Bearer ${token}` } }); }
      catch { throw new SessionError("LEGACY_UPGRADE_OUTCOME_UNKNOWN", 503); }
      if (!response.ok) {
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if (response.status === 409 || response.status === 401) {
          pending.state = "legacy-unrecoverable";
          await row.write(pending);
          throw new SessionError("LEGACY_LOGIN_REQUIRED", 401);
        }
        if (response.status === 429) {
          const seconds = Number(retryAfter);
          pending.retryAt = retryAfter && !Number.isFinite(seconds) ? Date.parse(retryAfter) : this.now() + (Number.isFinite(seconds) ? seconds : 60) * 1000;
          if (!Number.isFinite(pending.retryAt)) pending.retryAt = this.now() + 60000;
          await row.write(pending);
        }
        throw new SessionError("LEGACY_UPGRADE_UNAVAILABLE", response.status === 429 ? 429 : 503, retryAfter);
      }
      const credentials = parseCredentials(await response.json(), this.now());
      const session: ServerSession = { ...pending, state: "active", credentials, expiresAt: credentials.refreshExpiresAt };
      await row.write(session);
      return { id, session };
    });
  }
}
