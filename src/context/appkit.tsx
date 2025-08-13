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
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { defineChain } from "@reown/appkit/networks";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";
import type { Provider } from "@reown/appkit-adapter-solana/react";

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
console.log("project id", projectId);

if (!projectId) {
  throw new Error(
    "Project ID is not defined. Please set NEXT_PUBLIC_PROJECT_ID in your environment variables."
  );
}

const metadata = {
  name: "Erebrus",
  description:
    "Powering the future of AI interaction through multi-agent collaboration.",
  url: "https://erebrus.io/",
  icons: ["https://cyreneai.com/Cyrene_mobile_logo.webp"],
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

// Helper to get chain type
const getChainType = (chainId: string | number): "solana" | "evm" => {
  const chainIdNum =
    typeof chainId === "string" ? parseInt(chainId, 10) : chainId;
  return chainIdNum === NETWORK_IDS.SOLANA ||
    chainIdNum === Number(solanaDevnet.id) ||
    chainIdNum === Number(solanaTestnet.id)
    ? "solana"
    : "evm";
};

// Helper to get cookie key with chain suffix
const getChainCookieKey = (key: string, chainType: string) => {
  return `${key}_${chainType}`;
};

// Cookie management utilities
const setAuthCookies = (
  chainType: "solana" | "evm",
  token: string,
  walletAddress: string,
  userId: string
) => {
  const options = {
    expires: 7,
    path: "/",
    sameSite: "Strict" as const,
    secure: process.env.NODE_ENV === "production",
  };

  Cookies.set(getChainCookieKey("erebrus_token", chainType), token, options);
  Cookies.set(
    getChainCookieKey("erebrus_wallet", chainType),
    walletAddress.toLowerCase(),
    options
  );
  Cookies.set(getChainCookieKey("erebrus_userid", chainType), userId, options);
};

const clearAuthCookies = (chainType: "solana" | "evm") => {
  const options = { path: "/" };
  Cookies.remove(getChainCookieKey("erebrus_token", chainType), options);
  Cookies.remove(getChainCookieKey("erebrus_wallet", chainType), options);
  Cookies.remove(getChainCookieKey("erebrus_userid", chainType), options);
  Cookies.remove(`erebrus_verified_${chainType}`, options);
};

const getAuthFromCookies = (chainType: "solana" | "evm") => {
  return {
    token: Cookies.get(getChainCookieKey("erebrus_token", chainType)),
    wallet: Cookies.get(getChainCookieKey("erebrus_wallet", chainType)),
    userId: Cookies.get(getChainCookieKey("erebrus_userid", chainType)),
  };
};

// EVM Authentication
const authenticateEVM = async (walletAddress: string, walletProvider: any) => {
  try {
    const GATEWAY_URL = "https://gateway.dev.netsepio.com/";
    const chainName = "evm";

    console.log(
      "🔄 Step 1: Getting FlowId and EULA for EVM wallet:",
      walletAddress
    );

    const { data } = await axios.get(
      `${GATEWAY_URL}api/v1.0/flowid?walletAddress=${walletAddress}&chain=evm`
    );

    console.log("✅ Step 2: FlowId response:", {
      status: data.status,
      message: data.message,
      flowId: data.payload?.flowId,
      eula: data.payload?.eula?.substring(0, 50) + "...",
    });

    const message = data.payload.eula;
    const flowId = data.payload.flowId;

    const combinedMessage = `${message}${flowId}`;

    console.log("🔏 Step 3: Requesting wallet signature for message...");

    const provider = new BrowserProvider(walletProvider);
    if (!walletAddress) {
      throw new Error("Wallet address is undefined");
    }
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    if (signerAddress.toLowerCase() !== walletAddress?.toLowerCase()) {
      throw new Error(
        `Mismatch: Signer address (${signerAddress}) !== Connected address (${walletAddress})`
      );
    }

    let signature = await signer.signMessage(combinedMessage);

    if (signature.startsWith("0x")) {
      signature = signature.slice(2);
    }

    console.log(
      "✅ Step 4: Signature generated:",
      signature.substring(0, 20) + "..."
    );

    console.log("🚀 Step 5: Sending authentication request to backend...");

    const authResponse = await axios.post(
      `${GATEWAY_URL}api/v1.0/authenticate`,
      {
        chainName,
        flowId,
        signature,
        walletAddress,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Step 6: Authentication successful!", {
      status: authResponse.status,
      hasToken: !!authResponse.data.payload?.token,
      hasUserId: !!authResponse.data.payload?.userId,
      hasVerify: !!authResponse.data.payload?.verify,
    });

    const { token, userId, verify } = authResponse.data.payload;
    setAuthCookies("evm", token, walletAddress, userId);

    // Store verification status in cookie for use by other components
    Cookies.set("erebrus_verified_evm", verify ? "true" : "false", {
      expires: 7,
      path: "/",
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, isVerified: verify };
  } catch (error) {
    console.error("❌ EVM Authentication error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    clearAuthCookies("evm");
    return { success: false, isVerified: false };
  }
};

// Solana Authentication with social login support
const authenticateSolana = async (
  walletAddress: string,
  walletProvider: Provider
) => {
  try {
    const GATEWAY_URL = "https://gateway.dev.netsepio.com/";
    const chainName = "sol";

    console.log(
      "🔄 Step 1: Getting FlowId and EULA for Solana wallet:",
      walletAddress
    );

    const { data } = await axios.get(`${GATEWAY_URL}api/v1.0/flowid`, {
      params: {
        walletAddress,
        chain: chainName,
      },
    });

    console.log("✅ Step 2: FlowId response:", {
      status: data.status,
      message: data.message,
      flowId: data.payload?.flowId,
      eula: data.payload?.eula?.substring(0, 50) + "...",
    });

    const message = data.payload.eula;
    const flowId = data.payload.flowId;

    console.log("🔏 Step 3: Requesting wallet signature for message...");

    const encodedMessage = new TextEncoder().encode(message);
    const signature = await walletProvider.signMessage(encodedMessage);

    const signatureHex = Array.from(new Uint8Array(signature))
      .map((b: number) => b.toString(16).padStart(2, "0"))
      .join("");

    console.log(
      "✅ Step 4: Signature generated:",
      signatureHex.substring(0, 20) + "..."
    );

    console.log("🚀 Step 5: Sending authentication request to backend...");

    const authResponse = await axios.post(
      `${GATEWAY_URL}api/v1.0/authenticate?walletAddress=${walletAddress}&chain=sol`,
      {
        flowId,
        signature: signatureHex,
        pubKey: walletAddress,
        walletAddress,
        message,
        chainName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Step 6: Authentication successful!", {
      status: authResponse.status,
      hasToken: !!authResponse.data.payload?.token,
      hasUserId: !!authResponse.data.payload?.userId,
      hasVerify: !!authResponse.data.payload?.verify,
    });

    const { token, userId, verify } = authResponse.data.payload;
    setAuthCookies("solana", token, walletAddress, userId);

    // Store verification status in cookie for use by other components
    Cookies.set("erebrus_verified_solana", verify ? "true" : "false", {
      expires: 7,
      path: "/",
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true, isVerified: verify };
  } catch (error) {
    console.error("❌ Solana Authentication error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    clearAuthCookies("solana");
    return { success: false, isVerified: false };
  }
};

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
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [previousAddress, setPreviousAddress] = useState<string | null>(null);

  // Set global cookies for chain and wallet on connect
  useEffect(() => {
    if (isConnected && address && chainId) {
      // Set global cookies for profile page and others
      let chainSymbol = "";
      if (
        caipNetworkId?.startsWith("solana:") ||
        chainId === NETWORK_IDS.SOLANA
      ) {
        chainSymbol = "sol";
      } else if (chainId === NETWORK_IDS.MAINNET) {
        chainSymbol = "evm";
      } else if (chainId === NETWORK_IDS.ARBITRUM) {
        chainSymbol = "evm";
      } else if (chainId === NETWORK_IDS.BASE) {
        chainSymbol = "evm";
      } else if (chainId === NETWORK_IDS.PEAQ) {
        chainSymbol = "peaq";
      } else if (chainId === NETWORK_IDS.MONAD) {
        chainSymbol = "monad";
      } else if (chainId === NETWORK_IDS.RISE) {
        chainSymbol = "rise";
      }
      Cookies.set("Chain_symbol", chainSymbol, {
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
      Cookies.set("erebrus_wallet", address, {
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
  }, [isConnected, address, chainId, caipNetworkId]);

  // Get current auth status
  const getCurrentAuthStatus = () => {
    if (!isConnected || !address) return false;
    const chainType = caipNetworkId?.startsWith("solana:") ? "solana" : "evm";
    const { token, wallet } = getAuthFromCookies(chainType);
    return !!(token && wallet?.toLowerCase() === address.toLowerCase());
  };

  // Get current verification status
  const getCurrentVerificationStatus = () => {
    if (!isConnected || !address) return false;
    const chainType = caipNetworkId?.startsWith("solana:") ? "solana" : "evm";
    const verifiedCookie = Cookies.get(`erebrus_verified_${chainType}`);
    return verifiedCookie === "true";
  };

  // Authentication function
  const authenticate = async (): Promise<{
    success: boolean;
    isVerified: boolean;
  }> => {
    if (!isConnected || !address) {
      setAuthError("Wallet not connected");
      return { success: false, isVerified: false };
    }

    setIsAuthenticating(true);
    setAuthError(null);
    setAuthSuccess(false);

    try {
      const isSolanaChain =
        caipNetworkId?.startsWith("solana:") ||
        chainId === NETWORK_IDS.SOLANA ||
        chainId === Number(solanaDevnet.id) ||
        chainId === Number(solanaTestnet.id);

      const chainType = isSolanaChain ? "solana" : "evm";
      const { token, wallet } = getAuthFromCookies(chainType);

      if (token && wallet?.toLowerCase() === address.toLowerCase()) {
        setAuthSuccess(true);
        // Get verification status from cookie
        const chainType = isSolanaChain ? "solana" : "evm";
        const verifiedCookie = Cookies.get(`erebrus_verified_${chainType}`);
        const verified = verifiedCookie === "true";
        setIsVerified(verified);
        return { success: true, isVerified: verified };
      }

      if (wallet && wallet.toLowerCase() !== address.toLowerCase()) {
        clearAuthCookies(chainType);
      }

      let authResult: { success: boolean; isVerified: boolean };

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

      if (authResult.success) {
        setAuthSuccess(true);
        setIsVerified(authResult.isVerified);
        toast.success("Authentication successful");
        return { success: true, isVerified: authResult.isVerified };
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      setAuthError(errorMessage);
      toast.error(errorMessage);
      return { success: false, isVerified: false };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Cleanup on disconnection
  useEffect(() => {
    if (!isConnected) {
      ["solana", "evm"].forEach((chainType) => {
        clearAuthCookies(chainType as "solana" | "evm");
        // Also clear verification cookies
        Cookies.remove(`erebrus_verified_${chainType}`, { path: "/" });
      });
      setAuthSuccess(false);
      setIsVerified(null);
      setPreviousAddress(null);
    }
  }, [isConnected]);

  // Detect wallet address changes (wallet switching)
  useEffect(() => {
    if (isConnected && address) {
      if (previousAddress && previousAddress !== address) {
        console.log("🔄 Wallet address changed:", {
          previous: previousAddress,
          current: address,
        });

        // Clear all authentication data when wallet changes
        ["solana", "evm"].forEach((chainType) => {
          clearAuthCookies(chainType as "solana" | "evm");
          Cookies.remove(`erebrus_verified_${chainType}`, { path: "/" });
        });

        // Reset authentication state
        setAuthSuccess(false);
        setIsVerified(null);
        setAuthError(null);

        // Show notification about wallet change
        toast.info("Wallet changed. Please authenticate with the new wallet.");

        // Reload the page to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }

      setPreviousAddress(address);
    }
  }, [isConnected, address, previousAddress]);

  return {
    isConnected,
    address,
    isAuthenticated: getCurrentAuthStatus(),
    isVerified: isVerified ?? getCurrentVerificationStatus(),
    isAuthenticating,
    authError,
    authSuccess,
    authenticate,
  };
}

// AppKit provider component
export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Initialize AppKit
createAppKit({
  adapters: [new EthersAdapter(), solanaWeb3JsAdapter],
  metadata,
  networks: [solana, peaqNetwork, riseTestnet],
  projectId,
  features: {
    analytics: true,
  },
  defaultNetwork: solana,
  themeMode: "dark",
  themeVariables: {
    "--w3m-font-family": "Inter, sans-serif",
    "--w3m-accent": "#3B82F6",
    "--w3m-color-mix": "#3B82F6",
    "--w3m-color-mix-strength": 40,
  },
  chainImages: {
    11155931: "/rise.jpg",
    3338: "/peaq.jpg",
    6969: "/monad-logo.png",
  },
});
