import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionSnapshot } from "@/lib/auth-session";

const state = vi.hoisted(() => ({
  account: { isConnected: false, address: undefined as string | undefined },
  snapshot: { status: "authenticated", session: { token: "test-token", userId: "user-1", expiresAt: 9999999999999 } } as SessionSnapshot,
}));

vi.mock("@reown/appkit/react", () => ({
  createAppKit: vi.fn(),
  useAppKitAccount: () => state.account,
  useAppKitProvider: () => ({ walletProvider: undefined }),
  useAppKitNetworkCore: () => ({ chainId: undefined, caipNetworkId: undefined }),
}));
vi.mock("@reown/appkit-adapter-ethers", () => ({ EthersAdapter: class {} }));
vi.mock("@reown/appkit-adapter-solana", () => ({ SolanaAdapter: class {} }));
vi.mock("@solana/wallet-adapter-phantom", () => ({ PhantomWalletAdapter: class {} }));
vi.mock("@solana/wallet-adapter-solflare", () => ({ SolflareWalletAdapter: class {} }));
vi.mock("@reown/appkit/networks", () => ({
  defineChain: (value: unknown) => value,
  mainnet: { id: 1 }, arbitrum: { id: 42161 }, base: { id: 8453 },
  solana: { id: 1 }, solanaTestnet: { id: 2 }, solanaDevnet: { id: 3 },
}));
vi.mock("@/lib/gateway-auth", () => ({
  authenticateEvm: vi.fn(), authenticateSolana: vi.fn(),
  linkWalletEvm: vi.fn(), linkWalletSolana: vi.fn(), authErrorMessage: vi.fn(),
}));
vi.mock("@/lib/auth-session", () => ({
  subscribeSession: vi.fn(),
  getSessionSnapshot: () => state.snapshot,
  getServerSessionSnapshot: () => state.snapshot,
  getCurrentAuthToken: () => state.snapshot.session?.token ?? null,
  getStoredSession: () => state.snapshot.session,
  getAuthFromCookies: vi.fn(), retrySessionValidation: vi.fn(), setAuthCookies: vi.fn(),
  signOut: vi.fn(), setWebSession: vi.fn(), clearWebSession: vi.fn(), getWebSession: vi.fn(), hasWebSession: vi.fn(),
}));

import { useWalletAuth } from "./appkit";

function AuthStatus() {
  const { isAuthenticated, sessionStatus, sessionUserId } = useWalletAuth();
  return <span>{`${isAuthenticated}:${sessionStatus}:${sessionUserId ?? "none"}`}</span>;
}

beforeEach(() => {
  state.account = { isConnected: false, address: undefined };
  state.snapshot = { status: "authenticated", session: { token: "test-token", userId: "user-1", expiresAt: 9999999999999 } };
});

describe("wallet-independent authentication", () => {
  it("recognizes the validated session before AppKit restores a wallet", () => {
    expect(renderToStaticMarkup(<AuthStatus />)).toContain("true:authenticated:user-1");
  });

  it("does not change the signed-in identity when another wallet connects", () => {
    state.account = { isConnected: true, address: "different-wallet" };
    expect(renderToStaticMarkup(<AuthStatus />)).toContain("true:authenticated:user-1");
  });

  it("does not treat a connected wallet as a signed-in session", () => {
    state.account = { isConnected: true, address: "wallet" };
    state.snapshot = { status: "signed-out", session: null };
    expect(renderToStaticMarkup(<AuthStatus />)).toContain("false:signed-out:none");
  });

  it.each(["checking", "unavailable"] as const)("does not admit an unverified session in state %s", (status) => {
    state.snapshot = { ...state.snapshot, status };
    expect(renderToStaticMarkup(<AuthStatus />)).toContain(`false:${status}:user-1`);
  });
});
