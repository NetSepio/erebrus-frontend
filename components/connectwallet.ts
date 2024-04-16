// walletConnector.js

import axios from 'axios';
import Cookies from 'js-cookie';
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;

const connectWallet = async () => {

    const getPhantomWallet = () => {
    if ("Solana" in window) {
      return (window as any).phantom;
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const wallet = getPhantomWallet();
    try {
      const response = await wallet.connect();

      const account = await wallet.account();
      console.log("account", account);

      // Get the current network after connecting (optional)
      // const networkwallet = await wallet.network();
      // console.log("networkwallet", networkwallet);

      // // Check if the connected network is Mainnet
      // if (networkwallet === mynetwork) {

      const { data } = await axios.get(`${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account.address}`);
      console.log(data);

      const message = data.payload.eula;
      const nonce = data.payload.flowId;
      const publicKey = account.publicKey;

      const { signature, fullMessage } = await wallet.signMessage({
        message,
        nonce,
      });
      console.log("sign", signature, "full message", fullMessage);

      let signaturewallet = signature;

      if(signaturewallet.length === 128)
      {
        signaturewallet = `0x${signaturewallet}`;
      }

      const authenticationData = {
        flowId: nonce,
        signature: `${signaturewallet}`,
        pubKey: publicKey,
      };

      const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate`;

      const config = {
        url: authenticateApiUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: authenticationData,
      };

      try {
        const response = await axios(config);
        console.log("auth data", response.data);
        const token = await response?.data?.payload?.token;
        const userId = await response?.data?.payload?.userId;
        // localStorage.setItem("platform_token", token);
        Cookies.set("erebrus_token", token, { expires: 7 });
        Cookies.set("erebrus_wallet", account.address, { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });

        // setUserWallet(account.address);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    //   }
    // else{
    //   alert(`Switch to ${mynetwork} in your wallet`)
    // }

    } catch (err) {
      console.log(err);
    }
  };
}

export default connectWallet;