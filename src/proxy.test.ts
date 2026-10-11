import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { config, proxy } from "./proxy";

describe("server action probe proxy", () => {
  afterEach(() => vi.restoreAllMocks());

  it("answers 404 and logs one timestamped line with ip, path and action", () => {
    const write = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const res = proxy(
      new NextRequest("https://dev.erebrus.io/", {
        method: "POST",
        headers: { "next-action": "r2s", "x-forwarded-for": "203.0.113.9", "user-agent": "scanner/1.0" },
      })
    );
    expect(res.status).toBe(404);
    expect(write).toHaveBeenCalledTimes(1);
    const line = JSON.parse(String(write.mock.calls[0][0]));
    expect(line).toMatchObject({
      level: "WARN",
      msg: "blocked server action request",
      ip: "203.0.113.9",
      method: "POST",
      path: "/",
      action: "r2s",
      user_agent: "scanner/1.0",
    });
    expect(typeof line.time).toBe("string");
  });

  it("only runs for requests that carry the Next-Action header", () => {
    expect(config.matcher).toEqual([{ source: "/:path*", has: [{ type: "header", key: "next-action" }] }]);
  });
});
