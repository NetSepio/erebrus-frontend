import { parseTypeTag, AccountAddress, U64 } from "@aptos-labs/ts-sdk";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import Cookies from 'js-cookie';
import { aptosClient } from "../../module";
import { useAlert } from "../AlertProvider";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
import axios from "axios";
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
type SingleSignerTransactionProps = {
  isSendableNetwork: (connected: boolean, network?: string) => boolean;
  chainsymbol: string;
};

export default function SingleSignerTransaction({
  isSendableNetwork,
  chainsymbol
}: SingleSignerTransactionProps) {
  const { setSuccessAlertMessage, setSuccessAlertHash } = useAlert();

  const {
    connected,
    account,
    network,
    signAndSubmitTransaction,
    signMessageAndVerify,
    signMessage,
    signTransaction,
  } = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

  const onSignMessageAndVerify = async () => {
    const payload = {
      message: "Hello from Aptos Wallet Adapter",
      nonce: Math.random().toString(16),
    };
    const response = await signMessageAndVerify(payload);
    setSuccessAlertMessage(
      JSON.stringify({ onSignMessageAndVerify: response })
    );
  };

  const onSignMessage = async () => {

    if(sendable)
    {

      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
    
      const { data } = await axios.get(`${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account?.address}&chain=${chainsymbol}`);
      console.log(data);

      const message = data.payload.eula;
      const nonce = data.payload.flowId;
      const publicKey = account?.publicKey;

    const payload = {
      message: message,
      nonce: nonce,
    };
    const response = await signMessage(payload);
    console.log(response);

    let signaturewallet = response.signature;

      if(signaturewallet.length === 128)
      {
        signaturewallet = `0x${signaturewallet}`;
      }
  
      const authenticationData = {
        "flowId": nonce,
        "signature": `${signaturewallet}`,
        "pubKey": publicKey,
      };

    const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=${chainsymbol}`;

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
          // localStorage?.setItem("platform_token", token);
          Cookies.set("erebrus_token", token, { expires: 7 });
          Cookies.set("erebrus_wallet", account?.address ?? '', { expires: 7 });
          Cookies.set("erebrus_userid", userId, { expires: 7 });

          window.location.reload();

    } catch (error) {
      console.error(error);
    }
  }else
  {
    alert(`Switch to ${mynetwork} in your wallet`)
  }
  };

  const onSignAndSubmitTransaction = async () => {
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [account.address, 1], // 1 is in Octas
      },
    };
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient(network?.name.toLowerCase()).waitForTransaction({
        transactionHash: response.hash,
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  const onSignAndSubmitBCSTransaction = async () => {
    if (!account) return;

    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [parseTypeTag(APTOS_COIN)],
          functionArguments: [AccountAddress.from(account.address), new U64(1)], // 1 is in Octas
        },
      });
      await aptosClient(network?.name.toLowerCase()).waitForTransaction({
        transactionHash: response.hash,
      });
      setSuccessAlertHash(response.hash, network?.name);
    } catch (error) {
      console.error(error);
    }
  };

  // Legacy typescript sdk support
  const onSignTransaction = async () => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [account?.address, 1], // 1 is in Octas
      };
      const response = await signTransaction(payload);
      setSuccessAlertMessage(JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  };

  const onSignTransactionV2 = async () => {
    if (!account) return;

    try {
      const transactionToSign = await aptosClient(
        network?.name.toLowerCase()
      ).transaction.build.simple({
        sender: account.address,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: [APTOS_COIN],
          functionArguments: [account.address, 1], // 1 is in Octas
        },
      });
      const response = await signTransaction(transactionToSign);
      setSuccessAlertMessage(JSON.stringify(response));
    } catch (error) {
      console.error(error);
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