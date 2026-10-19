import { NextRequest, NextResponse } from "next/server";
import { checkCsrf, clearLegacy, sessionFailure, sessionId, sessions, setSessionCookie } from "@/lib/server/session/http";
import { errorCode, gatewayUrl, publicSession } from "@/lib/server/session/service";
import { SessionError } from "@/lib/server/session/types";
import { replayBody } from "@/lib/server/session/replay-body";

export const runtime = "nodejs";
const loginPaths = new Map([["auth", "wallet"], ["auth/email/login/verify", "email"], ["auth/google", "google"], ["auth/apple", "apple"]]);
const protectedAuthPaths = new Set(["auth/email", "auth/email/verify"]);
const publicAuthPaths = new Set(["auth", "auth/methods", "auth/email/login/start", ...loginPaths.keys()]);
async function proxy(request: NextRequest, pathSegments: string[]) {
  let body: Awaited<ReturnType<typeof replayBody>> | undefined;
  try {
    checkCsrf(request);
    // Encoded separators, query/fragment delimiters and URL dot-normalization
    // must never escape the fixed gateway prefix or bypass auth endpoint rules.
    if (pathSegments.some((segment) => !segment || /[\\/%?#\x00-\x20]/.test(segment) || segment === "." || segment === "..")) throw new SessionError("INVALID_PATH", 400);
    const path = pathSegments.join("/");
    if (path.startsWith("auth/") && !publicAuthPaths.has(path) && !protectedAuthPaths.has(path)) throw new SessionError("AUTH_ENDPOINT_RESERVED", 404);
    if (["refresh_token", "access_token", "token"].some((name) => request.nextUrl.searchParams.has(name))) throw new SessionError("CREDENTIAL_IN_QUERY", 400);
    const target = gatewayUrl(path);
    target.search = request.nextUrl.search;
    const login = request.method === "POST" && loginPaths.has(path);
    const headers = new Headers({ Accept: request.headers.get("accept") || "application/json", "X-Erebrus-Client": "webapp" });
    for (const name of ["content-type", "idempotency-key", "x-idempotency-key", "range", "if-none-match", "if-match"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    // Authorization/API keys supplied by browser JS are never forwarded.
    const id = sessionId(request);
    let session = id && request.headers.get("x-erebrus-public") !== "1" && !publicAuthPaths.has(path) ? await sessions.access(id) : undefined;
    if (session) headers.set("Authorization", `Bearer ${session.credentials!.accessToken}`);
    body = await replayBody(request);
    const send = () => fetch(target, {
      method: request.method, headers, body: body!.open(), duplex: "half", cache: "no-store", redirect: "manual",
      signal: AbortSignal.timeout(120000),
    } as RequestInit);
    let upstream = await send();
    if (id && session && upstream.status === 401 && errorCode(await upstream.clone().json().catch(() => null)) === "ACCESS_TOKEN_EXPIRED") {
      await upstream.body?.cancel();
      session = await sessions.access(id, session.credentials!.accessToken);
      headers.set("Authorization", `Bearer ${session.credentials!.accessToken}`);
      upstream = await send(); // Exactly once; refresh never enters this proxy.
    }
    if (session && upstream.status === 401) {
      const code = errorCode(await upstream.clone().json().catch(() => null));
      if (["REFRESH_TOKEN_INVALID", "REFRESH_TOKEN_REUSED", "SESSION_REVOKED"].includes(code)) {
        await sessions.revoke(id!);
        throw new SessionError(code, 401, undefined, true);
      }
    }
    if (login && upstream.ok) {
      const payload = await upstream.json();
      // Browser-facing response is an allowlist; gateway refresh secrets and
      // aliases never pass through. Native /auth explicitly retains access export.
      const created = await sessions.create(payload, path === "auth" ? await walletFromBody(body) : "", loginPaths.get(path)!);
      const desktop = request.headers.get("x-erebrus-desktop-auth") === "1";
      const response = NextResponse.json({ ...publicSession(created.session), ...(desktop ? { token: created.session.credentials!.accessToken } : {}) });
      if (!desktop) {
        if (id) await sessions.revoke(id);
        clearLegacy(response);
        setSessionCookie(response, created.id, created.session);
      }
      response.headers.set("Cache-Control", "no-store, private");
      response.headers.set("Referrer-Policy", "no-referrer");
      return response;
    }
    const outHeaders = new Headers({ "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" });
    for (const name of ["Content-Type", "Content-Length", "Content-Disposition", "ETag", "Content-Range", "Accept-Ranges", "Content-Security-Policy", "X-Content-Type-Options", "Retry-After"]) {
      const value = upstream.headers.get(name);
      if (value) outHeaders.set(name, value);
    }
    // Do not forward external redirects or Set-Cookie from the gateway.
    const location = upstream.headers.get("location");
    if (location?.startsWith("/api/v2/")) outHeaders.set("Location", `/api/gateway/${location.slice(8)}`);
    const response = new NextResponse([204, 205, 304].includes(upstream.status) ? null : upstream.body, { status: upstream.status, headers: outHeaders });
    if (id && session) {
      // A logout that won the lock makes late protected responses unable to
      // renew the cookie. Revocation tombstones also reject any delayed cookie.
      const current = await sessions.read(id);
      setSessionCookie(response, id, current);
    }
    return response;
  } catch (error) { return sessionFailure(error); }
  finally { await body?.dispose(); }
}
// Read the small wallet login JSON from the spool, never from a consumed Request.
async function walletFromBody(body: Awaited<ReturnType<typeof replayBody>>) {
  const stream = body.open();
  if (!stream) return "";
  const json = await new Response(stream as BodyInit).json().catch(() => null);
  return typeof json?.public_key === "string" ? json.public_key : "";
}
async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(request, (await params).path); }
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as HEAD };
