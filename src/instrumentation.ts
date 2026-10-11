import type { Instrumentation } from "next";

/**
 * Production server logs are JSON lines with an ISO `time` (same shape as the
 * gateway). Set LOG_FORMAT=text to keep plain console output.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production" || process.env.LOG_FORMAT === "text") return;
  const { installJsonConsole, logEvent } = await import("@/lib/server-log");
  installJsonConsole();
  logEvent("info", "webapp server starting");
}

/** One structured line per server-side error, with the route and request path (no query string). */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { logEvent, safeLogValue } = await import("@/lib/server-log");
  const error = err as { message?: string; digest?: string };
  logEvent("error", "request error", {
    method: request.method,
    path: safeLogValue(request.path.split("?")[0], 200),
    route: context.routePath,
    route_type: context.routeType,
    error: safeLogValue(error.message ?? String(err), 300),
    digest: error.digest,
  });
};
