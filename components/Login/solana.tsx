import { useWallet as solUseWallet } from "@solana/wallet-adapter-react";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const useSolWallet = (setshowsignbutton) => {
  const { connected: solconnected, publicKey } = solUseWallet();
  const [sendableSol, setSendableSol] = useState(false);
  const mynetwork = process.env.NEXT_PUBLIC_NETWORK_SOL;
  const network = WalletAdapterNetwork.Devnet;
  console.log("laksdojaosiuoadhuijaghsdyhagsyhdgashdg", mynetwork)
  const solPublicKey=publicKey;


  useEffect(() => {
    if (typeof window !== "undefined") {
      setSendableSol(isSendableNetwork(solconnected, process.env.NEXT_PUBLIC_NETWORK_SOL));
    }
  }, [solconnected]);
  

  const getchainsym = () => {
    return Cookies.get("Chain_symbol") ;
  };

  const isSendableNetwork = (connected, network) => {
    return connected && network;
  };

  let sendable = isSendableNetwork(solconnected, network);
 

  // const address = Cookies.get("erebrus_wallet");

  const getPhantomWallet = () => {
    if ('phantom' in window) {
      const provider = (window as any).phantom?.solana;
  
      if (provider?.isPhantom) {
        return provider;
      }
    } else {
      window.open('https://phantom.app/', '_blank');
    }
  };

  

  const OnSignMessageSol = async () => {
    if (sendable) {
      try {
        const checktoken = Cookies.get("erebrus_token");
        const checkwallet = Cookies.get("erebrus_wallet");
        const checkuserId = Cookies.get("erebrus_userid");
  
        if (checktoken && checkwallet && checkuserId) {
          // All cookies are set, no need to sign message
          console.log("User already authenticated");
          return;
        }
        const wallet = getPhantomWallet();
        const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${publicKey}&chain=sol`
        );
        console.log(data);

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
   

      

        const encodedMessage = new TextEncoder().encode(message);
        const response = await wallet.signMessage(encodedMessage, "utf8");
      
        let signaturewallet = response.signature;

        const signatureHex = Array.from(Array.from(signaturewallet)).map(byte => ('0' + byte.toString()).slice(-2)).join('');


        const authenticationData = {
          flowId: nonce,
          signature: `${signatureHex}`,
          pubKey: publicKey,
          walletAddress: publicKey,
          message: message,
        };

        const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?walletAddress=${publicKey}&chain=sol`;

        const config = {
          url: authenticateApiUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: authenticationData,
        };

        const authResponse = await axios(config);
        console.log("auth data", authResponse.data);

        const token = await authResponse?.data?.payload?.token;
        const userId = await authResponse?.data?.payload?.userId;

        Cookies.set("erebrus_token", token, { expires: 7 });
        Cookies.set("erebrus_wallet", publicKey, { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });

        window.location.reload();
      } catch (error) {
        console.error(error);
        setshowsignbutton(true);
      }
    } else {
      alert(`Switch to ${mynetwork} in your wallet`);
    }
  };
  
  return { solconnected,solPublicKey, OnSignMessageSol };
};