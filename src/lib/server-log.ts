import { format } from "node:util";

/**
 * Server-side structured logging: one JSON object per line on stdout/stderr
 * with an ISO-8601 `time`, matching the gateway's log format so both
 * containers can be read the same way. Never pass tokens, API keys, cookies,
 * emails or request bodies as fields.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogFields = Record<string, string | number | boolean | null | undefined>;

const SERVICE = "webapp";
const MAX_FIELD = 300;

/** Trim long values and strip control characters so callers cannot forge log lines. */
export function safeLogValue(value: string, max = MAX_FIELD): string {
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, " ");
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

export function formatLogLine(level: LogLevel, msg: string, fields: LogFields = {}, now = new Date()): string {
  const line: Record<string, unknown> = { time: now.toISOString(), level: level.toUpperCase(), service: SERVICE, msg };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) line[key] = value;
  }
  return JSON.stringify(line);
}

/** Write a structured line directly (bypasses the console so it is never double-wrapped). */
export function logEvent(level: LogLevel, msg: string, fields?: LogFields): void {
  const out = level === "error" || level === "warn" ? process.stderr : process.stdout;
  out.write(`${formatLogLine(level, msg, fields)}\n`);
}

/** First client IP from the proxy headers, if any. */
export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headers.get("x-real-ip")?.trim();
  return ip ? safeLogValue(ip, 64) : undefined;
}

let consoleInstalled = false;

/**
 * Route console output (including Next.js's own messages) through the JSON
 * format so every line has a timestamp. Idempotent.
 */
export function installJsonConsole(): void {
  if (consoleInstalled) return;
  consoleInstalled = true;
  const methods: [keyof Console, LogLevel][] = [
    ["log", "info"],
    ["info", "info"],
    ["debug", "debug"],
    ["warn", "warn"],
    ["error", "error"],
  ];
  for (const [method, level] of methods) {
    (console as unknown as Record<string, (...args: unknown[]) => void>)[method] = (...args: unknown[]) =>
      logEvent(level, format(...args));
  }
}
