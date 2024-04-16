import Cookies from "js-cookie";

import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
import axios from "axios";
import { 
  ConnectButton, 
  useWallet, 
  addressEllipsis,
} from "@suiet/wallet-kit"
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
type SingleSignerTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
};

export default function SingleSignerTransaction({
  isSendableNetwork,
}: SingleSignerTransactionProps) {
  const { setSuccessAlertMessage, setSuccessAlertHash } = useAlert();
  const {status,  connecting , account , name} = useWallet();
  const wallet = useWallet();
  const network = wallet.chain.id;
  const { connected, signMessage} = useWallet();
  let sendable = isSendableNetwork(connected, network);

  const address = Cookies.get("erebrus_wallet");
  const onSignMessage = async () => {
    if (sendable) {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

      const { data } = await axios.get(
        `${REACT_APP_GATEWAY_URL}api/v1.0/flowid/sol?walletAddress=${address}`
      );
      console.log(data);

      const message = data.payload.eula;
      const nonce = data.payload.flowId;

      // if(signaturewallet.length === 128)
      // {
      //   signaturewallet = `0x${signaturewallet}`;
      // }

      const authenticationData = {
        flowId: nonce,
        walletAddress: address,
      };

      const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

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
        Cookies.set("erebrus_wallet", address ?? "", { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });

        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert(`Switch to ${mynetwork} in your wallet`);
    }
  };

  return (
    <div className="w-full mx-auto rounded-lg">
      {/* <Button
          color={"blue"}
          onClick={onSignAndSubmitTransaction}
          disabled={!sendable}
          message={"Sign and submit transaction"}
        /> */}
      {/* <Button
          color={"blue"}
          onClick={onSignAndSubmitBCSTransaction}
          disabled={!sendable}
          message={"Sign and submit BCS transaction"}
        /> */}
      {/* <Button
          color={"blue"}
          onClick={onSignTransaction}
          disabled={!sendable}
          message={"Sign transaction"}
        /> */}
      {/* <Button
          color={"blue"}
          onClick={onSignTransactionV2}
          disabled={!sendable}
          message={"Sign transaction V2"}
        /> */}

      <Button
        color={"blue"}
        onClick={onSignMessage}
        disabled={false}
        message={"Authenticate"}
      />
      {/* <Button
          color={"blue"}
          onClick={onSignMessageAndVerify}
          disabled={!sendable}
          message={"Sign message and verify"}
        /> */}
    </div>
  );
}