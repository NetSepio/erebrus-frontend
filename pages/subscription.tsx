import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import MyVpnContainer from "../components/Myvpncontainer";
import NftdataContainer from "../components/NftDataContainer";
import dynamic from "next/dynamic";
import crypto from "crypto";
import { lib, enc } from "crypto-js";
import { generateKeyPair } from "curve25519-js";
// import { Network } from "@aptos-labs/ts-sdk";
import Button from "../components/Button";
import { ConnectButton, useWallet, addressEllipsis } from "@suiet/wallet-kit";
// import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import jwt_decode from "jwt-decode";
import {
  genAddressSeed,
  getZkLoginSignature,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";
import { useLayoutEffect } from "react";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import FetchSuiNft from "../components/fetchSuiNft";

const envcollectionid = process.env.NEXT_PUBLIC_COLLECTIONID;
const graphqlaptos = process.env.NEXT_PUBLIC_GRAPHQL_APTOS;

export type MoveValue =
  | number
  | boolean
  | string
  | MoveValue[]
  | string
  | {
      id: string;
    }
  | MoveStruct
  | null;
export type MoveStruct =
  | MoveValue[]
  | {
      fields: {
        [key: string]: MoveValue;
      };
      type: string;
    }
  | {
      [key: string]: MoveValue;
    };
export type SuiParsedData =
  | {
      dataType: "moveObject";
      fields: MoveStruct;
      hasPublicTransfer: boolean;
      type: string;
    }
  | {
      dataType: "package";
      disassembled: {
        [key: string]: unknown;
      };
    };
export interface FlowIdResponse {
  eula: string;
  flowId: string;
}

export interface WalletData {
  walletAddress: string | undefined;
}

interface FormData {
  name: string;
  region: string;
}
const transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

// const WalletSelectorAntDesign = dynamic(
//   () => import("../components/WalletSelectorAntDesign"),
//   {
//     suspense: false,
//     ssr: false,
//   }
// );

const isSendableNetwork = (connected, network) => {
  return connected && network?.toLowerCase() === mynetwork.toLowerCase();
};

const Subscription = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonset, setbuttonset] = useState<boolean>(false);
  const [projectsData, setprojectsData] = useState<any>(null);
  const [nftdata, setnftdata] = useState<any>(null);
  const [msg, setMsg] = useState<string>("");
  const [region, setregion] = useState<string>("");
  const [verify, setverify] = useState<boolean>(false);
  const [collectionsPage, setcollectionsPage] = useState<boolean>(true);
  const [collectionId, setcollectionId] = useState<string>();
  const [collectionName, setcollectionName] = useState<string>();
  const [collectionImage, setcollectionImage] = useState<string>();
  const [vpnPage, setvpnPage] = useState<boolean>(false);
  const [valueFromChild2, setValueFromChild2] = useState<string>("");
  const [note, setnote] = useState<boolean>(true);
  const [trialsubscriptiondata, settrialsubscriptiondata] = useState<any>(null);
  const [jwtEncoded, setJwtEncoded] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [widgetData, setwidget] = useState(null);

  const { status, connected, connecting, account } = useWallet();
  const suiwallet = useWallet();
  let sendable = isSendableNetwork(connected, suiwallet?.chain?.id);
  console.log(suiwallet);
  const bg = {
    backgroundColor: "#202333",
  };

  const border = {
    backgroundColor: "#202333",
    border: "1px solid #5696FF",
  };

  const button = {
    border: "1px solid #0162FF",
  };

  const text = {
    color: "#788AA3",
  };

  const initialFormData: FormData = {
    name: "",
    region: "",
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [ConfigFile, setConfigFile] = useState<string>("");
  const [VpnName, setVpnName] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const genKeys = () => {
    const preSharedKey = lib.WordArray.random(32);
    // Encode the keys in base64

    const preSharedKeyB64 = preSharedKey.toString(enc.Base64);

    const keyPair = generateKeyPair(crypto.randomBytes(32));
    const privKey = Buffer.from(keyPair.private).toString("base64");
    const pubKey = Buffer.from(keyPair.public).toString("base64");
    const keys = {
      preSharedKey: preSharedKeyB64,
      privKey: privKey,
      pubKey: pubKey,
    };

    return keys;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const auth = Cookies.get("erebrus_token");
    console.log("clicked");
    try {
      const keys = genKeys();
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      // formDataObj.append("region", formData.region);
      // formDataObj.append("collectionId", collectionId);
      formDataObj.append("presharedKey", keys.preSharedKey);
      formDataObj.append("publicKey", keys.pubKey);

      // Convert FormData to JavaScript Object
      const formDataObject: { [key: string]: string | File | null } = {};
      formDataObj.forEach((value, key) => {
        formDataObject[key] = value;
      });

      // Convert JavaScript Object to JSON string
      const jsonData = JSON.stringify(formDataObject);
      // console.log(formData.type);
      // if (formData.type === "dedicated") {
      //   const response = await fetch(`${REACT_APP_GATEWAY_URL}api/v1.0/vpn`, {
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json, text/plain, */*",
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${auth}`,
      //     },
      //     body: jsonData,
      //   });

      //   if (response.status === 200) {
      //     const responseData = await response.json();
      //     setFormData(initialFormData);
      //     console.log("vpn data", responseData);
      //     setverify(true);
      //   } else {
      //     setMsg("error");
      //   }
      // } else
      // if (formData.type === "decentralized") {
      const response = await fetch(
        `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/client/${formData.region}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: jsonData,
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        setVpnName(responseData.payload.client.Name);
        setFormData(initialFormData);
        console.log("vpn data", responseData);

        const configFile = `
        [Interface]
        Address = ${responseData.payload.client.Address}
        PrivateKey = ${keys.privKey}
        DNS = 1.1.1.1

        [Peer]
        PublicKey = ${responseData.payload.serverPublicKey}
        PresharedKey = ${responseData.payload.client.PresharedKey} 
        AllowedIPs = 0.0.0.0/0, ::/0
        Endpoint = ${responseData.payload.endpoint}:51820
        PersistentKeepalive = 16`;
        setConfigFile(configFile);
        setverify(true);
        setValueFromChild2("refreshafterclientcreate");
        // } else if(response.status === 400){
        //   setMsg("Cant create more than 3 clients");
      } else {
        setMsg("Failed to create VPN. Try with unique name.");
      }
      // }
    } catch (error) {
      console.error("Error:", error);
      setMsg("Failed to create VPN. Try with unique name.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const nftminting = async () => { // Make sure to define nftminting as an async function
  //     const SuiNft = await FetchSuiNft(suiwallet.address); // Call FetchSuiNft and await its result
  //     console.log("suiiii nft", SuiNft);
  //     console.log("suiwallet",suiwallet)
  //   }

  //   nftminting();
  // }, [account]);
  useEffect(() => {
    const getNft = async () => {
      setLoading(true);
      try {
        const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });
        const objects = await suiClient.getOwnedObjects({
          owner: suiwallet.address
        });
        const widgets = [];
        console.log("objects", objects);
        // console.log

        // Iterate through all objects owned by the address
        for (let i = 0; i < objects.data.length; i++) {
          const currentObjectId = objects.data[i].data.objectId;

          // Get object information
          const objectInfo = await suiClient.getObject({
            id: currentObjectId,
            options: { showContent: true },
          });
          console.log("objectinfo", objectInfo);

          const packageId =
            "0x43260ab5997978f27f797211bf5dda44c6a6121022f9b32a967f795fbf2ed0be";
          const content = objectInfo.data?.content;

          if (
            content &&
            "type" in content &&
            content.type === `${packageId}::erebrus::NFT`
          ) {
            const widgetObjectId = objectInfo.data;
            console.log("Widget spotted:", widgetObjectId);
            widgets.push(widgetObjectId);
          }
        }

        console.log("Widgets:", widgets);
        // console.log("asdasdasd",widgetData)

        setwidget(widgets[0]);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    getNft();
  }, [suiwallet]); // Add account as a dependency to useEffect

  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      try {
        const auth = Cookies.get("erebrus_token");

        const response = await axios.get(
          `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/clients`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        console.log("vpn decentralized", response);

        if (response.status === 200) {
          // Filter the data based on the domain ID
          const wallet = Cookies.get("erebrus_wallet");
          const payload: any[] = response.data.payload;
          const filteredData = payload.filter(
            (item) => item?.walletAddress === wallet
          );
          setprojectsData(filteredData);
          console.log("decentralized", filteredData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    const vpnnft = async () => {
      setLoading(true);
      try {
        const auth = Cookies.get("erebrus_token");

        const graphqlbody = {
          query: `
            query getAccountCurrentTokens($address: String!, $where: [current_token_ownerships_v2_bool_exp!]!, $offset: Int, $limit: Int) {
              current_token_ownerships_v2(
                where: { owner_address: { _eq: $address }, amount: { _gt: 0 }, _or: [{ table_type_v1: { _eq: "0x3::token::TokenStore" } }, { table_type_v1: { _is_null: true } }], _and: $where }
                order_by: [{ last_transaction_version: desc }, { token_data_id: desc }]
                offset: $offset
                limit: $limit
              ) {
                amount
                current_token_data {
                  ...TokenDataFields
                }
                last_transaction_version
                property_version_v1
                token_properties_mutated_v1
                is_soulbound_v2
                is_fungible_v2
              }
              current_token_ownerships_v2_aggregate(where: { owner_address: { _eq: $address }, amount: { _gt: 0 } }) {
                aggregate {
                  count
                }
              }
            }
        
            fragment TokenDataFields on current_token_datas_v2 {
              description
              token_uri
              token_name
              token_data_id
              current_collection {
                ...CollectionDataFields
              }
              token_properties
              token_standard
              cdn_asset_uris {
                cdn_image_uri
              }
            }
        
            fragment CollectionDataFields on current_collections_v2 {
              uri
              max_supply
              description
              collection_name
              collection_id
              creator_address
              cdn_asset_uris {
                cdn_image_uri
              }
            }
          `,
          variables: {
            address: `${wallet}`,
            limit: 12,
            offset: 0,
            where: [
              {
                current_token_data: {
                  current_collection: {
                    collection_id: {
                      _eq: `${envcollectionid}`,
                    },
                  },
                },
              },
            ],
          },
          operationName: "getAccountCurrentTokens",
        };

        const response = await axios.post(`${graphqlaptos}`, graphqlbody, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${auth}`,
          },
        });

        console.log("vpn nft", response.data.data.current_token_ownerships_v2);
        if (response.data.data.current_token_ownerships_v2.length > 0) {
          setnftdata(response.data.data.current_token_ownerships_v2);
        }
      } catch (error) {
        console.error("Error fetching nft data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (vpnPage === true) {
      fetchProjectsData();
    }
    if (collectionsPage === true) {
      vpnnft();
    }
  }, [collectionsPage, collectionId, region, valueFromChild2]);

  const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Update the selected region when the dropdown value changes
    setregion(e.target.value);
  };

  const loggedin = Cookies.get("erebrus_token");
  const wallet = Cookies.get("erebrus_wallet");

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return (window as any).aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  // const connectWallet = async () => {
  //   const wallet = getAptosWallet();
  //   try {
  //     const response = await wallet.connect();

  //     const account = await wallet.account();
  //     console.log("account", account);

  //     // Get the current network after connecting (optional)
  //     const networkwallet = await (window as any).aptos.network();

  //     // Check if the connected network is Mainnet
  //     if (networkwallet === mynetwork) {
  //       const { data } = await axios.get(
  //         `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account.address}`
  //       );
  //       console.log(data);

  //       const message = data.payload.eula;
  //       const nonce = data.payload.flowId;
  //       const publicKey = account.publicKey;

  //       const { signature, fullMessage } = await wallet.signMessage({
  //         message,
  //         nonce,
  //       });
  //       console.log("sign", signature, "full message", fullMessage);

  //       let signaturewallet = signature;

  //       if (signaturewallet.length === 128) {
  //         signaturewallet = `0x${signaturewallet}`;
  //       }

  //       const authenticationData = {
  //         flowId: nonce,
  //         "walletAddress": wallet.address,
  //       };

  //       const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

  //       const config = {
  //         url: authenticateApiUrl,
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         data: authenticationData,
  //       };

  //       try {
  //         const response = await axios(config);
  //         console.log("auth data", response.data);
  //         const token = await response?.data?.payload?.token;
  //         const userId = await response?.data?.payload?.userId;

  //         Cookies.set("erebrus_token", token, { expires: 7 });
  //         Cookies.set("erebrus_wallet", account.address, { expires: 7 });
  //         Cookies.set("erebrus_userid", userId, { expires: 7 });

  //         window.location.reload();
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } else {
  //       alert(`Switch to ${mynetwork} in your wallet`);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const onSignMessage = async () => {
    if (sendable) {
      try {
        const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${suiwallet.address}`
        );
        console.log(data);

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
        const publicKey = account?.publicKey;

        const payload = {
          message: message,
          nonce: nonce,
        };
        // const response = await signMessage(payload);
        // console.log(response);

        // let signaturewallet = response.signature;

        // if (signaturewallet.length === 128) {
        //   signaturewallet = `0x${signaturewallet}`;
        // }

        const authenticationData = {
          flowId: nonce,
          walletAddress: wallet.address,
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

        const authResponse = await axios(config);
        console.log("auth data", authResponse.data);

        const token = await authResponse?.data?.payload?.token;
        const userId = await authResponse?.data?.payload?.userId;

        Cookies.set("erebrus_token", token, { expires: 7 });
        Cookies.set("erebrus_wallet", account?.address ?? "", { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });

        window.location.reload();
      } catch (error) {
        console.error("error reach");
        // setshowsignbutton(true);
      }
    } else {
      alert(`Switch to ${mynetwork} in your wallet`);
    }
  };

  const handleChildValue = (value: string) => {
    // Callback function to update the state in the parent component
    setValueFromChild2(value);
    console.log("valueFromChild2", value);
  };

  const handleCollectionClick = (
    collection,
    collectionName,
    collectionImage
  ) => {
    setcollectionId(collection);
    setcollectionName(collectionName);
    setcollectionImage(collectionImage);
    setvpnPage(true);
    setcollectionsPage(false);
  };

  const handleTrialClick = () => {
    setvpnPage(true);
    setcollectionsPage(false);
  };

  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  // useEffect(() => {
  //   const fetchMetaData = async () => {
  //     console.log("collectionImage", collectionImage);
  //     const ipfsCid = collectionImage?.replace("ipfs://", "");

  //     // Fetching metadata from IPFS
  //     const metadataResponse = await axios.get(
  //       `https://ipfs.io/ipfs/${ipfsCid}`
  //     );
  //     const metadata = metadataResponse.data;

  //     console.log("Metadata:", metadata);
  //     setImageSrc(metadata?.image.replace("ipfs://", ""));
  //   };
  //   fetchMetaData();
  // }, [collectionImage]);

  // -----------------------------------------------to fetch regions from node data-----------------------------------------------

  const [nodesdata, setNodesData] = useState([]);
  const [activeNodesData, setActiveNodesData] = useState([]);

  useEffect(() => {
    const fetchNodesData = async () => {
      try {
        const auth = Cookies.get("erebrus_token");

        const response = await axios.get(
          `${EREBRUS_GATEWAY_URL}api/v1.0/nodes/all`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        if (response.status === 200) {
          const payload = response.data.payload;
          setNodesData(payload);
          const filteredNodes = payload.filter(
            (node) => node.status === "active"
          );
          setActiveNodesData(filteredNodes);
          console.log("erebrus nodes", payload);
        }
      } catch (error) {
        console.error("Error fetching nodes data:", error);
      } finally {
      }
    };

    fetchNodesData();
  }, []);

  //-----------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------- check for trial subscription ------------------------------------------------

  useEffect(() => {
    const trialbuycheck = async () => {
      const auth = Cookies.get("erebrus_token");
      try {
        const response = await fetch(
          `${EREBRUS_GATEWAY_URL}api/v1.0/subscription`,
          {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        const responseData = await response.json();
        if (responseData?.subscription) {
          settrialsubscriptiondata(responseData);
          console.log("trial subsc response", responseData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    };

    trialbuycheck();
  }, []);

  // Extracting day, year, and time from the dateTime string
  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString();
    return `${day} ${month} ${year} ${time}`;
  };

  //---------------------------------- zklogin check -------------------------------------------------------------

  async function loadRequiredData(encodedJwt) {
    //Decoding JWT to get useful Info
    const decodedJwt = await jwt_decode(encodedJwt);

    const response = await axios.post("/api/salt");

    const userSalt = response.data.salt;
    if (!userSalt) {
      return;
    }
    const address = jwtToAddress(encodedJwt, BigInt(userSalt));

    setUserAddress(address);

    console.log("All required data loaded. ZK Address =", address);
  }

  useEffect(() => {
    const jwt_token_encoded = localStorage.getItem("id_token");
    if (!jwt_token_encoded) {
      return;
    }
    console.log("jwt token =", jwt_token_encoded);
    setJwtEncoded(jwt_token_encoded);
    loadRequiredData(jwt_token_encoded);
  }, []);

  if ((!wallet || !loggedin) && !userAddress) {
    return (
      <>
        <div className="min-h-screen">
          <img src="/Brazuca_Sitting.png" className="mx-auto p-10" />
          <div className="flex justify-center text-white bg-black font-bold text-3xl text-center">
            Subscribe and Unlock Full Access, <br></br>
            Log In to Get Started
          </div>
          {/* <button
                  className="bg-blue-500 text-white font-bold py-4 px-10 rounded-lg mx-auto flex justify-center mt-10"
                  onClick={connectWallet}
                >
                  Login now
                </button> */}
          <div className="text-white font-bold py-4 px-10 rounded-lg mx-auto flex justify-center mt-10">
            {!connected && (
              <button className="">
                {/* <WalletSelectorAntDesign /> */}
                <ConnectButton label="connect" />
              </button>
            )}
            {connected && (
              <div className="text-white font-bold py-4 px-10 rounded-lg mx-auto flex justify-center">
                <Button
                  color={"blue"}
                  onClick={onSignMessage}
                  disabled={!sendable}
                  message={"Authenticate"}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  

  return (
    <div className="py-0 min-h-screen">
      <section className="">
        <div className="px-10 mx-auto">
          <div className="w-full mx-auto text-left md:text-center">
            {
            collectionsPage === true &&
             (
              <>
                <div className="text-2xl text-white font-semibold text-left ml-4 my-6 border-b border-gray-700 pb-4">
                  Subscription
                </div>
                {!nftdata && !trialsubscriptiondata && !widgetData && (
                  <div className="mx-auto px-4 min-h-screen">
                    <div className="w-full text-center py-20">
                      <h2 className="text-4xl font-bold text-white">
                        No Subscription
                      </h2>
                      <div className="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg w-1/5 mx-auto my-20">
                        <Link href="/plans">Try our free trial now</Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-10 w-1/2">
                  {nftdata && (
                    <div className="w-1/2">
                      <NftdataContainer
                        metaDataArray={nftdata}
                        MyReviews={false}
                        selectCollection={handleCollectionClick}
                      />
                    </div>
                  )}

                  {trialsubscriptiondata && (
                    <div
                      className="w-1/2 rounded-3xl mt-2 mb-2 relative min-h-96"
                      style={{
                        backgroundColor: "#202333",
                        border: "1px solid #0162FF",
                      }}
                    >
                      <div className="w-full h-full rounded-lg px-6 pt-6">
                        <button onClick={handleTrialClick}>
                          <div className="flex flex-col">
                            <div className="w-full">
                              <h3 className="leading-12 mb-2 text-white">
                                <div className="text-lg font-semibold mt-4 uppercase">
                                  {trialsubscriptiondata.subscription.type}{" "}
                                  Subscription
                                </div>
                                <div className="lg:flex md:flex justify-between">
                                  <div className="text-md font-semibold mt-4">
                                    Status: {trialsubscriptiondata.status}
                                  </div>
                                  <div className="text-md font-semibold mt-4">
                                    Valid for 7 days
                                  </div>
                                </div>
                              </h3>

                              <div className="rounded-xl">
                                <div className="text-sm text-white text-start mt-2">
                                  <div className="mb-3">
                                    <span className="text-green-500 ">
                                      Start time :
                                    </span>{" "}
                                    {trialsubscriptiondata.subscription
                                      .startTime
                                      ? formatDateTime(
                                          trialsubscriptiondata.subscription
                                            .startTime
                                        )
                                      : "Loading..."}
                                  </div>
                                  <div className="">
                                    <span className="text-red-500 ">
                                      End time :
                                    </span>{" "}
                                    {trialsubscriptiondata.subscription.endTime
                                      ? formatDateTime(
                                          trialsubscriptiondata.subscription
                                            .endTime
                                        )
                                      : "Loading..."}
                                  </div>
                                </div>
                              </div>

                              <div
                                className="rounded-full px-10 py-2 mb-10 text-white"
                                style={{
                                  backgroundColor: "#0162FF",
                                  position: "absolute",
                                  bottom: 0,
                                  left: 80,
                                }}
                              >
                                Create Clients
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  
                </div>
                {widgetData && (
                    <div
                      className="w-1/4 rounded-3xl mt-2 mb-2 relative min-h-96"
                      style={{
                        backgroundColor: "#202333",
                        border: "1px solid #0162FF",
                      }}
                    >
                      <div className="w-full h-full rounded-lg px-6 pt-6">
                        <button onClick={handleTrialClick}>
                          <div className="flex flex-col">
                            <div className="w-full">
                              <h3 className="leading-12 mb-2 text-white">
                                <div className="text-lg font-semibold mt-4 uppercase">
                                {widgetData?.content.fields.name}{" "}
                                 
                                </div>
                                <div className="lg:flex md:flex justify-between">
                                  <div className="text-md font-semibold mt-4">
                                    Status: active 
                                  </div>
                                        
                                  <div className="text-md font-semibold mt-4 pl-1">
                                     Valid for 3 months
                                  </div>
                                </div>
                              </h3>

                              <div className="rounded-xl">
                                <div className="text-sm text-white text-start mt-2">
                                  <div className="mb-3">
                                    <p className="text-green-500 ">Start time : <a className=" text-white">30 May 2024 01:30:45</a> </p> 
                                  </div>
                                  <div className="">
                                    <span className="text-red-500 ">End time :<a className=" text-white">30 August 2024 01:30:45</a> </span> 
                                  </div>
                                </div>
                              </div>

                              <div
                                className="rounded-full px-10 py-2 mb-10 text-white"
                                style={{
                                  backgroundColor: "#0162FF",
                                  position: "absolute",
                                  bottom: 0,
                                  left: 80,
                                }}
                              >
                                Create Clients
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
              </>
            )}
            

            {vpnPage === true && (
              <>
                <div className="min-h-screen">
                  <h1 className="border-b border-gray-700 gap-4 pb-4 ml-6 mt-10 text-start text-2xl font-bold leading-none tracking-normal text-gray-100 md:text-2xl md:tracking-tight">
                    <span className="text-white">My VPN Clients</span>
                  </h1>

                  <h1 className="flex justify-between gap-4 mb-8 ml-6 mt-0 text-start text-lg font-semibold leading-none tracking-normal text-gray-100 md:text-xl md:tracking-tight">
                    <div className="text-left text-white mt-4 flex gap-4">
                      <img
                        src={`${"https://nftstorage.link/ipfs"}/${imageSrc}`}
                        className="w-14 rounded-full"
                      />
                      <div className="mt-2">Name - {collectionName}</div>
                    </div>

                    <div className="text-white mr-40 mt-6">
                      <button
                        style={{ border: "1px solid #0162FF" }}
                        onClick={() => {
                          setcollectionsPage(true);
                          setvpnPage(false);
                        }}
                        className="px-4 py-3 text-xs font-semibold rounded-full w-full"
                      >
                        View Subscriptions
                      </button>
                    </div>
                  </h1>

                  {buttonset && (
                    <>
                      <div
                        style={{ backgroundColor: "#222944E5" }}
                        className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                        id="popupmodal"
                      >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto w-3/4"
                            style={{
                              backgroundColor: "#202333",
                              border: "1px solid #0162FF",
                            }}
                          >
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                              <button
                                onClick={() => {
                                  setbuttonset(false);
                                }}
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
                            <section className="">
                              <div className="mx-auto max-w-3xl">
                                <div className="w-full mx-auto text-left px-10 pb-10">
                                  <h1 className="text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white text-center">
                                      Create your client
                                    </span>
                                  </h1>

                                  <form
                                    id="myForm"
                                    className="rounded pt-10"
                                    onSubmit={handleSubmit}
                                  >
                                    <div className="mb-10">
                                      <div className="">
                                        <div className="mb-4 w-full">
                                          <input
                                            type="text"
                                            id="name"
                                            style={border}
                                            className="shadow border appearance-none rounded-full w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                          />
                                        </div>

                                        <div className="mb-4 w-full">
                                          <select
                                            id="region"
                                            style={border}
                                            className="shadow border appearance-none rounded-full w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            required
                                          >
                                            <option
                                              className="bg-white text-black"
                                              value=""
                                            >
                                              Select Region
                                            </option>

                                            {activeNodesData.map((node) => (
                                              <option
                                                key={node.id}
                                                className="bg-white text-black"
                                                value={node.id}
                                              >
                                                {node.region}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      <div className="flex-col gap-4 mr-4">
                                        <div className="text-center w-1/2 mt-10 mx-auto">
                                          <div className="mb-4 md:mb-8">
                                            <button
                                              style={{
                                                backgroundColor: "#0162FF",
                                              }}
                                              type="submit"
                                              value="submit"
                                              className="py-3 mb-2 text-md text-white font-semibold rounded-full w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                                            >
                                              Create Client
                                            </button>
                                          </div>
                                        </div>
                                        <p className="text-red-500">{msg}</p>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {verify && (
                    <div
                      style={{ backgroundColor: "#040819D9" }}
                      className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                      id="popupmodal"
                    >
                      <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div
                          className="relative rounded-3xl shadow dark:bg-gray-700 w-3/4 mx-auto"
                          style={{
                            backgroundColor: "#202333",
                            border: "1px solid #0162FF",
                          }}
                        >
                          <div className="py-4 space-y-4 mt-4">
                            <p className="text-3xl text-center font-semibold text-white">
                              Successfully created!
                            </p>

                            <div className="flex w-full flex-col items-center justify-center">
                              <div className="bg-white mx-auto my-4 w-1/2 justify-center flex h-60 rounded-3xl">
                                <div className="mt-4">
                                  <QRCode value={ConfigFile} size={200} />
                                </div>
                              </div>

                              <div className="text-center text-white text-sm w-2/3 mt-2">
                                Open{" "}
                                <Link
                                  href="https://www.wireguard.com/"
                                  target="_blank"
                                  style={{ color: "#5696FF" }}
                                >
                                  WireGaurd
                                </Link>
                                &nbsp;app on mobile, scan the QR code to add a
                                new connection, and instantly connect to Erebrus
                                VPN.
                              </div>

                              <div className="flex gap-4">
                                <button
                                  className="text-md rounded-lg text-white flex btn bg-blue-gray-700"
                                  onClick={() => {
                                    const blob = new Blob([ConfigFile], {
                                      type: "text/plain;charset=utf-8",
                                    });
                                    saveAs(blob, `${VpnName}.conf`);
                                  }}
                                >
                                  <div
                                    className="flex cursor-pointer p-2 rounded-full mt-4 gap-2 px-20"
                                    style={{
                                      backgroundColor: "#0162FF",
                                    }}
                                  >
                                    <div style={{ color: "white" }}>
                                      Download
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center pb-10 rounded-b w-1/2 mx-auto">
                            <button
                              style={button}
                              onClick={() => {
                                setbuttonset(false);
                                setverify(false);
                                setMsg("");
                              }}
                              type="button"
                              className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              My VPN Clients
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div
                      style={{ backgroundColor: "#040819D9" }}
                      className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                      id="popupmodal"
                    >
                      <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
                        <div className="relative rounded-lg shadow">
                          <div className="flex justify-center gap-4">
                            <img
                              className="w-12 animate-spin duration-[3000] h-12"
                              src="/Loadingerebrus.png"
                              alt="Loading icon"
                            />

                            <span className="text-white mt-2">Loading...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!buttonset && (
                    <>
                      <section className="pb-10 rounded-xl">
                        {
                          loading ? (
                            // <Loader />
                            <div className="min-h-screen"></div>
                          ) : projectsData && projectsData?.length !== 0 ? (
                            // (!dedicatedVpnData ||
                            //   dedicatedVpnData?.length == 0) && (
                            <div className="mx-6 -mt-20">
                              <div className="flex gap-4">
                                <div className="ml-auto text-white">
                                  <button
                                    style={{
                                      // border: "1px solid #11D9C5",
                                      backgroundColor: "#0162FF",
                                    }}
                                    onClick={() => setbuttonset(true)}
                                    className="px-4 py-3 mb-2 text-xs font-semibold rounded-full w-full sm:mb-0"
                                  >
                                    Add More Clients
                                  </button>
                                </div>
                              </div>

                              <div
                                className="w-full h-full rounded-xl mt-10 pb-2"
                                style={bg}
                              >
                                <div className="pt-4 pb-4 flex justify-between">
                                  <div className="ml-8 text-white text-2xl">
                                    My Clients
                                  </div>
                                  <a
                                    href="https://docs.netsepio.com/erebrus/erebrus/setup"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mr-8 underline"
                                    style={{ color: "#5696FF" }}
                                  >
                                    How to Start Using Erebrus VPN
                                  </a>
                                </div>

                                <div className="w-full flex justify-between px-14 p-4">
                                  <h3 className="text-lg leading-12 w-1/4 text-left">
                                    <div style={text}>Id</div>
                                  </h3>

                                  <div className="text-start w-1/4">
                                    <div>
                                      <div className="text-lg " style={text}>
                                        Name
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="text-lg text-center w-1/4"
                                    style={text}
                                  >
                                    Region
                                  </div>

                                  <div
                                    className="text-lg flex w-1/4 justify-end"
                                    style={text}
                                  >
                                    <p>Actions</p>
                                  </div>
                                </div>
                                <MyVpnContainer
                                  metaDataArray={projectsData}
                                  MyReviews={false}
                                  onChildValue={handleChildValue}
                                />
                              </div>
                              {note && (
                                <div
                                  className="fixed bottom-0 right-0 w-1/4 px-8 pt-4 pb-8 text-left"
                                  style={{ backgroundColor: "#C7DCFF" }}
                                >
                                  <div className="flex items-center justify-end rounded-t dark:border-gray-600">
                                    <button
                                      onClick={() => {
                                        setnote(false);
                                      }}
                                      type="button"
                                      className="text-black bg-transparent hover:bg-gray-800 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                      <span className="sr-only">
                                        Close modal
                                      </span>
                                    </button>
                                  </div>
                                  <div className="text-lg font-bold">
                                    Quick Reminder
                                  </div>
                                  <div className="text-sm py-4">
                                    Backup your WireGuard VPN config now!
                                    Download or scan the QR code to avoid
                                    re-setup for Erebrus VPN
                                  </div>
                                  <button
                                    className="py-2 px-10 text-white rounded-full"
                                    style={{ backgroundColor: "#0162FF" }}
                                  >
                                    <Link
                                      href="https://www.wireguard.com/"
                                      target="_blank"
                                    >
                                      Download
                                    </Link>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <img
                                src="/create.png"
                                className="mx-auto -mt-10"
                              />

                              <div className="p-2 md:p-5 space-y-4">
                                <p className="text-2xl text-center font-semibold text-white">
                                  Ready for Enhanced security? <br></br>
                                  Create Your VPN Client, Start Safe Surfing
                                  Today!
                                </p>
                                <p className="text-md text-center w-full mx-auto">
                                  You have minted your Erebrus NFT, welcome to
                                  an exclusive journey of innovation and
                                  community. To set clients, click button to go
                                  to subscription page.
                                </p>
                                <button
                                  style={{
                                    // border: "1px solid #11D9C5",
                                    backgroundColor: "#0162FF",
                                  }}
                                  onClick={() => setbuttonset(true)}
                                  className="py-4 text-md rounded-full w-1/6 text-white"
                                >
                                  Create Client now
                                </button>
                              </div>
                            </>
                          )
                          // )
                        }

                        {loading && (
                          <div
                            style={{ backgroundColor: "#040819D9" }}
                            className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                            id="popupmodal"
                          >
                            <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
                              <div className="relative rounded-lg shadow">
                                <div className="flex justify-center gap-4">
                                  <img
                                    className="w-12 animate-spin duration-[3000] h-12"
                                    src="/Loadingerebrus.png"
                                    alt="Loading icon"
                                  />

                                  <span className="text-white mt-2">
                                    Loading...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscription;
