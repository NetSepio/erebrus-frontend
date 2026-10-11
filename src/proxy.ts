import { NextResponse, type NextRequest } from "next/server";
import { clientIp, logEvent, safeLogValue } from "@/lib/server-log";

/**
 * This app defines no Server Actions, so any request carrying a `Next-Action`
 * header is a stale client or an automated scanner. Answer 404 before Next.js
 * tries to resolve the action (which logs a multi-line "Failed to find Server
 * Action" error per request) and write one short structured line instead.
 */
export function proxy(request: NextRequest) {
  logEvent("warn", "blocked server action request", {
    ip: clientIp(request.headers),
    method: request.method,
    path: safeLogValue(request.nextUrl.pathname, 200),
    action: safeLogValue(request.headers.get("next-action") ?? "", 80),
    user_agent: safeLogValue(request.headers.get("user-agent") ?? "", 160),
  });
  return new NextResponse(null, { status: 404 });
}

export const config = {
  // Only requests that carry the header ever reach this proxy.
  matcher: [{ source: "/:path*", has: [{ type: "header", key: "next-action" }] }],
};
