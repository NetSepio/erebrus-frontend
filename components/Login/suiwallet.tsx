import { useWallet  } from "@suiet/wallet-kit";
import Cookies from "js-cookie";
import axios from "axios";


export const useSuiWallet = (setshowsignbutton) => {
  const wallet = useWallet();
  const {
    status,
    connected,
    account,
  } = useWallet();
  const mynetwork = process.env.NEXT_PUBLIC_NETWORK_SUI;
  console.log("sui network",mynetwork)

  const isSendableNetwork = (connected, network) => {
    return connected && network === mynetwork;
  };
  const sendable = isSendableNetwork(status === "connected", wallet.chain.id);

  const getwallet = () => {
    return Cookies.get("erebrus_wallet");
  };
const erebrusWallet =getwallet();



  async function handleSignMsg() {
    if(sendable && wallet.account?.publicKey.length !=0 && erebrusWallet==null){
    try {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
      const { data } = await axios.get(
        `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${wallet.address}&chain=sui`
      );
      console.log("address", wallet.address)
      const msg = data.payload.eula + data.payload.flowId;
      const nonce = data.payload.flowId;
      // convert string to Uint8Array 
      const msgBytes = new TextEncoder().encode(msg)

      const result = await wallet.signPersonalMessage({
        message: msgBytes
      })
      console.log("signature",result )
      console.log("publickey", wallet.account?.publicKey)
            // verify signature with publicKey and SignedMessage (params are all included in result)
      const verifyResult = await wallet.verifySignedMessage(result, wallet.account.publicKey)
      if (!verifyResult) {
        console.log('signPersonalMessage succeed, but verify signedMessage failed')
      } else {
        console.log('signPersonalMessage succeed, and verify signedMessage succeed!')
      }
    
     
  



  const authenticationData = {
    flowId: nonce,
    signatureSui:result.signature,
   

  };


  const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=sui`;


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
  Cookies.set("erebrus_wallet", account?.address ?? "", { expires: 7 });
  Cookies.set("erebrus_userid", userId, { expires: 7 });

  window.location.reload();
} catch (error) {
  console.error(error);
  setshowsignbutton(true);
}

}
else if (sendable && wallet.account?.publicKey.length == 0 ){
try {
  const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
  const { data } = await axios.get(
    `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${wallet.address}&chain=sui`
  );
  console.log("address", wallet.address)
  const msg = data.payload.eula + data.payload.flowId;
  const nonce = data.payload.flowId;
  // convert string to Uint8Array 
  const msgBytes = new TextEncoder().encode(msg)

  const result = await wallet.signPersonalMessage({
    message: msgBytes
  })
  const byteArray = Uint8Array.from(atob(result.signature), c => c.charCodeAt(0));
  console.log("signature array",byteArray)
  console.log("signature",result )
  console.log("publickey", wallet.account?.publicKey)
        // verify signature with publicKey and SignedMessage (params are all included in result)
  const verifyResult = await wallet.verifySignedMessage(result, wallet.account.publicKey)
  if (!verifyResult) {
    console.log('signPersonalMessage succeed, but verify signedMessage failed')
  } else {
    console.log('signPersonalMessage succeed, and verify signedMessage succeed!')
  }
  


const authenticationData = {
flowId: nonce,
"walletAddress":wallet.address, 


};

console.log("adaddasdasd", result.signature)


// const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=sui`;
const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

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
Cookies.set("erebrus_wallet", account?.address ?? "", { expires: 7 });
Cookies.set("erebrus_userid", userId, { expires: 7 });

window.location.reload();
} catch (error) {
console.error(error);
setshowsignbutton(true);
}

}
else {
alert(`Switch to ${mynetwork} in your wallet`);
}
} 

  return {connected, account, handleSignMsg };
};

