"use client"
import { WagmiProvider } from "wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { metaMask } from "wagmi/connectors";
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';
const chains = [mainnet, polygon, arbitrum, optimism] as const;
const projectId = "193ccae4f2630b59e1e7f10b785e3a0a";

const metadata = {
    name: "Erebrus",
    description:
      "Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.",
    url: "https://netsepio.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
    openGraph: {
      type: "website",
      url: "https://netsepio.com",
      title: "Erebrus",
      description:
        "Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.",
      
    },
  };
  
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Erebrus',
        url: 'https://netsepio.com',
        iconUrl: 'https://netsepio.com/favicon.ico',
      },
    }),
  ],});
import { ReactNode } from "react";

const CustomWagmiProvider = ({ children }: { children: ReactNode }) => {
  return (
   <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}

export default CustomWagmiProvider