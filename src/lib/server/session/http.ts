import { NextRequest, NextResponse } from "next/server";
import { SessionService } from "./service";
import { sessionStore } from "./store";
import { SessionError, type ServerSession } from "./types";

export const sessions = new SessionService(sessionStore);
export const SESSION_COOKIE = "__Host-erebrus_session";
const legacyTokenNames = ["erebrus_session_token", "erebrus_token_solana", "erebrus_token_evm", "erebrus_token"];
export function legacyLogin(request: NextRequest) {
  for (const name of legacyTokenNames) {
    const token = request.cookies.get(name)?.value;
    if (!token) continue;
    const suffix = name.endsWith("_solana") ? "_solana" : name.endsWith("_evm") ? "_evm" : "";
    return { token, wallet: request.cookies.get(`erebrus_wallet${suffix}`)?.value ?? "", method: name === "erebrus_session_token" ? request.cookies.get("erebrus_session_method")?.value ?? "email" : "wallet" };
  }
  return null;
}
export function clearLegacy(response: NextResponse) {
  for (const suffix of ["", "_solana", "_evm"]) {
    for (const base of ["erebrus_token", "erebrus_wallet", "erebrus_userid", "erebrus_token_exp"]) response.cookies.set(`${base}${suffix}`, "", { path: "/", maxAge: 0 });
  }
  for (const base of ["token", "userid", "method", "exp"]) response.cookies.set(`erebrus_session_${base}`, "", { path: "/", maxAge: 0 });
}
/** Custom non-simple header + exact Origin check. No CORS is enabled, so a
 * third-party page cannot attach this header. Applied to login as well as logout. */
export function checkCsrf(request: NextRequest) {
  const origin = process.env.APP_ORIGIN ?? request.nextUrl.origin;
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") throw new SessionError("CSRF_REJECTED", 403);
  if (!["GET", "HEAD"].includes(request.method) &&
      (request.headers.get("origin") !== origin || request.headers.get("x-erebrus-csrf") !== "1")) {
    throw new SessionError("CSRF_REJECTED", 403);
  }
}
export function sessionId(request: NextRequest): string | undefined {
  const id = request.cookies.get(SESSION_COOKIE)?.value;
  return id && /^[a-f0-9]{64}$/.test(id) ? id : undefined;
}
export function setSessionCookie(response: NextResponse, id: string, session: ServerSession) {
  response.cookies.set(SESSION_COOKIE, id, { path: "/", secure: true, httpOnly: true, sameSite: "lax", expires: new Date(session.expiresAt) });
  response.headers.set("Cache-Control", "no-store, private");
}
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", secure: true, httpOnly: true, sameSite: "lax", maxAge: 0 });
  clearLegacy(response);
}
export function sessionFailure(error: unknown) {
  // Never serialize request/response objects or exception messages: they can
  // contain gateway credentials (including in pg/HTTP diagnostic objects).
  const known = error instanceof SessionError;
  const response = NextResponse.json({ error: known ? error.code : "SESSION_SERVICE_UNAVAILABLE", code: known ? error.code : "SESSION_SERVICE_UNAVAILABLE" }, { status: known ? error.status : 503, headers: { "Cache-Control": "no-store, private" } });
  if (known && error.retryAfter) response.headers.set("Retry-After", error.retryAfter);
  if (known && error.terminal) {
    clearSessionCookie(response);
    response.headers.set("X-Erebrus-Session-Ended", "1");
  }
  return response;
}
