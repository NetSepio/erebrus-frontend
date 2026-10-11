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
import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getAuthFromCookies,
  getCurrentAuthToken,
  getSessionSnapshot,
  getServerSessionSnapshot,
  getStoredSession,
  retrySessionValidation,
  setAuthCookies,
  signOut,
  subscribeSession,
} from "@/lib/auth-session";
export { getCurrentAuthToken, setWebSession, clearWebSession, getWebSession, hasWebSession } from "@/lib/auth-session";
import { toast } from "sonner";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import {
  authenticateEvm as gatewayAuthenticateEvm,
  authenticateSolana as gatewayAuthenticateSolana,
  linkWalletEvm,
  linkWalletSolana,
  authErrorMessage,
} from "@/lib/gateway-auth";
import { isWalletProjectConfigured } from "@/lib/env";

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

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID?.trim();
export const walletConfigured = isWalletProjectConfigured(projectId);
export const walletConfigurationMessage = process.env.NODE_ENV === "development"
  ? "Wallet sign-in is unavailable. Configure a valid NEXT_PUBLIC_PROJECT_ID from Reown and restart the webapp."
  : "Wallet sign-in is currently unavailable. Please use another sign-in method.";

const metadata = {
  name: "Erebrus",
  description:
    "Redefining digital connectivity with globally accessible, secure and private network through DePIN.",
  url: typeof window === "undefined" ? "https://erebrus.io/" : window.location.origin,
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



// EVM Authentication
import type { Eip1193Provider } from "ethers";

const authenticateEVM = async (
  walletAddress: string,
  walletProvider: Eip1193Provider
) => {
  if (!walletAddress || walletAddress.trim() === "") {
    throw new Error("Wallet address is required");
  }

  const isValidEthAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  if (!isValidEthAddress) {
    throw new Error("Invalid Ethereum wallet address format");
  }

  const session = await gatewayAuthenticateEvm(walletAddress, walletProvider);
  setAuthCookies("evm", session.token, walletAddress, session.userId);
  return true;
};

// Solana Authentication with social login support
const authenticateSolana = async (
  walletAddress: string,
  walletProvider: Provider
) => {
  const session = await gatewayAuthenticateSolana(walletAddress, walletProvider);
  setAuthCookies("solana", session.token, walletAddress, session.userId);
  return true;
};

// Wallet auth hook
export function useWalletAuth() {
  const sessionState = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
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

  // Get current auth status from the shared, gateway-validated session rather
  // than the connected wallet. AppKit can be disconnected after a redirect
  // while the existing session remains valid. Wallet connectivity is required
  // only when an operation needs a new signature.
  const getCurrentAuthStatus = useCallback(
    () => sessionState.status === "authenticated",
    [sessionState.status],
  );

  // Update authSuccess state when authentication status changes
  useEffect(() => {
    const isAuth = getCurrentAuthStatus();
    if (isAuth !== authSuccess) {
      setAuthSuccess(isAuth);
    }
    // Clear error when authentication succeeds
    if (isAuth && authError) {
      setAuthError(null);
    }
  }, [isConnected, address, caipNetworkId, authSuccess, authError, getCurrentAuthStatus]);

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

      const chainType = isSolanaChain ? "solana" : "evm";
      const { token, wallet, expired } = getAuthFromCookies(chainType);

      const currentSession = getStoredSession();
      const matchesWallet = isSolanaChain
        ? wallet === address
        : wallet?.toLowerCase() === address.toLowerCase();
      if (currentSession && (currentSession.token !== token || !matchesWallet)) {
        setAuthError("Sign out before signing in with a different account.");
        toast.error("Sign out before signing in with a different account.");
        return false;
      }
      if (token && !expired && matchesWallet && currentSession?.token === token) {
        await retrySessionValidation();
        if (getSessionSnapshot().status === "authenticated") {
          setAuthSuccess(true);
          return true;
        }
        if (getSessionSnapshot().status === "unavailable") return false;
      }

      let authResult = false;

      if (isSolanaChain) {
        if (!solanaWalletProvider) {
          throw new Error("Solana wallet provider not available");
        }
        authResult = await authenticateSolana(address, solanaWalletProvider);
      } else {
        if (!evmWalletProvider) {
          throw new Error("EVM wallet provider not available");
        }
        authResult = await authenticateEVM(address, evmWalletProvider);
      }

      if (authResult) {
        setAuthSuccess(true);
        toast.success("Authentication successful");
        // Force a small delay to ensure state is updated before return
        setTimeout(() => {
          // This will trigger the useEffect above to update states
        }, 100);
        return true;
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      const errorMessage = authErrorMessage(error);
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
    const sessionToken = getCurrentAuthToken();
    if (!sessionToken) {
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
        await linkWalletSolana(sessionToken, address, solanaWalletProvider);
      } else {
        if (!evmWalletProvider) {
          throw new Error("EVM wallet provider not available");
        }
        await linkWalletEvm(sessionToken, address, evmWalletProvider);
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

  // Session cleanup happens on explicit logout or gateway rejection, not wallet disconnection.
  // Reconnection delays after a refresh must never delete a stored session.
  const authed = getCurrentAuthStatus(); // Shared across all routes and hook instances

  // Authenticated via a validated wallet-issued OR non-wallet (email/OIDC) session.
  return {
    isConnected,
    address,
    isAuthenticated: authed,
    isVerified: authed, // Simplified: verified when authenticated
    isAuthenticating,
    authError,
    authSuccess,
    authenticate,
    linkWallet,
    signOut,
    sessionStatus: sessionState.status,
    sessionUserId: sessionState.session?.userId,
    sessionWallet: sessionState.session?.wallet,
    retrySession: retrySessionValidation,
    token: getCurrentAuthToken(), // Provide current valid token
  };
}

// AppKit provider component
export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Initialize AppKit
const appKit = typeof window !== "undefined" && walletConfigured && projectId ? createAppKit({
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
}) : null;

const walletModal = {
  async open(options?: Parameters<ReturnType<typeof createAppKit>["open"]>[0]) {
    if (!appKit) {
      toast.error(walletConfigurationMessage);
      return;
    }
    try {
      await appKit.open(options);
    } catch {
      toast.error("Unable to open the wallet connection. Please try again.");
    }
  },
  async close() {
    await appKit?.close();
  },
};

export function useAppKit() {
  return walletModal;
}
