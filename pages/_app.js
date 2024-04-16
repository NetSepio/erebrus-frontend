
import "../styles/globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../AuthContext";
import { AppContext } from "../components/AppContext";
import Cookies from 'js-cookie';
import { useState } from "react";


const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }) {

  const [copied, setCopied] = useState(false);
  const paseto = Cookies.get("erebrus_token");

  return (
    <AppContext>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <AuthProvider>
        <div className="bg-black">
          <Navbar />
          <Component {...pageProps} />
          { paseto && (<div className="flex gap-2 justify-end">
          {copied && <p className="text-white pt-6">Paseto Copied!</p>}
          <button className="rounded-full px-10 py-2 mb-4 mr-4 mt-4 text-white" style={{backgroundColor:'#0162FF'}}
          onClick={() => {
            navigator.clipboard.writeText(
              paseto ? paseto : ''
            );
            setCopied(true);
          }}
          >Copy Paseto
          </button>
          </div>)}
        </div>
        {/* <Footer /> */}
      </AuthProvider>
    </ThirdwebProvider>
    </AppContext>
  );
}
