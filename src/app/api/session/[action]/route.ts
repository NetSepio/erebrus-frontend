import { NextRequest, NextResponse } from "next/server";
import { checkCsrf, clearLegacy, clearSessionCookie, legacyLogin, sessionFailure, sessionId, sessions, setSessionCookie } from "@/lib/server/session/http";
import { publicSession } from "@/lib/server/session/service";
import { SessionError } from "@/lib/server/session/types";
export const runtime = "nodejs";
export async function POST(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  try {
    checkCsrf(request);
    const { action } = await params;
    const id = sessionId(request);
    if (action === "logout") {
      // If the browser still has a legacy login, upgrade/revoke it as well.
      let logoutId = id;
      let confirmed = true;
      const legacy = legacyLogin(request);
      if (!logoutId && legacy) {
        try { logoutId = (await sessions.upgrade(legacy.token, legacy.wallet, legacy.method)).id; }
        catch { confirmed = false; }
      }
      if (logoutId) confirmed = await sessions.revoke(logoutId);
      const response = NextResponse.json({ logged_out: true, remote_logout_confirmed: confirmed }, { headers: { "Cache-Control": "no-store, private" } });
      clearSessionCookie(response);
      return response;
    }
    if (action === "upgrade") {
      let result;
      if (id) result = { id, session: await sessions.access(id) };
      else {
        const legacy = legacyLogin(request);
        if (!legacy) throw new SessionError("LEGACY_LOGIN_REQUIRED", 401);
        result = await sessions.upgrade(legacy.token, legacy.wallet, legacy.method);
      }
      const response = NextResponse.json(publicSession(result.session));
      clearLegacy(response);
      setSessionCookie(response, result.id, result.session);
      return response;
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) { return sessionFailure(error); }
}
