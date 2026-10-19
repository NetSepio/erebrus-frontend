import { NextRequest, NextResponse } from "next/server";
import { checkCsrf, legacyLogin, sessionFailure, sessionId, sessions, setSessionCookie } from "@/lib/server/session/http";
import { SessionError } from "@/lib/server/session/types";
import { publicSession } from "@/lib/server/session/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    checkCsrf(request);
    const id = sessionId(request);
    if (!id) return NextResponse.json({ authenticated: false, needsMigration: !!legacyLogin(request) }, { headers: { "Cache-Control": "no-store, private" } });
    let session = await sessions.read(id);
    let warning: string | undefined;
    try { session = await sessions.access(id); }
    catch (error) {
      if (!(error instanceof SessionError) || error.terminal) throw error;
      warning = error.code;
    }
    const response = NextResponse.json({ ...publicSession(session), ...(warning ? { session_warning: warning } : {}) });
    setSessionCookie(response, id, session);
    return response;
  } catch (error) { return sessionFailure(error); }
}
