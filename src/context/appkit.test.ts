import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ create: vi.fn(() => ({ open: vi.fn(), close: vi.fn() })), error: vi.fn() }));
vi.mock("@reown/appkit/react", () => ({ createAppKit: mocks.create }));
vi.mock("@reown/appkit/networks", () => ({
  mainnet: { id: 1 }, arbitrum: { id: 42161 }, base: { id: 8453 },
  solana: { id: "mainnet" }, solanaTestnet: { id: "testnet" }, solanaDevnet: { id: "devnet" },
  defineChain: (chain: unknown) => chain,
}));
vi.mock("@reown/appkit-adapter-ethers", () => ({ EthersAdapter: class {} }));
vi.mock("@reown/appkit-adapter-solana", () => ({ SolanaAdapter: class {} }));
vi.mock("@solana/wallet-adapter-phantom", () => ({ PhantomWalletAdapter: class {} }));
vi.mock("@solana/wallet-adapter-solflare", () => ({ SolflareWalletAdapter: class {} }));
vi.mock("@/lib/gateway-auth", () => ({ authErrorMessage: () => "Sign-in failed" }));
vi.mock("sonner", () => ({ toast: { error: mocks.error } }));

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); vi.resetModules(); });

describe("AppKit initialization", () => {
  it("does not initialize the SDK or crash public pages for placeholder configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_PROJECT_ID", "dummy-project-id");
    vi.stubGlobal("window", { location: { origin: "http://localhost:3000" } });
    const { walletConfigured, useAppKit } = await import("./appkit");
    expect(walletConfigured).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
    await useAppKit().open();
    expect(mocks.error).toHaveBeenCalled();
  }, 30_000);

  it("does not initialize the SDK during server rendering", async () => {
    vi.stubEnv("NEXT_PUBLIC_PROJECT_ID", "0123456789abcdef0123456789abcdef");
    vi.stubGlobal("window", undefined);
    await import("./appkit");
    expect(mocks.create).not.toHaveBeenCalled();
  }, 30_000);

  it("initializes once per loaded module with the actual browser origin", async () => {
    vi.stubEnv("NEXT_PUBLIC_PROJECT_ID", "0123456789abcdef0123456789abcdef");
    vi.stubGlobal("window", { location: { origin: "http://localhost:3000" } });
    await import("./appkit");
    await import("./appkit");
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({ metadata: expect.objectContaining({ url: "http://localhost:3000" }) }));
  }, 30_000);
});
