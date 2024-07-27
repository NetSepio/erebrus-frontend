import "../styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../AuthContext";
import { AppContext } from "../components/AppContext";
import Cookies from "js-cookie";
import { useState } from "react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {MantaPacific} from "../components/manta.ts"
import {Peaq} from "../components/peaq.ts"
import '../styles/globals.css';
import Banner from "../components/Banner.tsx" 
import Link from 'next/link';



const activeChainId = ChainId.Mumbai;
const erebrus_wallet = Cookies.get("erebrus_wallet");
const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "Erebrus",
  description: "Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.",
  url: "https://netsepio.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  openGraph: {
		type: 'website',
		url: 'https://netsepio.com',
		title: 'Erebrus',
		description: 'Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.',
		images: [
			{
				url: '/metaimg.png',
				width: 1200,
				height: 630,
				alt: 'Erebrus',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@Erebrus',
		title: 'Erebrus',
		description: 'Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.',
		images: [
			{
				url: '/metaimg.png',
				width: 1200,
				height: 630,
				alt: 'Erebrus',
			},
		],
	},
};


const chains = [MantaPacific,Peaq];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

export default function App({ Component, pageProps }) {
  const [copied, setCopied] = useState(false);
  const paseto = Cookies.get("erebrus_token");

  return (
   
    <AppContext>
      <ThirdwebProvider desiredChainId={chains}>
        <AuthProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              
              <div className=" bg-black">
                
              {!erebrus_wallet && (
        <div className="w-full ">
          <Link className='w-full' href='https://drive.google.com/file/d/1jdkqwIXY825iG3shRRoFyg5SMGy6LN8J/view?usp=drive_link' target="_blank">
            <Banner />
          </Link>
        </div>
      )}
                <Navbar />
                <Component {...pageProps} />
              
              </div>
              {/* <Footer /> */}
            </QueryClientProvider>
          </WagmiProvider>
        </AuthProvider>
        </ThirdwebProvider>
    </AppContext>
  );
}


