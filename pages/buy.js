import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import dynamic from "next/dynamic";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm.tsx";
import { aptosClient } from "../module";
export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
const envmintfucn = process.env.NEXT_PUBLIC_MINTFUNCTION;

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

const Buy = () => {

  const [isLoadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState(null);
  const isSignedIn = Cookies.get("erebrus_wallet");
  const isauthenticate = Cookies.get("erebrus_token");
  const [address, setAddress] = useState("");
  const [token, settoken] = useState("");
  const [wallet, setwallet] = useState("");
  const [userid, setuserid] = useState("");
  const [buttonblur, setbuttonblur] = useState(false);
  const [showsignbutton, setshowsignbutton] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [mintpopup, setmintpopup] = useState(false);
  const [showconnectbutton, setshowconnectbutton] = useState(false);
  const [mintpage, setmintpage] = useState("page1");
  const [magiclinkpopup, setmagiclinkpopup] = useState(false);
  const [gmail, setgmail] = useState("");
  const [code, setcode] = useState("");
  const [magicmessage, setmagicmessage] = useState("");
  const [magicloginmessage, setmagicloginmessage] = useState(false);

  const { account, connected, network, signMessage, signAndSubmitTransaction } = useWallet();

  let sendable = isSendableNetwork(connected, network?.name);

  useEffect( () => {
    
    mint();

  }, [connected])

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


  useEffect(() => {
   
    if (!isauthenticate) {
      setmagiclinkpopup(true);
    }
  }, []);
  

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const wallet = getAptosWallet();
    try {
      const response = await wallet.connect();

      const account = await wallet.account();
      console.log("account", account);

      // Get the current network after connecting (optional)
      const networkwallet = await window.aptos.network();

      // Check if the connected network is Mainnet
      if (networkwallet === mynetwork) {
        const { data } = await axios.get(
          `${GATEWAY_URL}api/v1.0/flowid?walletAddress=${account.address}`
        );
        console.log(data);

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
        const publicKey = account.publicKey;

        const { signature, fullMessage } = await wallet.signMessage({
          message,
          nonce,
        });
        console.log("sign", signature, "full message", fullMessage);

        // console.log(signature);

        let signaturewallet = signature;

        if (signaturewallet.length === 128) {
          signaturewallet = `0x${signaturewallet}`;
        }

        const authenticationData = {
          flowId: nonce,
          signature: `${signaturewallet}`,
          pubKey: publicKey,
        };

        const authenticateApiUrl = `${GATEWAY_URL}api/v1.0/authenticate`;

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

          settoken(token), setwallet(account.address), setuserid(userId);

          Cookies.set("erebrus_token", token, { expires: 7 });
          Cookies.set("erebrus_wallet", account.address, { expires: 7 });
          Cookies.set("erebrus_userid", userId, { expires: 7 });

          // await mint();
        } catch (error) {
          console.error(error);
        }
      } else {
        alert(`Switch to ${mynetwork} in your wallet`);
      }
    } catch (err) {
      console.log(err);
    }
  };

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


  const handleMagicLink = async() =>{
    const auth = Cookies.get("erebrus_token");
    const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

    const obj = {"email":gmail};
    const jsonData = JSON.stringify(obj);

    try {
      const response = await axios.post(`${REACT_APP_GATEWAY_URL}api/v1.0/account/generate-auth-id`, {
       ...obj
      },{headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      }});

      const responseData = await response.data;
      console.log('magic link response:', responseData);
      setmagicmessage(responseData.message);
    } catch (error) {
      console.error('magic link error:', error);
    }
  };

  const handleMagicLogin = async() =>{
    const auth = Cookies.get("erebrus_token");
    const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

    const obj = {"code":code,"emailId":gmail};
    const jsonData = JSON.stringify(obj);

    try {
      const response = await axios.post(`${REACT_APP_GATEWAY_URL}api/v1.0/account/paseto-from-magic-link`, {
       ...obj
      },{headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${auth}`,
      }});

      const responseData = await response.data;
      console.log('magic login response:', responseData);
      Cookies.set("erebrus_token", responseData.payload.token, { expires: 7 });
      setmagicloginmessage(true);
    } catch (error) {
      console.error('magic login error:', error);
    }
  };

  const transaction = {
    data: {
      function: `${envmintfucn}`, // Assuming envmintfucn is the function name in the old format
      typeArguments: [],           // No type arguments in the old format
      functionArguments: [],       // No function arguments in the old format
    },
  };

  const mint = async () => {
    setbuttonblur(true);
    setLoadingTx(true);
    console.log("connected", connected);
    try {
      const pendingTransaction = await signAndSubmitTransaction(transaction);
      await aptosClient(network?.name.toLowerCase()).waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });
      console.log("mint transaction", pendingTransaction.hash);
      if(pendingTransaction.hash)
      {
        setmintpage("page3");
        setLoadingTx(false);
        setshowconnectbutton(false);
      }
    } catch (error) {
      console.error("Error connecting wallet or minting NFT:", error);
      setbuttonblur(false);
      setLoadingTx(false);
      // setmintpage("page1");
      setshowconnectbutton(false);
    }
  };

  const stripe = async () => {
    // if (!isSignedIn) {
    //   await connectWallet();
    // }
    setbuttonblur(true);

    const auth = Cookies.get("erebrus_token");
    const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
    const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

    try {
      const response = await axios.post(
        `${EREBRUS_GATEWAY_URL}api/v1.0/subscription/erebrus`,
        {},
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      const responseData = await response;
      console.log("stripe response:", responseData);
      setClientSecret(responseData.data.payload.clientSecret);
      setmintpopup(false);
      // try {
      //   const res = await fetch("/api/checkout", {
      //     method: "POST",
      //     headers: {
      //       "content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ amount: 111 }),
      //   });

      //   res.json().then((data) => {
      //     console.log("stripe data", data);
      //     // router.push(data.url);
      //   });
      //   if (res.statusCode === 500) {
      //     console.error(data.message);
      //     return;
      //   }
      //   setsuccesspop(true);
      // } catch (error) {
      //   console.log("stripe error payment");
      // }
    } catch (error) {
      console.error("stripe error:", error);
    }
  };

  const onSignMessage = async () => {
    if (sendable) {
      try {
        const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account?.address}`
        );
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

        if (signaturewallet.length === 128) {
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
    } else {
      alert(`Switch to ${mynetwork} in your wallet`);
    }
  };

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

  const border = {
    backgroundColor: "#30385F",
    border: "1px solid #788AA3",
  };

  return (
    <>
      <Head>
        <title>Erebrus | Clients</title>
      </Head>

      { mintpage === "page1" &&
        (
<div class="flex h-screen">
        <div className="w-1/2">
          <div className="text-white text-4xl ml-20 mt-20 mx-auto">
            Buy Subscription
          </div>
          <div className="text-white text-xl ml-20 mt-10 mx-auto">
          Pay per use monthly by APT, cryto currencies or Fiat  
          </div>
          <div className="text-white text-xl ml-20 mt-4 mx-auto">
          Up to 5 regions to choose from (more to come along the way)
          </div>
          <div className="text-white text-xl ml-20 mt-4 mx-auto">
          Multiple tiers starting from 9.99USD
          </div>
  
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="mt-20 text-white flex flex-col justify-center items-center">
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
                        {buttonblur ? (
                          <div
                            className={`text-white font-bold py-4 px-10 rounded-full mr-auto ml-20 bg-blue-300`}
                          >
                            Buy Subscription
                          </div>
                        ) : (
                          <button
                            className={`text-white font-bold py-4 px-10 rounded-full mr-auto ml-20`}
                            onClick={()=>{setmintpage("page2")}}
                            style={{backgroundColor:'#0162FF'}}
                          >
                            Buy Subscription
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

        {/* <div className="text-white w-1/4 ml-auto mr-40 mt-10">
          <img src="/111nft_gif.gif" />
        </div> */}
      </div>
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

                            {/* <div className="items-center pt-20 rounded-b w-1/2 mx-auto">
                            {!connected ? (
                              <>
                              <button
                               onClick={()=>{setshowconnectbutton(true)}}
                              style={{ border: "1px solid #0162FF" }}
                              type="button"
                              className="flex w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <img src="/mint2.png" className="w-12"/>
                              <div className="px-5 py-2.5 ">Pay in APT</div>
                            </button>
                          { showconnectbutton && 
                            (<button className="mx-auto justify-center mt-10 items-center flex">
                            <WalletSelectorAntDesign />
                          </button>)
                            }
                          </>
                        ):(
                          <button
                                onClick={mint}
                                style={{ border: "1px solid #0162FF" }}
                                type="button"
                                className="flex w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                <img src="/mint2.png" className="w-12"/>
                                <div className="px-5 py-2.5 ">Pay in APT</div>
                              </button>
                        )}
                              
                            </div> */}

                            { !showconnectbutton && (<div className="flex items-center pb-20 pt-10 rounded-b w-1/2 mx-auto">
                              <button
                                onClick={stripe}
                                style={{ border: "1px solid #0162FF" }}
                                type="button"
                                className="flex w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                <img src="/mint3.png" className="w-12"/>
                                <div className="px-5 py-2.5 ">Pay in USD</div>
                              </button>
                            </div>)}
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



{ magiclinkpopup && (
<div style={{backgroundColor:'#222944E5'}} className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full" id="popupmodal">
    <div className="relative p-4 lg:w-1/2 w-full max-w-lg max-h-full">
        <div className="relative rounded-lg shadow" style={{backgroundColor:'#37406D'}}>
            <div className="flex items-center justify-end p-4 rounded-t text-white">
                <h3 className="text-2xl font-semibold">
                Login using Magic link
                </h3>
                <button 
                    onClick={()=>{setmagiclinkpopup(false);window.location.reload();}}
                    type="button" 
                    className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>

            {/* <Image src={googletop} alt="" className="mx-auto"/> */}

            {!magicmessage && (

            <form
                    id="myForm"
                    className="rounded pt-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMagicLink();
                    }}
                  >

          <div className="pb-4 mx-10">
                <input
                          type="email"
                          id="gmail"
                          style={border}
                          className="shadow border appearance-none rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Enter your email address"
                          value={gmail}
                          onChange={(e) => setgmail(e.target.value)}
                          required
                        />
          </div>

          <div className="pb-10 mx-10">
            <button className="text-white border p-2 rounded-lg w-full"
            type="submit"
            value="submit">
            <div className="flex gap-2 justify-center">
                <div>Send Magic Link</div>
                </div>
            </button>
          </div>

          </form>
          )}

          {magicmessage && !magicloginmessage && (
            <>
            <div className="text-green-500 py-10 w-2/3 mx-auto">{magicmessage}! Please check your mail and enter code here or click the magic link.</div>
            <form
                    id="magicForm"
                    className="rounded pt-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMagicLogin();
                    }}
                  >

          <div className="pb-4 mx-10">
                <input
                          type="text"
                          id="code"
                          style={border}
                          className="shadow border appearance-none rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Enter the code"
                          value={code}
                          onChange={(e) => setcode(e.target.value)}
                          required
                        />
          </div>

          <div className="pb-10 mx-10">
            <button className="text-white border p-2 rounded-lg w-full"
            type="submit"
            value="submit">
            <div className="flex gap-2 justify-center">
                <div>Link</div>
                </div>
            </button>
          </div>

          </form>
          </>
          )}

          {magicloginmessage && (
            <div className="py-10 text-green-500 px-10">Successfully Linked your account!!</div>
          )}

        </div>          
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

export default Buy;