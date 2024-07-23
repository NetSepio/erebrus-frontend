import { useAccount, useSignMessage } from "wagmi";

import Cookies from "js-cookie";
import axios from "axios";
import { AxiosResponse } from "axios";

export const usePeaqWallet = () => {
  const { address:peaqAddress, isConnected, chain } = useAccount();
  const { signMessage: peaqSignMessage } = useSignMessage();

  const getchainsym = () => {
    return Cookies.get("Chain_symbol");
  };
  
  const getwallet = () => {
    return Cookies.get("erebrus_wallet");
  };
 

  const onSignMessagepeaq = async (setshowsignbuttonpeaq) => {
    const chainsym = getchainsym();
    const erebrusWallet =getwallet();

    if (isConnected) {
      if (chainsym == "peaq" && chain?.name == "agung" && erebrusWallet==null  ) {
        try {
          const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

          const { data } = await axios.get(
            `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${peaqAddress}&chain=evm`
          );

          const message = data.payload.eula;
          const nonce = data.payload.flowId;

          const payload = message + nonce;

          await peaqSignMessage(
            { account: peaqAddress,
               message: payload},
            {
              onSuccess: async (data) =>{
                // setSignature(data);
                const authenticationData = {
                  flowId: nonce,
                  signature: data,
                };

                const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=evm`;

                const config = {
                  url: authenticateApiUrl,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: authenticationData,
                };

                // const authResponse = axios(config);
                const authResponse: AxiosResponse<{ payload: { token: string; userId: string } }> =  await axios.post(authenticateApiUrl, authenticationData);
                const token = authResponse?.data?.payload?.token;
                const userId = authResponse?.data?.payload?.userId;

                Cookies.set("erebrus_token", token, { expires: 7 });
                Cookies.set("erebrus_wallet", peaqAddress, {
                  expires: 7,
                });
                Cookies.set("erebrus_userid", userId, { expires: 7 });
                Cookies.set("Chain_symbol", chainsym, { expires: 7 });
                window.location.reload();
              },
              
              
            },
            
          );

        } catch (error) {
          console.error(error);
          setshowsignbuttonpeaq(true);
        }
      } 
      
    }
    else {
      alert(`Switch to ${chain?.name} in your wallet`);
    }
  };
 
  return { peaqAddress, isConnected, onSignMessagepeaq , };
};
