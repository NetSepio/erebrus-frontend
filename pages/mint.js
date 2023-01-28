import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Navbar from "../components/Navbar";
import { ethers } from "ethers";
import erebrusABI from "../utils/erebrusABI.json";
import Head from "next/head";

const Mint = () => {
  const provider = new ethers.providers.InfuraProvider(
    "maticmum",
    "bfa8e872ea014d979d17e288e0aea3e9"
  );
  const address = useAddress();
  const [isOwned, setIsOwned] = useState(false);
  const [balance, setBalance] = useState(false);
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState(null);
  const [isMinted, setMinted] = useState(false);

  useEffect(() => {
    if (address) {
      const contract = new ethers.Contract(
        "0x3091EFF0b0a8E176D962456fc26110414704B01a",
        erebrusABI,
        provider
      );
      contract.balanceOf(address).then((balance) => {
        if (Number(balance) > 0) {
          setBalance(Number(balance));
          setIsOwned(true);
        }
      });
    }
  }, [address, isOwned]);

  const mint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      "0x3091EFF0b0a8E176D962456fc26110414704B01a",
      erebrusABI,
      signer
    );

    function clearError() {
      setError(null);
    }

    try {
      clearError();
      setLoadingTx(true);
      const tx = await contract.mintNFT({
        value: ethers.utils.parseEther("0.1"),
      });
      tx.wait().then((transaction) => {
        if (transaction.status === 1) {
          console.log("Transaction mined and confirmed");
          setLoadingTx(false);
          setMinted(true);
        } else {
          console.log("Transaction failed or rejected by the user");
          setLoadingTx(false);
          setError("Transaction failed or rejected by the user");
        }
      });
    } catch (error) {
      console.log(error);
      setLoadingTx(false);
      setError("Transaction failed or rejected by the user");
    }
  };

  if (!address) {
    return (
      <>
        <Head>
          <title>Erebrus | Clients</title>
        </Head>
        <Navbar />
        <div className="flex justify-center mt-48 text-white bg-black h-screen">
          Please connect your wallet to view your NFT
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Erebrus | Clients</title>
      </Head>
      <Navbar />
      {isOwned ? (
        <div className="h-screen text-white flex flex-col justify-center items-center -mt-16">
          {`Number of NFTs owned: ${balance}`}
          <img
            src="./image1.jpeg"
            alt="Mint Successful"
            className="w-64 h-64 mt-8 mb-8"
          ></img>
          {isLoadingTx ? (
            <div className="animate-spin text-white text-7xl">⛏</div>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                onClick={mint}
              >
                Mint Erebrus NFT
              </button>
              {error && <div className="text-red-500 mt-4">{error}</div>}
            </>
          )}
        </div>
      ) : (
        <div className="h-screen text-white flex flex-col justify-center items-center">
          {isLoadingTx ? (
            <div className="animate-spin text-white text-7xl">⛏</div>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                onClick={mint}
              >
                Mint Erebrus NFT
              </button>
              {error && <div className="text-red-500 mt-4">{error}</div>}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Mint;