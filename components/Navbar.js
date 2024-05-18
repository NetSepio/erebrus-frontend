import Link from "next/link";
import { useState, useEffect, useContext } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import { ConnectButton, useWallet, addressEllipsis } from "@suiet/wallet-kit";
// import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import dynamic from "next/dynamic";

import Button from "../components/Button";
import { useRouter } from "next/router";
import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";

import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { useSui } from "../components/hooks/useSui";
import { useLayoutEffect } from "react";
import { UserKeyData } from "../components/types/UsefulTypes";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { Keypair, PublicKey } from "@mysten/sui.js/cryptography";
import jwt_decode from "jwt-decode";
import { fromB64 } from "@mysten/bcs";
import {
  SerializedSignature,
  decodeSuiPrivateKey,
} from "@mysten/sui.js/cryptography";
import {
  genAddressSeed,
  getZkLoginSignature,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;

const variants = {
  open: { opacity: 1, x: 0, y: 0 },
  closed: { opacity: 0, y: 0 },
};

// const WalletSelectorAntDesign = dynamic(
//   () => import("../components/WalletSelectorAntDesign"),
//   {
//     suspense: false,
//     ssr: false,
//   }
// );

const isSendableNetwork = (connected, network) => {
  return connected && network === mynetwork;
};

const Navbar = ({ isHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [showsignbutton, setshowsignbutton] = useState(true);
  const [link, setlink] = useState("");
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loginoptions, setloginoptions] = useState(false);
  // const sdk = useSDK();

  const [userAddress, setUserAddress] = useState(null);
  const [jwtEncoded, setJwtEncoded] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const [userSalt, setUserSalt] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  const { status, connected, connecting, account, network, name } = useWallet();
  const wallet = useWallet();
  let sendable = isSendableNetwork(status === "connected", wallet.chain.id);

  const router = useRouter();
  // console.log("router", router);

  const address = Cookies.get("erebrus_wallet");
  const token = Cookies.get("erebrus_token");

  useEffect(() => {
    if (account && account.address) {
      // Update the cookie with the new address
      Cookies.set("erebrus_wallet", account.address);
      handleSignMsg();
    }
  }, []);

  // const [, switchNetwork] = useNetwork();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsSignedIn(true);
    }

    let timeoutId = null;

    const getSignMessage = async () => {
      if (!address || address !== sessionStorage.getItem("address")) {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          signOut();
        }, 500);
      } else {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        const response = await axios.get("api/getChallengeId", {
          params: { walletAddress: address },
          headers: {
            "Content-Type": "application/json",
          },
        });

        setMessage(response.data.eula + response.data.challangeId);
        setChallengeId(response.data.challangeId);
      }
    };

    getSignMessage();

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

 
  const signMessage = async () => {
    setIsSignedIn(false);
    console.log("signing message");
    try {
      //make a post request to the erebrus server with the signature and challengeId
      const response = await axios.post(
        "api/getToken",
        {
          signature,
          challengeId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        //store the token in the session storage
        sessionStorage.setItem("token", response.data.token);
        localStorage.setItem("token", response.data.token);
      }
      setIsSignedIn(true);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
          response.data
        )}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error("Error fetching avatar:", error.message);
      }
    };

    fetchData();
  }, []);

  const signOut = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    setMessage("");
    setSignature("");
    setChallengeId("");
    setIsSignedIn(false);
  };

  // const getAptosWallet = () => {
  //   if ("aptos" in window) {
  //     return window.aptos;
  //   } else {
  //     window.open("https://petra.app/", "_blank");
  //   }
  // };

  // console.log(wallet)

  // const onSignMessage = async () => {
  //   if (sendable) {
  //     try {
  //       const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
  //       const { data } = await axios.get(
  //         `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${wallet.address}&chain=sui`
  //       );
  //       // console.log(data);

  //       const message = data.payload.eula;
  //       const nonce = data.payload.flowId;

  //       const payload = {
  //         message: message,
  //         nonce: nonce,
  //       };
  async function handleSignMsg() {
    if(sendable && wallet.account?.publicKey.length !=0){
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
    
      const payload = {
                message: message,
                nonce: nonce,
              };
  

  //   const response = await signMessage(payload);
  //   console.log(response);

  //   let signaturewallet = response.signature;

  // if(signaturewallet.length === 128)
  // {
  //   signaturewallet = `0x${signaturewallet}`;
  // }


  const authenticationData = {
    flowId: nonce,
    signatureSui:result.signature,
   

  };
  console.log("adaddasdasd", result.signature)

  const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate?chain=sui`;
  // const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

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

  const payload = {
            message: message,
            nonce: nonce,
          };


//   const response = await signMessage(payload);
//   console.log(response);

//   let signaturewallet = response.signature;

// if(signaturewallet.length === 128)
// {
//   signaturewallet = `0x${signaturewallet}`;
// }


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
alert(`Switch to Sui Testnet in your wallet`);
}
} 


  

  const handleDeleteCookie = () => {
    Cookies.remove("erebrus_wallet");
    Cookies.remove("erebrus_token");
    window.location.href = "/";
  };

  // --------------------------------------------------- zklogin login button -----------------------------------------------------------------

  const { suiClient } = useSui();

  const [loginUrl, setLoginUrl] = useState();

  async function prepareLogin() {
    const { epoch, epochDurationMs, epochStartTimestampMs } =
      await suiClient.getLatestSuiSystemState();

    const maxEpoch = parseInt(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
    const ephemeralKeyPair = new Ed25519Keypair();
    const ephemeralPrivateKeyB64 = ephemeralKeyPair.getSecretKey();

    const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
    const ephemeralPublicKeyB64 = ephemeralPublicKey.toBase64();

    const jwt_randomness = generateRandomness();
    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwt_randomness);

    console.log("current epoch = " + epoch);
    console.log("maxEpoch = " + maxEpoch);
    console.log("jwt_randomness = " + jwt_randomness);
    console.log("ephemeral public key = " + ephemeralPublicKeyB64);
    console.log("nonce = " + nonce);

    const userKeyData = {
      randomness: jwt_randomness.toString(),
      nonce: nonce,
      ephemeralPublicKey: ephemeralPublicKeyB64,
      ephemeralPrivateKey: ephemeralPrivateKeyB64,
      maxEpoch: maxEpoch,
    };
    localStorage.setItem("userKeyData", JSON.stringify(userKeyData));
    return userKeyData;
  }

  function getRedirectUri() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const customRedirectUri = protocol + "//" + host;
    console.log("customRedirectUri = " + customRedirectUri);
    return customRedirectUri;
  }

  const redirectlogin = () =>{
    
    prepareLogin().then((userKeyData) => {
      const REDIRECT_URI = "https://zklogin-dev-redirect.vercel.app/api/auth";
      const customRedirectUri = getRedirectUri();
      const params = new URLSearchParams({
        // When using the provided test client ID + redirect site, the redirect_uri needs to be provided in the state.
        state: new URLSearchParams({
          redirect_uri: customRedirectUri,
        }).toString(),
        // Test Client ID for devnet / testnet:
        client_id:
          "595966210064-3nnnqvmaelqnqsmq448kv05po362smt2.apps.googleusercontent.com",
        redirect_uri: REDIRECT_URI,
        response_type: "id_token",
        scope: "openid",
        nonce: userKeyData.nonce,
      });

      setLoginUrl(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    });
  }


  // --------------------------------------------------- zklogin login check ------------------------------------------------------------

  async function checkIfAddressHasBalance(address){
    console.log("Checking whether address " + address + " has balance...");
    const coins = await suiClient.getCoins({
      owner: address,
    });
    //loop over coins
    let totalBalance = 0;
    for (const coin of coins.data) {
      totalBalance += parseInt(coin.balance);
    }
    totalBalance = totalBalance / 1000000000; //Converting MIST to SUI
    setUserBalance(totalBalance);
    console.log("total balance = ", totalBalance);
    return enoughBalance(totalBalance);
  }

  function enoughBalance(userBalance) {
    return userBalance > 0.003;
  }

  //** This is just for testing purposes. DO NOT USE IN PRODUCTION */
  function getTestnetAdminSecretKey() {
    return process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
  }

  async function giveSomeTestCoins(address) {
    console.log("Giving some test coins to address " + address);
    const adminPrivateKey = getTestnetAdminSecretKey();
    if (!adminPrivateKey) {
      console.log(
        "Admin Secret Key not found. Please set NEXT_PUBLIC_ADMIN_SECRET_KEY environment variable."
      );
      return;
    }
    let adminPrivateKeyArray = Uint8Array.from(
      Array.from(fromB64(adminPrivateKey))
    );
    // Modified getting private key method using the decodeSuiPrivateKey
    const keyPair = decodeSuiPrivateKey(adminPrivateKey);
    const adminKeypair = Ed25519Keypair.fromSecretKey(keyPair.secretKey);
    const tx = new TransactionBlock();
    const giftCoin = tx.splitCoins(tx.gas, [tx.pure(30000000)]);

    tx.transferObjects([giftCoin], tx.pure(address));

    const res = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: adminKeypair,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });
    const status = res?.effects?.status?.status;
    if (status === "success") {
      console.log("Gift Coin transfer executed! status = ", status);
      checkIfAddressHasBalance(address);
    }
    if (status == "failure") {
      console.log("Gift Coin transfer Failed. Error = " + res?.effects);
    }
  }

  async function loadRequiredData(encodedJwt) {
    //Decoding JWT to get useful Info
    const decodedJwt = (await jwt_decode(
      encodedJwt
    ));

    setSubjectID(decodedJwt.sub);
    //Getting Salt
    // const userSalt = await getSalt(decodedJwt.sub, encodedJwt);
    const response = await axios.post("/api/salt");

    const userSalt = response.data.salt;
    if (!userSalt) {
      console.log("Error getting userSalt");
      return;
    }

    //Generating User Address
    const address = jwtToAddress(encodedJwt, BigInt(userSalt));

    setUserAddress(address);
    setUserSalt(userSalt);
    const hasEnoughBalance = await checkIfAddressHasBalance(address);
    if (!hasEnoughBalance) {
      await giveSomeTestCoins(address);
      toast.success(
        "We' ve fetched some coins for you, so you can get started with Sui !",
        { duration: 8000 }
      );
    }

    console.log("All required data loaded. ZK Address =", address);
  }

  useLayoutEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    let jwt_token_encoded = hash.get("id_token");

    if(jwt_token_encoded)
    {
      localStorage.setItem("id_token", jwt_token_encoded);
    }
    else
    {
      jwt_token_encoded = localStorage.getItem("id_token");
    }

    const userKeyData = JSON.parse(
      localStorage.getItem("userKeyData")
    );

    if (!jwt_token_encoded) {
      // createRuntimeError("Could not retrieve a valid JWT Token!");
      return;
    }

    if (!userKeyData) {
      console.log("user Data is null");
      return;
    }

    setJwtEncoded(jwt_token_encoded);

    loadRequiredData(jwt_token_encoded);
  }, []);

  const logoutzklogin = () => {
    localStorage.removeItem("userKeyData");
    localStorage.removeItem("id_token");
    window.location.href = "/";
  }

  return (
    <nav className='bg-transparent py-4'>
      <div
        className={`container mx-auto px-10 flex items-center justify-between lg:mb-0 ${
          isHome && !isOpen ? "mb-24" : ""
        }`}
      >
        <div className='flex items-center'>
          <Link href='/' scroll={false}>
            <div className='block'>
              <img
                src='/Erebrus_logo_wordmark.png'
                alt='Logo'
                className='w-48'
              />
            </div>
          </Link>
          {/* <Link href="/" scroll={false}>
            <h1 className="text-xl font-bold text-white ml-2">EREBRUS</h1>
          </Link> */}
        </div>
        <div className='hidden lg:flex items-center'>
          {link !== "explorer" ? (
            <Link
              href='/explorer'
              className='text-gray-300 mr-8'
              scroll={false}
              onClick={() => {
                setlink("explorer");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("explorer")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
            >
              Explorer
            </Link>
          ) : (
            <Link
              href='/explorer'
              className='text-gray-300 mr-8'
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Explorer
            </Link>
          )}

          {/* { link !== "mint" ?(
          <Link
            href="/mint"
            className="text-gray-300 mr-8"
            scroll={false}
            onClick={()=> {setlink("mint")}}
            style={{ textDecoration: "none", position: "relative",
            borderBottom: router.pathname.includes('mint') ? '2px solid white' : '', }}
  onMouseOver={(e) => (e.currentTarget.style.borderBottom = "1px solid #fff")}
  onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
          >
            Mint NFT
          </Link>):
          (
<Link
            href="/mint"
            className="text-gray-300 mr-8"
            scroll={false}
            style={{ textDecoration: "none", position: "relative",
            borderBottom:'2px solid white'}}
          >
            Mint NFT
          </Link>
          )} */}

          {link !== "subscription" ? (
            <Link
              href='/subscription'
              className='text-gray-300 mr-8'
              scroll={false}
              onClick={() => {
                setlink("subscription");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("subscription")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
            >
              Subscription
            </Link>
          ) : (
            <Link
              href='/subscription'
              className='text-gray-300 mr-8'
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Subscription
            </Link>
          )}

          <Link
            href='https://docs.netsepio.com/erebrus/'
            target='_blank'
            className='text-gray-300 mr-8'
            onMouseOver={(e) =>
              (e.currentTarget.style.borderBottom = "1px solid #fff")
            }
            onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
          >
            Docs
          </Link>

          {!token && !userAddress && (<button className="text-white" onClick={()=>setloginoptions(true)}>Login</button>)}

{userAddress ? (
            <div className='mr-2'>
              <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 text-white'>
                <div>{userAddress?.slice(0, 3)}...{userAddress?.slice(-3)}</div>
                <div className="flex justify-center">
                  <button
                    type='button'
                    className='rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    onClick={() => {
                      navigator.clipboard.writeText(userAddress);
                    }}
                  >
                    Copy
                  </button>
                </div>
              </dd>
            </div>
          ) : null}
          {userAddress ? (
            <div className='flex gap-4'>
              <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-white'>
                <div className="justify-end flex">{userBalance.toFixed(4)} SUI</div>
                <div>
                  <button
                    type='button'
                    className='rounded-md bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    disabled={!userAddress}
                    onClick={() => giveSomeTestCoins(userAddress)}
                  >
                    Get Testnet Coins
                  </button>
                </div>
              </dd>
              <div className="text-red-500 my-auto" onClick={logoutzklogin}>Logout</div>
            </div>
          ) : null}

{token && (
            <div
              className='lg:mt-0 mt-4 z-50 rounded-xl flex gap-4'
              style={{ color: "#0162FF" }}
            >
              <button
                onClick={handleDeleteCookie}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderBottom = "1px solid #0162FF")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderBottom = "none")
                }
              >
                Log out
              </button>
              {avatarUrl && (
                <img src={avatarUrl} alt='Avatar' className='w-10 ml-auto' />
              )}
            </div>
          )}
        </div>
        <div className='block lg:hidden'>
          <button
            className='flex items-center px-3 py-2 rounded-full text-gray-300'
            onClick={toggleMenu}
          >
            <svg className='w-6 h-6' viewBox='0 0 20 20' fill='currentColor'>
              {isOpen ? (
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      { loginoptions && (

<div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setloginoptions(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* <Image src={emoji} alt="info" className="mx-auto"/> */}

              <div className="p-4 space-y-4">
                <p className="text-3xl text-center font-bold text-green-500">
                Login Options
                </p>
              </div>
              <div className="flex justify-center p-4 pb-10">
              {!token ? (
            <div className='lg:mt-0 mt-4 z-50 rounded-xl text-white'>
              <ConnectButton label='connect' />

              {status === "connected" && showsignbutton && (
                <Button
                  color={"blue"}
                  onClick={handleSignMsg}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
            </div>
          ) : (
            <></>
          )}
                    </div>
                    <div className="flex justify-center p-4 pb-20">
                    <button onClick={redirectlogin} className='bg-white text-gray-700 hover:text-gray-900 font-semibold py-2 px-4 border rounded-lg flex items-center space-x-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  x='0px'
                  y='0px'
                  width='48'
                  height='48'
                  viewBox='0 0 48 48'
                >
                  <path
                    fill='#FFC107'
                    d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                  ></path>
                  <path
                    fill='#FF3D00'
                    d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                  ></path>
                  <path
                    fill='#4CAF50'
                    d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                  ></path>
                  <path
                    fill='#1976D2'
                    d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                  ></path>
                </svg>
                <span>Login with Google</span>
              </button>
              </div>
            </div>
          </div>
        </div>
  )}

      <motion.nav animate={isOpen ? "open" : "closed"} variants={variants}>
        {isOpen && (
          <div className='bg-transparent py-4'>
            <div className='container mx-auto px-6 flex flex-col lg:flex-row items-center lg:justify-between'>
              <div className='flex flex-col lg:flex-row items-center'>
                <Link
                  href='/explorer'
                  className='text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0'
                >
                  Explorer
                </Link>

                <Link
                  href='/subscription'
                  className='text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0'
                >
                  Subscription
                </Link>

                <Link
                  href='https://docs.netsepio.com/erebrus/'
                  target='_blank'
                  className='text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0'
                >
                  Docs
                </Link>

                {account?.address && (
                  <div
                    className='lg:mt-0 mt-4 lg:mr-4 z-50 rounded-xl flex gap-4'
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {account?.address.slice(0, 4)}...{account?.address.slice(-4)}
              </div> */}
                    {address && (
                      <button
                        onClick={handleDeleteCookie}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderBottom =
                            "1px solid #0162FF")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderBottom = "none")
                        }
                      >
                        Log out
                      </button>
                    )}
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt='Avatar'
                        className='w-10 ml-auto'
                      />
                    )}
                  </div>
                )}

                {!address && (
                  <div className='lg:mt-0 mt-4 z-50 rounded-xl text-white'>
                    {!connected && (
                      <button>
                        <ConnectButton label='connect' />
                      </button>
                    )}
                    {connected && (
                      <SingleSignerTransaction
                        isSendableNetwork={isSendableNetwork}
                      />
                    )}
                  </div>
                )}

                {address && (
                  <div
                    className='lg:mt-0 mt-4 lg:mr-20 z-50 rounded-xl flex gap-4'
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {address.slice(0, 4)}...{address.slice(-4)}
              </div> */}
                    <button
                      onClick={handleDeleteCookie}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderBottom =
                          "1px solid #0162FF")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderBottom = "none")
                      }
                    >
                      Log out
                    </button>
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt='Avatar'
                        className='w-10 ml-auto'
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.nav>
    </nav>
  );
};

export default Navbar;
