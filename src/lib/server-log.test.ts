import { describe, expect, it } from "vitest";
import { clientIp, formatLogLine, safeLogValue } from "./server-log";

describe("formatLogLine", () => {
  it("writes one JSON object with an ISO timestamp, level, service and fields", () => {
    const line = formatLogLine("warn", "blocked", { ip: "203.0.113.9", skipped: undefined }, new Date("2026-10-06T10:15:21.044Z"));
    expect(JSON.parse(line)).toEqual({
      time: "2026-10-06T10:15:21.044Z",
      level: "WARN",
      service: "webapp",
      msg: "blocked",
      ip: "203.0.113.9",
    });
    expect(line).not.toContain("\n");
  });

  it("keeps multi-line messages (stack traces) on one log line", () => {
    const line = formatLogLine("error", "Error: boom\n    at frame", {});
    expect(line.split("\n")).toHaveLength(1);
    expect(JSON.parse(line).msg).toBe("Error: boom\n    at frame");
  });
});

describe("safeLogValue and clientIp", () => {
  it("strips control characters and truncates", () => {
    expect(safeLogValue("a\nb\rc")).toBe("a b c");
    expect(safeLogValue("x".repeat(10), 4)).toBe("xxxx…");
  });

  it("uses the first forwarded IP, then x-real-ip", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBeUndefined();
  });
});
