import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import QRCode from "qrcode.react";
import { useAddress } from "@thirdweb-dev/react";
import Navbar from "../components/Navbar";
import { ethers } from "ethers";
import erebrusABI from "../utils/erebrusABI.json";
import Head from "next/head";
import { AuthContext } from "../AuthContext";

const transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

export default function FormResultPage() {
  const provider = new ethers.providers.InfuraProvider(
    "maticmum",
    "bfa8e872ea014d979d17e288e0aea3e9"
  );
  const [isOwned, setIsOwned] = useState(false);
  const address = useAddress();
  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    walletAddress: useAddress(),
    publicKey: "",
    enable: true,
    allowedIPs: ["0.0.0.0/0", "::/0"],
    address: ["10.0.0.1/24"],
    createdBy: useAddress(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [configData, setConfigData] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);

  useEffect(() => {
    if (address) {
      setError("");
      setIsOwned(false);
      const contract = new ethers.Contract(
        "0xA40166F872CC568b34410672eF3667cbc1865340",
        erebrusABI,
        provider
      );
      contract.balanceOf(address).then((balance) => {
        if (Number(balance) > 0) {
          setIsOwned(true);
        }
      });
    }
  }, [address]);

  const handleTags = (e) => {
    setFormData({
      ...formData,
      tags: [e.target.value],
    });
  };

  const handleName = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    let UUID;
    let presharedKey;
    let DNS = "1.1.1.1";
    let persistentKeepalive = "16";
    let address;
    e.preventDefault();
    setLoading(true);
    try {
      // generate private key client-side
      let keyResponse;
      let formData2 = formData;
      await axios.get("/api/generateKeys").then((response) => {
        keyResponse = response.data;
        formData2.publicKey = keyResponse.publicKey;
      });

      // get token from session storage
      const token = sessionStorage.getItem("token");

      // register new client
      await axios
        .post("/api/registerClient", formData2, {
          headers: {
            "Content-Type": "application/json",
          },
          params: { token },
        })
        .then((response) => response.data)
        .then((data) => {
          UUID = data.client.UUID;
          presharedKey = data.client.PresharedKey;
          address = data.client.Address;
        })
        .catch((error) => {
          setError(error.message);
        });

      const configFile = `[Interface]
          Address = ${address}
          PrivateKey = ${keyResponse.privateKey}
          DNS = ${DNS}

          [Peer]
          PublicKey = fBPFyjWdHPPjvpMHjkFQfOgwrWAgHJE5xytdrRTMgWU=
          PresharedKey = ${presharedKey}
          AllowedIPs = 0.0.0.0/0, ::/0
          Endpoint = us01.erebrus.lz1.in:51820
          PersistentKeepalive = ${persistentKeepalive}`;

      console.log(keyResponse);
      console.log("private", keyResponse.privateKey);
      console.log("public", keyResponse.publicKey);
      console.log("preshared", presharedKey);

      console.log(configFile);

      setQrCodeData(configFile);

      // // Make another GET request to your server to get the data for the config file
      // const configResponse = await axios.get("/api/get-config-data");
      setConfigData(qrCodeData);

      // Show the result page
      setShowResult(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <>
        <Head>
          <title>Erebrus | Demo</title>
        </Head>
        <div className="flex justify-center mt-48 text-white bg-black h-screen">
          Please sign in to Erebrus to create a VPN client
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Erebrus | Demo</title>
      </Head>
      {isOwned ? (
        <div className="h-screen flex mx-auto items-start justify-center lg:items-center mt-8 lg:mt-0">
          {!showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div className="flex lg:flex-row flex-col justify-center items-center">
                <h2 className="font-bold text-4xl lg:text-6xl mb-8 text-gray-200 lg:w-[50%] w-[75%] lg:text-left text-center lg:mb-48">
                  Create a VPN Subscription
                </h2>
                <div>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleName}
                        required
                        className="mb-8"
                      />
                      <input
                        type="text"
                        name="tags"
                        placeholder="Tags: eg. mobile, tablet"
                        onChange={handleTags}
                        required
                        className="mb-4"
                      />
                      <p className="text-gray-500">Region: US-East</p>
                      <div className="mt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="text-white bg-blue-500 font-bold py-2 px-4 rounded-lg lg:mb-48"
                        >
                          Submit
                        </button>
                      </div>
                      {error && <p className="text-red-500">{error}</p>}
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <div>
                <div className="flex justify-center"></div>

                {error && <p className="text-red-500">{error}</p>}
                {qrCodeData && (
                  <div className="flex lg:flex-row flex-col justify-center items-center">
                    <button className="bg-blue-500 rounded-full lg:mr-24 mb-8 lg:mb-48">
                      <svg
                        className="text-white"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setShowResult(false)}
                      >
                        <path
                          d="M20 11H7.8L13.6 5.2L12 4L4 12L12 20L13.6 18.8L7.8 13H20V11Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <h2 className="font-bold text-2xl lg:text-4xl text-gray-200 lg:w-[30%] w-[75%] text-center lg:text-left mb-6 lg:ml-16 lg:mb-48">
                      Scan QR using the WireGuard® app and activate tunnel or
                      download .conf file to start using VPN 🎉
                      <p className="text-orange-400 lg:text-lg text-sm lg:w-[75%] mt-2">
                        * this qr code and .conf file contains your private key;
                        save it in a secure place.
                      </p>
                    </h2>

                    <div className="flex flex-col items-center justify-center text-white lg:ml-0 lg:mr-0">
                      <QRCode value={qrCodeData} />
                      <div className="mt-8 lg:mb-48">
                        <a
                          href={`data:application/octet-stream,${encodeURIComponent(
                            qrCodeData
                          )}`}
                          download="vpn.conf"
                          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Download config file
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex justify-center mt-48 text-white bg-black h-screen">
          Please mint an Erebrus NFT to create a VPN client
        </div>
      )}
    </>
  );
}
