import Link from "next/link";
import { useState, useEffect, useContext } from "react";

import axios from "axios";

import Head from "next/head";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { AuthContext } from "../AuthContext";
import dynamic from "next/dynamic";

// import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
import GetStripe from "../utils/stripe.js";
import { loadStripe } from "@stripe/stripe-js";
import { redirect } from "next/dist/server/api-utils/index.js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm.tsx";
import { aptosClient } from "../module";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
import jwt_decode from "jwt-decode";
import {
  SerializedSignature,
  decodeSuiPrivateKey,
} from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import {
  genAddressSeed,
  getZkLoginSignature,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";
import { useSui } from "../components/hooks/useSui";
import {useWallet} from '@suiet/wallet-kit';
// import {TransactionBlock } from "@mysten/sui.js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
const envmintfucn = process.env.NEXT_PUBLIC_MINTFUNCTION;
const envcollectionid = process.env.NEXT_PUBLIC_COLLECTIONID;
const graphqlaptos = process.env.NEXT_PUBLIC_GRAPHQL_APTOS;

const transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};


const WalletSelectorAntDesign = dynamic(
  () => import("../components/WalletSelectorAntDesign"),
  {
    suspense: false,
    ssr: false,
  }
);

const isSendableNetwork = (connected, network) => {
  return connected && network?.toLowerCase() === mynetwork.toLowerCase();
};

const Mint = () => {

  const [isLoadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState(null);
  const isSignedIn = Cookies.get("erebrus_wallet");
  const isauthenticate = Cookies.get("erebrus_token");
  const [address, setAddress] = useState("");
  const [token, settoken] = useState("");
 
  const [userid, setuserid] = useState("");
  const [buttonblur, setbuttonblur] = useState(false);
  const [showsignbutton, setshowsignbutton] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [mintpopup, setmintpopup] = useState(false);
  const [showconnectbutton, setshowconnectbutton] = useState(false);
  const [mintpage, setmintpage] = useState("page1");
  const [totalNFTMinted, setTotalNFTMinted] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [zkProof, setZkProof] = useState(null);
  const [jwtEncoded, setJwtEncoded] = useState(null);
  const [userSalt, setUserSalt] = useState(null);
  const [txDigest, setTxDigest] = useState(null);

  const { suiClient } = useSui();

  const { account, connected, network, signMessage, signAndSubmitTransaction } = useWallet();
  const wallet = useWallet();
  let sendable = isSendableNetwork(connected, network?.name);

 

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('connected wallet name: ', wallet.name)
    console.log('account address: ', wallet.account?.address)
    console.log('account publicKey: ', wallet.account?.publicKey)
  }, [wallet.connected])

  useEffect(() => {
    // Extract URL parameters
    const currentUrl = window.location.href;
    const params = new URLSearchParams(currentUrl.split('?')[1]);
    const redirect_status = params.get('redirect_status');

    console.log("redirect_status", redirect_status);
    if (redirect_status === `succeeded`) {
      setmintpage("page3");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  // useEffect(() => {
  //   const vpnnft = async () => {
  //     try {

  //       const graphqlbody = {
  //         query: `
  //         query MyQuery {
  //           current_token_datas_v2(
  //             where: {collection_id: {_eq: \"${envcollectionid}\"}}
  //           ) {
  //             token_name
  //             description
  //           }
  //         }
  //           `,
  //         operationName: "MyQuery",
  //       };

  //       const response = await axios.post(`${graphqlaptos}`, graphqlbody, {
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       console.log("vpn nft", response.data.data.current_token_datas_v2);
  //       setTotalNFTMinted(response.data.data.current_token_datas_v2);
  //     } catch (error) {
  //       console.error("Error fetching nft data:", error);
  //     } finally {
  //     }
  //   };

  //   vpnnft();
  // }, []);
  

  

  

  // useEffect(() => {
  //   // Check to see if this is a redirect back from Checkout
  //   const query = new URLSearchParams(window.location.search);
  //   if (query.get("success")) {
  //     console.log("Order placed! You will receive an email confirmation.");
  //   }

  //   if (query.get("canceled")) {
  //     console.log(
  //       "Order canceled -- continue to shop around and checkout when youre ready."
  //     );
  //   }
  // }, []);

  // const transaction = {
  //   arguments: [],
  //   function: `${envmintfucn}`,
  //   type: "entry_function_payload",
  //   type_arguments: [],
  // };

  // const transaction = {
  //   data: {
  //     function: "0x1::coin::transfer",
  //     typeArguments: [APTOS_COIN],
  //     functionArguments: [account?.address, 1], // 1 is in Octas
  //   },
  // };

  

  async function getZkProof(forceUpdate = false) {
    const decodedJwt = jwt_decode(jwtEncoded);
    const { userKeyData, ephemeralKeyPair } = getEphemeralKeyPair();

    // Modifed Key Pair generation and retrieving //
    const keyPair = getEphemeralKeyPair();

    const zkpPayload = {
      jwt: jwtEncoded,
      extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(
        keyPair.ephemeralKeyPair.getPublicKey()
      ),
      jwtRandomness: userKeyData.randomness,
      maxEpoch: userKeyData.maxEpoch,
      salt: userSalt,
      keyClaimName: "sub",
    };
    const ZKPRequest = {
      zkpPayload,
      forceUpdate,
    };
    console.log("about to post zkpPayload = ", ZKPRequest);
    // setPublicKey(zkpPayload.extendedEphemeralPublicKey);

    //Invoking our custom backend to delagate Proof Request to Mysten backend.
    // Delegation was done to avoid CORS errors.
    const proofResponse = await axios.post("/api/zkp", ZKPRequest);

    if (!proofResponse?.data?.zkp) {
      console.log(
        "Error getting Zero Knowledge Proof. Please check that Prover Service is running."
      );
      return;
    }
    console.log("zkp response = ", proofResponse.data.zkp);

    setZkProof(proofResponse.data.zkp);
  }

  useEffect(() => {
    executeTransactionWithZKP();
  }, [zkProof])
  

  function getEphemeralKeyPair() {
    const userKeyData = JSON.parse(
      localStorage.getItem("userKeyData")
    );
    // let ephemeralKeyPairArray = Uint8Array.from(
    //   Array.from(fromB64(userKeyData.ephemeralPrivateKey!))
    // );
    let ephemeralKeyPairArray = decodeSuiPrivateKey(
      userKeyData.ephemeralPrivateKey
    );
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
      ephemeralKeyPairArray.secretKey
    );
    return { userKeyData, ephemeralKeyPair };
  }

  useEffect(() => {

    const jwtEncodedsave = localStorage.getItem('id_token');
    setJwtEncoded(jwtEncodedsave);
    loadRequiredData(jwtEncodedsave);

  }, []);

  async function loadRequiredData(encodedJwt) {
    //Decoding JWT to get useful Info
    const decodedJwt = (await jwt_decode(
      encodedJwt
    ));

    const response = await axios.post("/api/salt");

    const userSalt = response.data.salt;
    if (!userSalt) {
      return;
    }
    const address = jwtToAddress(encodedJwt, BigInt(userSalt));

    setUserAddress(address);
    setUserSalt(userSalt);

    console.log("All required data loaded. ZK Address =", address);
  }

  async function executeTransactionWithZKP() {
    
    const decodedJwt = jwt_decode(jwtEncoded);
    const { userKeyData, ephemeralKeyPair } = getEphemeralKeyPair();
    const partialZkSignature = zkProof;

    if (!partialZkSignature || !ephemeralKeyPair || !userKeyData) {
      console.log("Transaction cannot proceed. Missing critical data.");
      return;
    }

    const txb = new TransactionBlock();

    //Just a simple Demo call to create a little NFT weapon :p
    txb.moveCall({
      target: `${envmintfucn}`, //demo package published on testnet
      arguments: [
        // txb.pure("Zero Knowledge Proof Axe 9000"), // weapon name
        // txb.pure(66), // weapon damage
      ],
    });
    txb.setSender(userAddress);

    const signatureWithBytes = await txb.sign({
      client: suiClient,
      signer: ephemeralKeyPair,
    });

    console.log("Got SignatureWithBytes = ", signatureWithBytes);
    console.log("maxEpoch = ", userKeyData.maxEpoch);
    console.log("userSignature = ", signatureWithBytes.signature);

    const addressSeed = genAddressSeed(
      BigInt(userSalt),
      "sub",
      decodedJwt.sub,
      decodedJwt.aud
    );

    const zkSignature = getZkLoginSignature({
      inputs: {
        ...partialZkSignature,
        addressSeed: addressSeed.toString(),
      },
      maxEpoch: userKeyData.maxEpoch,
      userSignature: signatureWithBytes.signature,
    });

    suiClient
      .executeTransactionBlock({
        transactionBlock: signatureWithBytes.bytes,
        signature: zkSignature,
        options: {
          showEffects: true,
        },
      })
      .then((response) => {
        if (response.effects?.status.status == "success") {
          console.log("Transaction executed! Digest = ", response.digest);
          setTxDigest(response.digest);
        } else {
          console.log(
            "Transaction failed! reason = ",
            response.effects?.status
          );
        }
      })
      .catch((error) => {
        console.log("Error During Tx Execution. Details: ", error);
        if (error.toString().includes("Signature is not valid")) {
          console.log(
            "Signature is not valid. Please generate a new one by clicking on 'Get new ZK Proof'"
          );
        }
      });
  }

  // const mint = async () => {
  //   setbuttonblur(true);
  //   setLoadingTx(true);
  //   console.log("connected", connected);
  //   try {
  //     const pendingTransaction = await signAndSubmitTransaction(transaction);
  //     await aptosClient(network?.name.toLowerCase()).waitForTransaction({
  //       transactionHash: pendingTransaction.hash,
  //     });
  //     console.log("mint transaction", pendingTransaction.hash);
  //     if(pendingTransaction.hash)
  //     {
  //       setmintpage("page3");
  //       setLoadingTx(false);
  //       setshowconnectbutton(false);
  //     }
  //   } catch (error) {
  //     console.error("Error connecting wallet or minting NFT:", error);
  //     setbuttonblur(false);
  //     setLoadingTx(false);
  //     // setmintpage("page1");
  //     setshowconnectbutton(false);
  //   }
  // };

  // const stripe = async () => {
  //   // if (!isSignedIn) {
  //   //   await connectWallet();
  //   // }
  //   setbuttonblur(true);

  //   const auth = Cookies.get("erebrus_token");
  //   const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
  //   const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

  //   try {
  //     const response = await axios.post(
  //       `${EREBRUS_GATEWAY_URL}api/v1.0/subscription/erebrus`,
  //       {},
  //       {
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${auth}`,
  //         },
  //       }
  //     );

  //     const responseData = await response;
  //     console.log("stripe response:", responseData);
  //     setClientSecret(responseData.data.payload.clientSecret);
  //     setmintpopup(false);
  //     try {
  //       const res = await fetch("/api/checkout", {
  //         method: "POST",
  //         headers: {
  //           "content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ amount: 111 }),
  //       });

  //       res.json().then((data) => {
  //         console.log("stripe data", data);
  //         // router.push(data.url);
  //       });
  //       if (res.statusCode === 500) {
  //         console.error(data.message);
  //         return;
  //       }
  //       setsuccesspop(true);
  //     } catch (error) {
  //       console.log("stripe error payment");
  //     }
  //   } catch (error) {
  //     console.error("stripe error:", error);
  //   }
  // };

  // -------------------------------------------------------------------------------------------------------------------------------------------

  

  async function handleSignAndExecuteTxBlock() {
    if (!wallet.connected) return
  
    // define a programmable transaction
    const tx = new TransactionBlock();
    const packageObjectId = "0x43260ab5997978f27f797211bf5dda44c6a6121022f9b32a967f795fbf2ed0be";
    const mintCoin = tx.splitCoins(tx.gas, [tx.pure("1000000000")]);
    tx.setGasBudget(100000000);
    tx.moveCall({
      target: `${packageObjectId}::erebrus::mint`,
      arguments: [
        tx.pure("Sui Subscription"),        // Name argument
        tx.pure("Subscription Vpn nft"), // Description argument
        tx.pure("https://www.google.com/imgres?q=sui%20&imgurl=https%3A%2F%2Ffinancefeeds.com%2Fwp-content%2Fuploads%2F2024%2F03%2FSui_Header_1711630769O8YEYEh4cs-1.jpg&imgrefurl=https%3A%2F%2Ffinancefeeds.com%2Fsui-enhances-partnership-with-space-and-time-for-advanced-blockchain-data-integration%2F&docid=lA3jRMlEg3o8dM&tbnid=RI4hBzEf0naH4M&vet=12ahUKEwiq8tTM9a-GAxVk1jgGHbCJDXoQM3oECCUQAA..i&w=1200&h=720&hcb=2&ved=2ahUKEwiq8tTM9a-GAxVk1jgGHbCJDXoQM3oECCUQAA"),         // URL argument
        mintCoin,
        tx.object("0xa3a22a2da9d2cbf2b48dfa46a169ed2090f2d0eaf5781121934aa5d220c2a146")
      ],
    });

    try {
      // execute the programmable transaction
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('nft minted successfully!', resData);
      alert('Congrats! your nft is minted!')
      window.location.href="/subscription"
    } catch (e) {
      console.error('nft mint failed', error);
    }
    // window.location.reload()
  }

 

  // if (!isSignedIn) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Erebrus | Clients</title>
  //       </Head>
  //       <div className="flex justify-center mt-48 text-white bg-black h-screen">
  //         Please sign in to Erebrus to view your NFT
  //       </div>
  //       {/* <button
  //                 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg lg:mb-48"
  //                 onClick={mint}
  //               >
  //                 Mint Erebrus NFT
  //               </button> */}
  //     </>
  //   );
  // }
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Head>
        <title>Erebrus | Clients</title>
      </Head>

      { mintpage === "page1" &&
        (
          <>
          <div className="p-20">
          <div className="text-white text-5xl uppercase leading-normal" style={{marginLeft:'25vh', marginRight:'10vh', fontFamily:"Times New Roman"}}>
            Step into the Future of Internet Safety with <span style={{color:"#0162FF"}}>111 NFT VPN</span>
          </div>
<div class="flex justify-center gap-20">
<div className="text-white w-1/3 p-10" style={{marginLeft:'20vh'}}>
          <img src="monkey.png" style={{border:'1px solid #0162FF'}} className="rounded-lg"/>
        </div>
        <div className="w-1/2 mt-10">
          <div className="text-white text-xl mt-10 mx-auto flex gap-2">
            <img src="/uis_calender.png" className="w-6 h-6 mt-1"/>
            <div>3-Month Coverage</div>
          </div>
          <div className="text-white text-xl mt-4 mx-auto flex gap-2">
          <img src="/mdi_users.png" className="w-6 h-6 mt-1"/>
            <div>Unlimited Devices</div>
          </div>
          <div className="text-white text-xl mt-4 mx-auto flex gap-2">
          <img src="/icomoon-free_price-tags.png" className="w-6 h-6 mt-1"/>
            <div>Only at 1.11 SUI</div>
          </div>
          <div className="text-white text-xl mt-4 mx-auto flex gap-2">
          <img src="/wpf_security-checked.png" className="w-6 h-6 mt-1"/>
            <div>Exceptional Value for Unmatched Security</div>
          </div>

          <div className="flex gap-10 mt-10">
          <div className="text-white text-md rounded-full py-3 px-10" style={{border: "1px solid #0162FF"}}>
            <span className="font-bold text-2xl mr-4">{totalNFTMinted ? totalNFTMinted.length: ""}</span> Minted NFTs
          </div>
          <div className="text-white text-md rounded-full py-3 px-14" style={{border: "1px solid #0162FF"}}>
            <span className="font-bold text-2xl mr-4">{totalNFTMinted ? `${111 - totalNFTMinted.length}`: ""}</span> NFTs Left
          </div>
          </div>
  
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="mt-10 text-white flex flex-col justify-center items-center">
                {isLoadingTx ? (
                  <div className="animate-spin text-white text-7xl">⛏</div>
                ) : (
                  <>
                    {/* {!isSignedIn || !isauthenticate ? (
                      <div className="text-white font-bold py-4 px-10 rounded-lg mr-auto ml-10 -mt-10">
                        {!connected && (
                          <button className="">
                            <WalletSelectorAntDesign />
                          </button>
                        )}
                        {connected && (
                          // <SingleSignerTransaction isSendableNetwork={isSendableNetwork} />
                          <Button
                            color={"blue"}
                            onClick={onSignMessage}
                            disabled={!sendable}
                            message={"Authenticate"}
                          />
                        )}
                      </div>
                    ) : ( */}
                      <div className="mr-auto">
                        <div className="text-orange-300 text-sm mb-2">
                          (one wallet address can only mint one)
                        </div>
                        {buttonblur ? (
                          <div
                            className={`text-white font-bold py-4 px-10 rounded-full mr-auto bg-blue-300`}
                          >
                            Mint Erebrus NFT
                          </div>
                        ) : (
                          <button
                            className={`text-white font-bold py-4 px-10 rounded-full mr-auto `}
                            onClick={()=>{setmintpage("page2")}}
                            style={{backgroundColor:'#0162FF'}}
                          >
                            Mint Erebrus NFT
                          </button>
                        )}
                      </div>
                    {/* )} */}

                    {error && <div className="text-red-500 mt-4">{error}</div>}
                  </>
                )}
              </div>
            </motion.div>
        </div>
      </div>
      </div>
      </>
        )
      }
      

      {mintpage === "page2" && (
                      <div
                        style={{ backgroundImage: `url('/bgmint.png')`, 
                        backgroundColor:"black", 
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"}}
                        className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                        id="popupmodal"
                      >
                        <div className="relative p-4 w-full max-w-xl max-h-full">
                        <img src="/coin1.png" className="w-60 -mt-10 absolute -top-10 -left-20"/>
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700 bgcolor pb-20"
                            style={{
                              border: "1px solid #0162FF",
                              boxShadow: 'inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)',
                            }}
                          >
                            <div className="flex items-center justify-end px-4 py-6 rounded-t" style={{borderBottom: "1px solid #FFFFFF80"}}>
                              <div className="text-2xl text-white">Choose the payment option</div>
                              <button
                                onClick={() => setmintpage("page1")}
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

                            <div className="items-center pt-20 rounded-b w-1/2 mx-auto">
                            
                          <button
                                onClick={() => handleSignAndExecuteTxBlock()}
                                style={{ border: "1px solid #0162FF" }}
                                type="button"
                                className="flex w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                <img src="/mint2.png" className="w-12"/>
                                <div className="px-5 py-2.5 ">Pay in SUI</div>
                              </button>   
                            </div>

                            {/* { !showconnectbutton && (<div className="flex items-center pb-20 pt-10 rounded-b w-1/2 mx-auto">
                              <button
                                onClick={stripe}
                                style={{ border: "1px solid #0162FF" }}
                                type="button"
                                className="flex w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                <img src="/mint3.png" className="w-12"/>
                                <div className="px-5 py-2.5 ">Pay in USD</div>
                              </button>
                            </div>)} */}
                          </div>
                          <img src="/coin2.png" className="w-60 -mt-10 absolute -bottom-24 -right-24" style={{ zIndex: -1 }}/>
                        </div>
                      </div>
                    )}


{clientSecret && (
                      <div
                        style={{ backgroundColor: "#222944E5" }}
                        className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full p-30"
                        id="popupmodal"
                      >
                        <div className="p-10 w-2/5 flex flex-col" style={{backgroundColor:'white'}}>
                          <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                          </Elements>
                        </div>
                      </div>
                    )}




{mintpage === "page3" && (
                      <div
                        style={{ backgroundColor: "black" }}
                        className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                        id="popupmodal"
                      >
                        <div className="relative p-4 w-1/3 max-w-2xl max-h-full">
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700"
                            style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
                          >
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                              <button
                                onClick={() => setmintpage("page1")}
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

                            <img src="/mint.png" className="mx-auto"/>

                            <div className="p-4 md:p-5 space-y-4">
                              <p className="text-2xl text-center font-semibold text-white">
                              Congratulations
                              </p>
                              <p className="text-md text-center w-full mx-auto text-white">
                                You have minted your Erebrus NFT, welcome to an exclusive journey of innovation and community.
                                To set clients, click button to go to subscription page.
                              </p>
                            </div>

                            <div className="flex items-center pb-10 pt-4 rounded-b w-1/3 mx-auto">
                              <Link
                                href="/subscription"
                                style={{ backgroundColor: "#0162FF" }}
                                type="button"
                                className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-2 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                View Subscription
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
    </>
  );
};

export default Mint;