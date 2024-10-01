import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import MyVpnContainer from "../components/Myvpncontainer";
import NftdataContainer from "../components/NftDataContainer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import dynamic from "next/dynamic";
import crypto from "crypto";
import { lib, enc } from "crypto-js";
import { generateKeyPair } from "curve25519-js";
import { Network } from "@aptos-labs/ts-sdk";
import Button from "../components/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
import SaveToWalrusButton from "../components/walrus/SaveToWalrusButton";
import DownloadFromWalrusButton from "../components/walrus/DownloadFromWalrusButton";
import FileStorage from "../components/walrus/FileStorage";
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
const envcollectionid = process.env.NEXT_PUBLIC_COLLECTIONID;
const graphqlaptos = process.env.NEXT_PUBLIC_GRAPHQL_APTOS;
import Login from "../components/loginComponent";
import UserNFTs from "../components/UserNFTs";
import fetchUserNFTs from "../components/UserNFTs";
import Mintbox from "../components/Mintbox";


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

const Subscription = () => {
  const [loading, setLoading] = useState<boolean>(true);
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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { account, connected, network, signMessage } = useWallet();
  const router = useRouter();
  const [clientUUID, setClientUUID] = useState<string>("");

  const [nftLoading, setNftLoading] = useState(true);
  const [nftError, setNftError] = useState(null);
  let sendable = isSendableNetwork(connected, network?.name);

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

  const [regionname, setregionname] = useState<string>("");
  

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleRegionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setregionname(value);
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

  const [isDataChecked, setIsDataChecked] = useState(false);
  const loggedin = Cookies.get("erebrus_token");
  const wallet = Cookies.get("erebrus_wallet");

  useEffect(() => {
    const chainSymbol = Cookies.get("Chain_symbol") || "sol";
    
    console.log("Redirection check:", {
      loggedin,
      loading,
      isDataChecked,
      nftLoading,
      nftdata: nftdata?.length,
      trialsubscriptiondata,
      chainSymbol,
      nftError
    });
  
    if (loggedin && !loading && isDataChecked && !nftLoading) {
      if (((nftdata && nftdata.length === 0) || !nftdata) && !trialsubscriptiondata && !nftError) {
        console.log("Conditions met for redirection to /plans");
        const redirectTimer = setTimeout(() => {
          console.log("Redirecting to /plans");
          router.push("/plans");
        }, 1000); // 1 second delay
  
        return () => clearTimeout(redirectTimer);
      } else {
        setLoading(false);
      }
    }
  }, [loggedin, loading, isDataChecked, nftLoading, nftdata, trialsubscriptiondata, nftError]);



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
        setClientUUID(responseData.payload.client.UUID);
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

        // Reset the form after successful creation
        resetForm();
        // Close the form modal
        setbuttonset(false);
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



  useEffect(() => {
    if (
      !loading &&
      nftdata !== undefined &&
      trialsubscriptiondata !== undefined
    ) {
      setIsDataChecked(true);
    }
  }, [loading, nftdata, trialsubscriptiondata]);

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
          const wallet = Cookies.get("erebrus_userid");
          const payload: any[] = response.data.payload;
          const filteredData = payload.filter(
            (item) => item?.userId === wallet
          );
          filteredData.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
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

  // const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   // Update the selected region when the dropdown value changes
  //   setregion(e.target.value);
  // };
  useEffect(() => {
    const fetchNFTs = async () => {
      if (wallet) {
        setNftLoading(true);
        setNftError(null);
        try {
          const chainSymbol = Cookies.get("Chain_symbol") || "sol"; // Default to "sol" if not set
          const nfts = await fetchUserNFTs(wallet, chainSymbol);
          setnftdata(nfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
          setNftError("Failed to fetch NFTs");
        } finally {
          setNftLoading(false);
        }
      }
    };

    fetchNFTs();
  }, [wallet]);
  

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return (window as any).aptos;
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
      const networkwallet = await (window as any).aptos.network();

      // Check if the connected network is Mainnet
      if (networkwallet === mynetwork) {
        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid?walletAddress=${account.address}`
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

        let signaturewallet = signature;

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

        try {
          const response = await axios(config);
          console.log("auth data", response.data);
          const token = await response?.data?.payload?.token;
          const userId = await response?.data?.payload?.userId;

          Cookies.set("erebrus_token", token, { expires: 7 });
          Cookies.set("erebrus_wallet", account.address, { expires: 7 });
          Cookies.set("erebrus_userid", userId, { expires: 7 });

          window.location.reload();
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

  useEffect(() => {
    const fetchMetaData = async () => {
      console.log("collectionImage", collectionImage);
      const ipfsCid = collectionImage?.replace("ipfs://", "");

      // Fetching metadata from IPFS
      const metadataResponse = await axios.get(
        `https://ipfs.io/ipfs/${ipfsCid}`
      );
      const metadata = metadataResponse.data;

      console.log("Metadata:", metadata);
      setImageSrc(metadata?.image.replace("ipfs://", ""));
    };
    fetchMetaData();
  }, [collectionImage]);

  // -----------------------------------------------to fetch regions from node data-----------------------------------------------

  const [nodesdata, setNodesData] = useState([]);
  const [activeNodesData, setActiveNodesData] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);

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
            (node) =>
              node.status === "active" &&
              node.region !== undefined &&
              node.region !== null &&
              node.region.trim()
          );
          setActiveNodesData(filteredNodes);

          // Extract and store unique regions
          const regions = Array.from(
            new Set(filteredNodes.map((node) => node.region))
          );
          setUniqueRegions(regions);

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
      setLoading(true);
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
        setLoading(false);
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
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedOption(null);
    setSelectedIndex(null);
    setregionname('');
  };


  const regiondata = [
    { id: "SG", region: "Singapore" },
    { id: "IN", region: "India" },
    { id: "US", region: "United States" },
    { id: "JP", region: "Japan" },
    { id: "CA", region: "Canada" },
    { id: "FI", region: "Finland" },
    { id: "GB", region: "United Kingdom" },
    { id: "AU", region: "Australia" },
    { id: "DE", region: "Germany" },
    // Add more nodes as needed
  ];
  //form
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionClick = (option) => {
    setSelectedOption(option); // Ensuring option is an object
    setFormData((prevData) => ({ ...prevData, region: option.id }));
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const generateSerialNumber = (region, index) => {
    const number = (index + 1).toString().padStart(3, "0");
    return `${region}${number}`;
  };

  const sliceNodeId = (nodeId) => {
    return `${nodeId.slice(0, 3)}...${nodeId.slice(-3)}`;
  };

  const sliceWalletAddress = (walletAddress) => {
    return `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}`;
  };

  // Log activeNodesData and filtered result
  console.log("Current activeNodesData:", activeNodesData);
  const filteredNodes = activeNodesData.filter(
    (node) => node.region === regionname
  );
  console.log("Filtered nodes based on region:", filteredNodes, regionname);

  if (!loggedin) {
    return (
      <>
        <div className="min-h-screen bg-[url('/subscriptionbg.png')] bg-cover flex flex-col justify-center items-center">
          <div className="text-white bg-transparent  font-medium text-4xl text-center">
            Subscribe and Unlock Full Access <br></br>
            Log in to Get Started
          </div>
          {/* <button
                  className="bg-blue-500 text-white font-bold py-4 px-10 rounded-lg mx-auto flex justify-center mt-10"
                  onClick={connectWallet}
                >
                  Login now
                </button> */}
          <div className="text-white font-bold pb-24 px-10 rounded-lg mx-auto flex justify-center ">
            {!connected && (
              <button className="">
                {/* <WalletSelectorAntDesign /> */}
                {/* <h1 className="text-[#9999] text-2xl">PLEASE LOGIN FIRST</h1> */}
                <button
                  className="bg-white text-black font-bold py-3 px-10 rounded-3xl mx-auto flex justify-center mt-10"
                  onClick={connectWallet}
                >
                  Login now
                </button>
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
            {collectionsPage === true && (
              <>
                <div className="text-2xl text-white font-semibold text-left ml-4 my-6 border-b border-gray-700 pb-4">
                  Subscription
                </div>
                {/* {!nftdata && !trialsubscriptiondata && !loading && (
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
                )} */}

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

<div className="flex justify-between">
<div className="w-1/2">
                  {nftdata && (
                    <div className="w-1/2">
                      <NftdataContainer
                  metaDataArray={nftdata}
                  MyReviews={false}
                  selectCollection={handleCollectionClick}
                  chainSymbol={Cookies.get("Chain_symbol") || "sol"} // Pass the chainSymbol here
                />
                    </div>
                  )}

                 


                  {trialsubscriptiondata && (
                    <div
                      className="lg:w-1/2  w-3/4 absolute rounded-3xl mt-2 mb-2 lg:relative min-h-96"
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
                                <div className="lg:flex md:flex justify-between ">
                                  <div className="text-md font-semibold mt-4 capitalize">
                                    Status :{" "}
                                    <span
                                      className={
                                        trialsubscriptiondata.status ===
                                        "active"
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }
                                    >
                                      {trialsubscriptiondata.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        trialsubscriptiondata.status.slice(1)}
                                    </span>
                                  </div>

                                  <div className="text-md font-light mt-4 ml-1">
                                    (Valid for 7 days)
                                  </div>
                                </div>
                              </h3>

                              <div className="rounded-xl">
                                <div className="text-sm text-white text-start mt-2">
                                  <div className="mb-3">
                                    <span className="text-white ">
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
                                    <span className="text-white">
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
                  <Mintbox/>
                  <div className="h-auto ">
                    <FileStorage />
                  </div>
                </div>
              </>
            )}

            {vpnPage === true && (
              <>
                <div className="min-h-screen">
                  <h1 className="border-b border-gray-700 gap-4 pb-4 ml-6 mt-10 text-start text-2xl font-bold leading-none tracking-normal text-gray-100 md:text-2xl md:tracking-tight">
                    <span className="text-white">My VPN Clients</span>
                  </h1>

                  <h1 className="flex flex-col md:flex-row justify-between gap-4 mb-8 ml-6 mt-0 text-start text-lg font-semibold leading-none tracking-normal text-gray-100 md:text-xl md:tracking-tight">
                    <div className="text-left text-white mt-4 flex gap-4 items-center">
                      {imageSrc ? (
                        <img
                          src={`${"https://nftstorage.link/ipfs"}/${imageSrc}`}
                          className="w-14 h-14 rounded-full"
                        />
                      ) : (
                        <img
                          src="subscriptionprofile.png"
                          className="w-14 h-14 rounded-full"
                        />
                      )}
                      <div className="mt-2 md:mt-0">
                        Name -{" "}
                        {collectionName ? collectionName : "Trial Subscription"}
                      </div>
                    </div>

                    <div className="text-white mt-4 md:mt-6 md:mr-40 flex justify-end">
                      <button
                        style={{ border: "1px solid #0162FF" }}
                        onClick={() => {
                          setcollectionsPage(true);
                          setvpnPage(false);
                        }}
                        className="px-4 py-3 text-xs font-semibold rounded-full w-full md:w-auto"
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
                            className="relative rounded-3xl shadow dark:bg-gray-700 mx-auto w-full lg:w-3/4"
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
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>
                            <section>
                              <div className="mx-auto max-w-3xl">
                                <div className="w-full mx-auto text-left px-6 md:px-10 pb-6 md:pb-10">
                                  <h1 className="text-2xl md:text-4xl font-semibold leading-none tracking-normal text-gray-100 md:tracking-tight">
                                    <span className="text-white text-center">
                                      Create your client
                                    </span>
                                  </h1>

                                  <form
                                    id="myForm"
                                    className="rounded pt-6 md:pt-10"
                                    onSubmit={handleSubmit}
                                  >
                                    <div className="mb-6 md:mb-10">
                                      <div>
                                        <div className="mb-4 w-full">
                                          <input
                                            type="text"
                                            id="name"
                                            className="shadow border border-gray-300 rounded-full w-full py-3 md:py-4 px-4 md:px-6 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter Client Name (Max 8 characters)"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            maxLength={8} // Limits input to 8 characters
                                            required
                                          />
                                        </div>

                                        <div className="mb-4 w-full relative">
                                          <select
                                            id="regionname"
                                            className="shadow border border-gray-300 rounded-full w-full py-3 md:py-4 px-4 md:px-6 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out appearance-none"
                                            value={regionname}
                                            onChange={handleRegionChange}
                                            required
                                          >
                                            <option
                                              className="bg-white text-black"
                                              value=""
                                            >
                                              Select Region
                                            </option>
                                            {regiondata.map((node) => (
                                              <option
                                                key={node.id}
                                                className="bg-white text-black"
                                                value={node.id}
                                              >
                                                {node.region}
                                              </option>
                                            ))}
                                          </select>
                                          <svg
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M19 9l-7 7-7-7"
                                            />
                                          </svg>
                                        </div>

                                        <div className="mb-4 w-full relative">
                                          <div
                                            className="p-4 bg-white border border-gray-300 rounded-full cursor-pointer flex items-center justify-between shadow hover:shadow-lg transition duration-150 ease-in-out"
                                            onClick={handleDropdownToggle}
                                          >
                                            {selectedOption ? (
                                              <div className="flex items-center">
                                                <span className="mr-2">
                                                  {generateSerialNumber(
                                                    regionname,
                                                    selectedIndex
                                                  )}
                                                  -
                                                </span>
                                                <span>
                                                  {sliceNodeId(
                                                    selectedOption.id
                                                  )}
                                                </span>
                                              </div>
                                            ) : (
                                              "Select Node ID"
                                            )}
                                            <svg
                                              className={`w-5 h-5 transform transition-transform ${
                                                isOpen
                                                  ? "rotate-180"
                                                  : "rotate-0"
                                              }`}
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                          </div>
                                          {isOpen && (
                                            <div className="absolute w-full mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                              <div className="grid grid-cols-4 p-2 font-bold bg-gray-200 text-gray-700">
                                                <div>S.No</div>
                                                <div>Node ID</div>
                                                <div>Wallet Address</div>
                                                <div>Chain</div>
                                              </div>
                                              {activeNodesData
                                                .filter(
                                                  (node) =>
                                                    node.region === regionname
                                                )
                                                .map((option, index) => (
                                                  <div
                                                    key={option.id}
                                                    className="grid grid-cols-4 p-2 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                                                    onClick={() => {
                                                      handleOptionClick(option);
                                                      setSelectedIndex(index); // Store the selected index
                                                    }}
                                                  >
                                                    <div>
                                                      {generateSerialNumber(
                                                        regionname,
                                                        index
                                                      )}
                                                    </div>
                                                    <div>
                                                      {sliceNodeId(option.id)}
                                                    </div>
                                                    <div>
                                                      {sliceWalletAddress(
                                                        option.walletAddress
                                                      )}
                                                    </div>
                                                    <div>
                                                      {option.chainName}
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex-col gap-4 mr-4">
                                        <div className="text-center w-full md:w-1/2 mt-6 md:mt-10 mx-auto">
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
                          className="relative rounded-3xl shadow dark:bg-gray-700 w-full max-w-lg mx-auto"
                          style={{
                            backgroundColor: "#202333",
                            border: "1px solid #0162FF",
                          }}
                        >
                          <div className="py-4 space-y-4 mt-4">
                            {/* Add cross icon */}
                            <button
                              onClick={() => {
                                setbuttonset(false);
                                setverify(false);
                                setMsg("");
                              }}
                              className="absolute top-4 right-4 text-white hover:text-gray-300"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>

                            <p className="text-3xl text-center font-semibold text-white mb-10">
                              Successfully created!
                            </p>

                            <div className="flex w-full flex-col items-center justify-center">
                              <div className="bg-white lg:mx-auto lg:my-4 lg:w-1/2  lg:p-0 p-3 justify-center flex h-60 rounded-3xl">
                                <div className="my-auto">
                                  <QRCode value={ConfigFile} size={200} />
                                </div>
                              </div>

                              <div className="text-center text-white text-xs font-light  w-2/3 mt-2">
                                Open{" "}
                                <Link
                                  href="https://www.wireguard.com/"
                                  target="_blank"
                                  style={{ color: "#5696FF" }}
                                >
                                  WireGaurd
                                </Link>
                                &nbsp;app on mobile, scan the QR code <br /> to
                                add a new connection, and instantly connect to
                                Erebrus VPN.
                              </div>

                              <div className="flex gap-4 w-3/4">
                                <button
                                  className="text-md rounded-lg text-white flex btn bg-blue-gray-700 flex-1"
                                  onClick={() => {
                                    const blob = new Blob([ConfigFile], {
                                      type: "text/plain;charset=utf-8",
                                    });
                                    saveAs(blob, `${VpnName}.conf`);
                                  }}
                                >
                                  <div
                                    className="flex cursor-pointer p-2 rounded-full mt-4 gap-2 justify-center w-full hover:opacity-80 mb-5"
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
                              <div className="flex items-center pb-10 rounded-b w-3/4">
                               <SaveToWalrusButton
                                  configFile={ConfigFile}
                                  vpnName={VpnName}
                                  clientUUID={clientUUID}
                                />
                                
                              </div>
                              
                            </div>
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
                            <div className="min-h-screen"></div>
                          ) : projectsData && projectsData?.length !== 0 ? (
                            <div className="mx-6 lg:-mt-20 ">
                              <div className="flex gap-4">
                                <div className="ml-auto text-white ">
                                  <button
                                    style={{
                                      backgroundColor: "#0162FF",
                                    }}
                                    onClick={() => setbuttonset(true)}
                                    className="px-4 py-3 mb-2 text-xs font-semibold rounded-full lg:w-full mx-auto  "
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
                                    <div style={text}>Created At</div>
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
                                    className="text-lg flex justify-end w-1/4"
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
                              <Image
                                src="/create.png"
                                alt="Create"
                                className="mx-auto lg:mt-5 mt-10 h-[200px] w-[200px] md:h-[250px] md:w-[250px]"
                                width={500} // Set an appropriate width
                                height={500} // Set an appropriate height
                              />

                              <div className="p-4 md:p-5 space-y-4">
                                <p className="text-lg md:text-2xl text-center font-semibold text-white">
                                  Ready for Enhanced security? <br />
                                  Create Your VPN Client, Start Safe Surfing
                                  Today!
                                </p>

                                <button
                                  style={{
                                    backgroundColor: "#0162FF",
                                  }}
                                  onClick={() => setbuttonset(true)}
                                  className="py-2 md:py-4 text-sm md:text-md rounded-full w-3/4 md:w-1/6 lg:mt-5 mx-auto block text-white"
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