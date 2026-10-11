import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth-session", () => ({ getCurrentAuthToken: vi.fn(() => "local-test-session"), invalidateSession: vi.fn() }));

import { getCurrentAuthToken, invalidateSession } from "@/lib/auth-session";

import { fetchOperatorNodes, fetchOrgBilling, GatewayApiError, startOrgBillingCheckout } from "./client";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentAuthToken).mockReturnValue("local-test-session");
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe("gateway error recovery", () => {
  it("invalidates only the token sent by a request that returns 401", async () => {
    let respond!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(() => new Promise((resolve) => { respond = resolve; }));
    const request = fetchOrgBilling("org").catch((error: unknown) => error);
    vi.mocked(getCurrentAuthToken).mockReturnValue("new-session");
    respond(new Response("unauthorized", { status: 401 }));
    expect(await request).toMatchObject({ status: 401 });
    expect(invalidateSession).toHaveBeenCalledWith("local-test-session");
  });

  it.each([403, 429, 500, 502, 504])("does not invalidate a session for HTTP %s", async (status) => {
    vi.mocked(fetch).mockResolvedValue(new Response("error", { status }));
    await expect(fetchOrgBilling("org")).rejects.toMatchObject({ status });
    expect(invalidateSession).not.toHaveBeenCalled();
  });

  it("does not invalidate a session on a network timeout", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"));
    await expect(fetchOrgBilling("org")).rejects.toThrow("fetch failed");
    expect(invalidateSession).not.toHaveBeenCalled();
  });

  it("preserves HTTP status when an upstream returns HTML instead of JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("<html>Not found</html>", { status: 404 }));
    const error = await fetchOrgBilling("org").catch((value: unknown) => value);
    expect(error).toBeInstanceOf(GatewayApiError);
    expect(error).toMatchObject({ status: 404, message: "Gateway request failed (404)" });
  });

  it("passes the cancellation signal for billing status reads", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("{}"));
    const controller = new AbortController();
    await fetchOrgBilling("org", controller.signal);
    expect(vi.mocked(fetch).mock.calls[0][1]?.signal).toBe(controller.signal);
  });
});

describe("gateway contracts", () => {
  it("retains the operator node IDs, peer counts, load, and organization", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify([{
      node_id: "node-1", region: "IN", status: "online", load_pct: 23,
      wg_peers_registered: 8, wg_peers_connected: 3, wallet_address: "wallet",
      org: { id: "org-1", name: "Workspace" },
    }])));
    expect((await fetchOperatorNodes())[0]).toMatchObject({
      id: "node-1", node_id: "node-1", load_pct: 23, wg_peers_registered: 8,
      wg_peers_connected: 3, wallet_address: "wallet", org: { id: "org-1", name: "Workspace" },
    });
  });

  it("sends one checkout request with the caller's idempotency key", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ status: "creating" })));
    const body = { plan_id: "personal.pro", billing_interval: "yearly" as const, idempotency_key: "same-attempt-key" };
    await startOrgBillingCheckout("org", body);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ method: "POST", body: JSON.stringify(body) });
  });
});
