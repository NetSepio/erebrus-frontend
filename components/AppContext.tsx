"use client"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"
import { clusterApiUrl } from "@solana/web3.js";
import Home from '../pages/index'
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertProvider, useAlert } from "./AlertProvider";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case "devnet":
        setNetwork(WalletAdapterNetwork.Devnet);
        break;
      case "mainnet":
        setNetwork(WalletAdapterNetwork.Mainnet);
        break;
      case "testnet":
        setNetwork(WalletAdapterNetwork.Testnet);
        break;
      default:
        setNetwork(WalletAdapterNetwork.Devnet);
        break;
    }
  };

  // const ButtonWrapper = dynamic(() =>
  //   import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  //   { ssr: false }
  // );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
          {children}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

