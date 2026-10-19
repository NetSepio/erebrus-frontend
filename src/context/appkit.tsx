"use client";

import {
  createAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
} from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { BaseWalletAdapter, SolanaAdapter } from "@reown/appkit-adapter-solana";
import {
  mainnet,
  arbitrum,
  base,
  solana,
  solanaTestnet,
  solanaDevnet,
} from "@reown/appkit/networks";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { defineChain } from "@reown/appkit/networks";
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { logoutWebSession, sessionSnapshot, sessionServerSnapshot, startSessionSync, subscribeSession } from "@/lib/web-session";
import { toast } from "sonner";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import {
  authenticateEvm as gatewayAuthenticateEvm,
  authenticateSolana as gatewayAuthenticateSolana,
  linkWalletEvm,
  linkWalletSolana,
} from "@/lib/gateway-auth";

declare global {
  interface Window {
    phantom?: {
      solana?: {
        signMessage: (
          message: Uint8Array
        ) => Promise<{ signature: Uint8Array }>;
        isPhantom?: boolean;
      };
    };
    solflare?: {
      isSolflare?: boolean;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
    backpack?: {
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    };
  }
}

// Define Peaq network
const peaqNetwork = defineChain({
  id: 3338,
  caipNetworkId: "eip155:333777",
  chainNamespace: "eip155",
  name: "peaq",
  nativeCurrency: {
    decimals: 18,
    name: "peaq",
    symbol: "PEAQ",
  },
  rpcUrls: {
    default: {
      http: ["https://peaq.api.onfinality.io/public"],
      webSocket: ["wss://peaq.api.onfinality.io/public"],
    },
  },
  blockExplorers: {
    default: { name: "peaqScan", url: "https://peaq.subscan.io/" },
  },
});

// Define Monad Testnet
const monadTestnet = defineChain({
  id: 10143,
  caipNetworkId: "eip155:6969",
  chainNamespace: "eip155",
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
      webSocket: ["wss://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet-explorer.monad.xyz",
    },
  },
});

// Define Rise Testnet
const riseTestnet = defineChain({
  id: 11155931,
  caipNetworkId: "eip155:11155931",
  chainNamespace: "eip155",
  name: "RISE Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.riselabs.xyz"],
      webSocket: ["wss://testnet.riselabs.xyz/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Rise Explorer",
      url: "https://testnet.explorer.riselabs.xyz",
    },
  },
});

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Project ID is not defined. Please set NEXT_PUBLIC_PROJECT_ID in your environment variables."
  );
}

const metadata = {
  name: "Erebrus",
  description:
    "Redefining digital connectivity with globally accessible, secure and private network through DePIN.",
  url: "https://erebrus.io/",
  icons: ["https://erebrus.io/favicon.ico"],
};

const wallets: BaseWalletAdapter[] = [
  new PhantomWalletAdapter() as unknown as BaseWalletAdapter,
  new SolflareWalletAdapter() as unknown as BaseWalletAdapter,
];

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets,
});

// Network ID constants
const NETWORK_IDS = {
  SOLANA: Number(solana.id),
  MAINNET: Number(mainnet.id),
  ARBITRUM: Number(arbitrum.id),
  BASE: Number(base.id),
  PEAQ: Number(peaqNetwork.id),
  MONAD: Number(monadTestnet.id),
  RISE: Number(riseTestnet.id),
};

import type { Eip1193Provider } from "ethers";

// Wallet auth hook
export function useWalletAuth() {
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider: evmWalletProvider } =
    useAppKitProvider<Provider>("eip155");
  const { walletProvider: solanaWalletProvider } =
    useAppKitProvider<Provider>("solana");
  const { chainId, caipNetworkId } = useAppKitNetworkCore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  // Guards against a second signMessage if authenticate() is invoked twice
  // before isAuthenticating has propagated (double click / re-render).
  const authInFlight = useRef(false);

  const web = useSyncExternalStore(subscribeSession, sessionSnapshot, sessionServerSnapshot);
  const getCurrentAuthStatus = () => !!web.session?.authenticated;
  useEffect(() => { setAuthSuccess(!!web.session?.authenticated); }, [web.session]);

  // Authentication function
  const authenticate = async () => {
    if (!isConnected || !address) {
      setAuthError("Wallet not connected");
      return false;
    }

    // Reentrancy guard: never open a second wallet signature prompt while one
    // is already pending.
    if (authInFlight.current) return false;
    authInFlight.current = true;

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const isSolanaChain =
        caipNetworkId?.startsWith("solana:") ||
        chainId === NETWORK_IDS.SOLANA ||
        chainId === Number(solanaDevnet.id) ||
        chainId === Number(solanaTestnet.id);

      if (web.session?.authenticated && web.session.wallet_address === address) return true;
      if (isSolanaChain) {
        if (!solanaWalletProvider) throw new Error("Solana wallet provider not available");
        await gatewayAuthenticateSolana(address, solanaWalletProvider);
      } else {
        if (!evmWalletProvider) throw new Error("EVM wallet provider not available");
        await gatewayAuthenticateEvm(address, evmWalletProvider as unknown as Eip1193Provider);
      }
      setAuthSuccess(true);
      toast.success("Authentication successful");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      setAuthError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsAuthenticating(false);
      authInFlight.current = false;
    }
  };

  // Attach the connected wallet to the CURRENT (email / social) account via
  // POST /account/wallet. Unlike authenticate(), this never swaps the session —
  // the signed-in identity stays, the wallet becomes part of it.
  const linkWallet = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      toast.error("Connect a wallet first");
      return false;
    }
    if (!web.session?.authenticated) {
      toast.error("Sign in before linking a wallet");
      return false;
    }
    if (authInFlight.current) return false;
    authInFlight.current = true;
    setIsAuthenticating(true);
    try {
      const isSolanaChain =
        caipNetworkId?.startsWith("solana:") ||
        chainId === NETWORK_IDS.SOLANA ||
        chainId === Number(solanaDevnet.id) ||
        chainId === Number(solanaTestnet.id);
      if (isSolanaChain) {
        if (!solanaWalletProvider) {
          throw new Error("Solana wallet provider not available");
        }
        await linkWalletSolana(address, solanaWalletProvider);
      } else {
        if (!evmWalletProvider) {
          throw new Error("EVM wallet provider not available");
        }
        await linkWalletEvm(address, evmWalletProvider);
      }
      toast.success("Wallet linked to your account");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to link wallet";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsAuthenticating(false);
      authInFlight.current = false;
    }
  };

  // Wallet provider reconnection is independent of the durable login session.
  const authed = getCurrentAuthStatus();
  return {
    isConnected, address, isAuthenticated: authed, isVerified: authed,
    isAuthenticating: isAuthenticating || web.loading,
    authError, authSuccess, authenticate, linkWallet,
    signOut: async () => {
      const result = await logoutWebSession();
      if (!result.confirmed) toast.error(result.localCleared
        ? "Signed out here. Remote session revocation could not be confirmed."
        : "Could not reach the session server. Sign-out is unconfirmed; reconnect and try again.");
      return result;
    },
  };
}

// AppKit provider component
export function AppKit({ children }: { children: React.ReactNode }) {
  useEffect(() => startSessionSync(), []);
  return <>{children}</>;
}

// Initialize AppKit
createAppKit({
  adapters: [new EthersAdapter(), solanaWeb3JsAdapter],
  metadata,
  networks: [mainnet, solana],
  projectId,
  // Skip Reown Cloud remote-feature fetch. The dashboard has "Sign In With X"
  // (SIWX / ReownAuthentication) enabled, which injects a redundant CAIP-122
  // signature prompt on connect — the app already authenticates with its own
  // gateway challenge. `basic` mode prevents that remote feature from loading.
  // It's a valid runtime option (read by AppKit's base client) but omitted from
  // the full `CreateAppKit` type, so the error below is expected.
  // @ts-expect-error -- `basic` is honored at runtime; not in the public type
  basic: true,
  features: {
    analytics: true,
  },
  defaultNetwork: solana,
  themeMode: "dark",
  themeVariables: {
    "--apkt-font-family": "Space Grotesk, sans-serif",
    "--apkt-accent": "#FF6B35",
    // Omit color-mix — blending white into dark tokens (e.g. strength 40) greys out
    // wallet list labels and makes the modal hard to read.
  },
  chainImages: {
    11155931: "/rise.jpg",
    3338: "/peaq.jpg",
    6969: "/monad-logo.png",
  },
});
