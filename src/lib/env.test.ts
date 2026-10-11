import { describe, expect, it } from "vitest";
import { isWalletProjectConfigured } from "./env";

describe("wallet project configuration", () => {
  it.each([undefined, "", "  ", "dummy-project-id", "your-project-id", "xxx"])("rejects missing or placeholder project IDs: %s", (id) => {
    expect(isWalletProjectConfigured(id)).toBe(false);
  });

  it("accepts a trimmed Reown project ID", () => {
    expect(isWalletProjectConfigured(" 0123456789abcdef0123456789abcdef ")).toBe(true);
  });
});
