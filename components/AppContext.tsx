"use client"
// import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";
// import { FaceWallet } from "@haechi-labs/face-aptos-adapter-plugin";
// import { FlipperWallet } from "@flipperplatform/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
// import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import {
  AptosWalletAdapterProvider,
  NetworkName,
} from "@aptos-labs/wallet-adapter-react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
// import face from "../lib/faceInitialization";
import { AlertProvider, useAlert } from "./AlertProvider";
import {WalletProvider as SuiWalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import "@solana/wallet-adapter-react-ui/styles.css"
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { setErrorAlertMessage } = useAlert();


  const wallets = [
      // TODO IdentityConnectWallet and BloctoWallet to use Network enum from @aptos-labs/ts-sdk
      // new IdentityConnectWallet("57fa42a9-29c6-4f1e-939c-4eefa36d9ff5", {
      //   networkName: NetworkName.Testnet,
      // }),
      // Blocto supports Testnet/Mainnet for now.
      // new BloctoWallet({
      //   network: NetworkName.Testnet,
      //   bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
      // }),
      // new FaceWallet(face!),
      // new FewchaWallet(),
      // new FlipperWallet(),
    new MartianWallet(),
    // new MSafeWalletAdapter(),
    // new NightlyWallet(),
    // new OpenBlockWallet(),
    new PetraWallet(),
    // new PontemWallet(),
    // new RiseWallet(),
    // new TokenPocketWallet(),
    // new TrustWallet(),
    // new WelldoneWallet(),
    // new OKXWallet(),
    // new OnekeyWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={autoConnect}
      onError={(error) => {
        console.log("Custom error handling", error);
        setErrorAlertMessage(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter({ appIdentity: { name: "Erebrus" }, chains: ["solana"] })
  ], []);
  return (
    <AutoConnectProvider>
      <AlertProvider>
        <WalletContextProvider><SuiWalletProvider>
        <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} >
        <WalletModalProvider>
          {children}
          </WalletModalProvider>
      </SolanaWalletProvider>
     </ConnectionProvider>
          </SuiWalletProvider></WalletContextProvider>
      </AlertProvider>
    </AutoConnectProvider>
  );
};