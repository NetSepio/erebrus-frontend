"use client";

// Extend the Window interface to include the phantom property
declare global {
  interface Window {
    phantom?: {
      solana?: {
        signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
      };
    };
  }
}

import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
  type Provider,
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
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BrowserProvider, toUtf8Bytes } from "ethers";

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

// Define Monad network
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

// 1. Get projectId from https://cloud.reown.com
export const projectId = "193ccae4f2630b59e1e7f10b785e3a0a";

if (!projectId) {
  throw new Error(
    "Project ID is not defined. Please set NEXT_PUBLIC_PROJECT_ID in your environment variables."
  );
}

// 2. Create a metadata object
const metadata = {
  name: "Erebrus",
  description:
    "Powering the future of AI interaction through multi-agent collaboration with self-replicating, decentralized agents. Launch agents, engage with Cyrene, and unlock new frontiers in AI, technology, and consciousness.",
  url: "https://erebrus.io/",
  icons: ["https://cyreneai.com/CyreneAI_logo-text.png"],
};

// 3. Set up Solana Adapter
const wallets: BaseWalletAdapter[] = [
  new PhantomWalletAdapter() as unknown as BaseWalletAdapter,
  new SolflareWalletAdapter() as unknown as BaseWalletAdapter,
];

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets,
});

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
// Modified authenticateUser function to match the backend's message signing approach
const authenticateUser = async (walletAddress: string, walletProvider: any) => {
  try {
    const GATEWAY_URL = "https://gateway.netsepio.com/";
    const chainName = "evm";

    const { data } = await axios.get(
      `${GATEWAY_URL}api/v1.0/flowid?walletAddress=${walletAddress}&chain=evm`
    );

    const message = data.payload.eula;
    const flowId = data.payload.flowId;

    console.log("EVM Message:", message);
    console.log("EVM Flow ID:", flowId);

    // IMPORTANT CHANGE: Combine message and flowId like the backend does
    const combinedMessage = `${message}${flowId}`;
    console.log("Combined Message:", combinedMessage);

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

    // Sign the COMBINED message (message + flowId)
    let signature = await signer.signMessage(combinedMessage);

    // Remove "0x" prefix if present
    if (signature.startsWith("0x")) {
      signature = signature.slice(2);
    }

    // Post to auth endpoint - match the backend format exactly
    const authResponse = await axios.post(
      `${GATEWAY_URL}api/v1.0/authenticate`, // Remove chain query param to match backend
      {
        chainName,
        flowId,
        signature,
        // walletAddress field included to match backend expectation
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { token, userId } = authResponse.data.payload;

    Cookies.set("erebrus_token", token, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });
    Cookies.set("erebrus_wallet", walletAddress, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });
    Cookies.set("erebrus_userid", userId, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });

    console.log("EVM Cookies set:", {
      token: Cookies.get("erebrus_token"),
      wallet: Cookies.get("erebrus_wallet"),
      userId: Cookies.get("erebrus_userid"),
    });

    return true;
  } catch (error) {
    console.error("EVM Authentication error:", error);
    Cookies.remove("erebrus_token", { path: "/" });
    Cookies.remove("erebrus_wallet", { path: "/" });
    Cookies.remove("erebrus_userid", { path: "/" });
    return false;
  }
};

// Solana Authentication


const authenticateUserSolana = async (walletAddress: string) => {
  try {
    const GATEWAY_URL = "https://gateway.netsepio.com/";
    const chainName = "sol";

    const { data } = await axios.get(`${GATEWAY_URL}api/v1.0/flowid`, {
      params: {
        walletAddress,
        chain: chainName,
      },
    });

    const message = data.payload.eula;
    const flowId = data.payload.flowId;

    console.log("Solana Message:", message);
    console.log("Solana Flow ID:", flowId);

    const wallet = window.phantom?.solana;
    if (!wallet) throw new Error("Phantom wallet not found");

    const encodedMessage = new TextEncoder().encode(message);
    const { signature: sigBytes } = await wallet.signMessage(encodedMessage);

    const signatureHex = Array.from(sigBytes)
      .map((b) => (b as number).toString(16).padStart(2, "0"))
      .join("");

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

    const { token, userId } = authResponse.data.payload;

    Cookies.set("erebrus_token", token, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });
    Cookies.set("erebrus_wallet", walletAddress, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });
    Cookies.set("erebrus_userid", userId, {
      expires: 7,
      path: "/",
      sameSite: "Strict",
    });

    console.log("Solana Cookies set:", {
      token: Cookies.get("erebrus_token"),
      wallet: Cookies.get("erebrus_wallet"),
      userId: Cookies.get("erebrus_userid"),
    });

    return true;
  } catch (error) {
    console.error("Solana Authentication error:", error);
    Cookies.remove("erebrus_token", { path: "/" });
    Cookies.remove("erebrus_wallet", { path: "/" });
    Cookies.remove("erebrus_userid", { path: "/" });
    return false;
  }
};

// Wallet auth hook
function useWalletAuth() {
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const { chainId, caipNetworkId } = useAppKitNetworkCore();
  const chainNamespace = caipNetworkId?.split(":")[0]; // Derive chainNamespace from caipNetworkId

  useEffect(() => {
    // Log wallet, network, and cookie state for debugging
    console.log("Wallet State:", { isConnected, address, walletProvider });
    console.log("Network State:", { chainId, caipNetworkId, chainNamespace });
    console.log("Cookies:", {
      token: Cookies.get("erebrus_token"),
      wallet: Cookies.get("erebrus_wallet"),
      userId: Cookies.get("erebrus_userid"),
    });

    const token = Cookies.get("erebrus_token");
    const savedWallet = Cookies.get("erebrus_wallet");

    // Skip authentication if token exists and wallet matches
    if (token ) {
      console.log("Cookies found, skipping authentication");
      return;
    }

    // Authenticate based on network
    if (isConnected && address) {
      console.log("No valid cookies, initiating authentication...");
      // Check for Solana using chainNamespace or chainId
      const isSolana = chainNamespace === "solana" || chainId === NETWORK_IDS.SOLANA;
      console.log("Is Solana Network:", isSolana);
      const authFunction = isSolana ? authenticateUserSolana : authenticateUser;

      authFunction(address, isSolana ? null : walletProvider).then((success) => {
        if (success) {
          console.log(`${isSolana ? "Solana" : "EVM"} Authentication successful`);
        } else {
          console.log(`${isSolana ? "Solana" : "EVM"} Authentication failed`);
        }
      });
    }

    // Clear cookies if wallet is disconnected
    if (!isConnected) {
      console.log("Wallet disconnected, clearing cookies");
      Cookies.remove("erebrus_token", { path: "/" });
      Cookies.remove("erebrus_wallet", { path: "/" });
      Cookies.remove("erebrus_userid", { path: "/" });
      
    }
  }, [isConnected, address, walletProvider, chainId, caipNetworkId, chainNamespace]);
}

// 4. Create the AppKit instance with both Ethereum and Solana adapters
createAppKit({
  adapters: [new EthersAdapter(), solanaWeb3JsAdapter],
  metadata,
  networks: [
    solana,
    mainnet,
    arbitrum,
    base,
    peaqNetwork,
    monadTestnet,
    riseTestnet,
    solanaTestnet,
    solanaDevnet,
  ],
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

export function AppKit({ children }: { children: React.ReactNode }) {
  useWalletAuth();
  return <>{children}</>;
}