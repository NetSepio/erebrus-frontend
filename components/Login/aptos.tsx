import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Cookies from "js-cookie";
import axios from "axios";

export const useAptosWallet = () => {
  const { account, connected, network, signMessage } = useWallet();

  const isSendableNetwork = (connected, network) => {
    return connected && network?.toLowerCase() === process.env.NEXT_PUBLIC_NETWORK.toLowerCase();
  };

  const sendableApt = isSendableNetwork(connected, network?.name);

  const getchainsym = () => {
    return Cookies.get("Chain_symbol") ;
  };

  const onSignMessage = async (setshowsignbuttonaptos) => {
    const chainsym = getchainsym();
    if (sendableApt) {
      try {
        const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
        console.log("aptos", REACT_APP_GATEWAY_URL)
        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account?.address}&chain=${chainsym}`
        );

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
        const publicKey = account?.publicKey;

        const payload = {
          message: message,
          nonce: nonce,
        };
        const response = await signMessage(payload);

        let signaturewallet = response.signature;
        if (signaturewallet.length === 128) {
          signaturewallet = `0x${signaturewallet}`;
        }

        const authenticationData = {
          flowId: nonce,
          signature: `${signaturewallet}`,
          pubKey: publicKey,
          chainName : "aptos"
        };

        const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=${chainsym}`;

        const config = {
          url: authenticateApiUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: authenticationData,
        };

        const authResponse = await axios(config);
        const token = authResponse?.data?.payload?.token;
        const userId = authResponse?.data?.payload?.userId;

        Cookies.set("erebrus_token", token, { expires: 7 });
        Cookies.set("erebrus_wallet", account?.address ?? "", { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });
        Cookies.set("Chain_symbol", chainsym, { expires: 7 });

        // window.location.reload();
      } catch (error) {
        console.error(error);
        setshowsignbuttonaptos(true);
      }
    } else {
      alert(`Switch to ${process.env.NEXT_PUBLIC_NETWORK} in your wallet`);
    }
  };

  return { account, connected, network, onSignMessage };
};
