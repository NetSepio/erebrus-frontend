"use client";
import React, { useState , useEffect} from "react";
import { saveAs } from "file-saver";
import { FaDownload, FaQrcode } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import QrCode from "./qrCode";
import dlt from "../public/dlt.png";
import Image from "next/image";
import Link from "next/link";
import CryptoJS from 'crypto-js';

import DownloadFromWalrusButton from "./walrus/DownloadFromWalrusButton";
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

interface ReviewCardProps {
  metaData: {
    created_at: string;
    UUID: string;
    name: string;
    region: string;
    walletAddress: number;
  } | null;
  MyReviews?: boolean;
  // review?: ReviewCreated;
  onReviewDeleted?: () => void;
  onChildValue: (value: string) => void;
}

const background = {
  backgroundColor: "#222944",
};

const color = {
  color: "#788AA3",
};

const color2 = {
  color: "#11D9C5",
};

const border = {
  border: "1px solid #11D9C5",
};

const backgroundbutton = {
  backgroundColor: "#0162FF",
};

const handleDownload = async (
  clientId: string,
  name: string,
  region: string
) => {
  try {
    const auth = Cookies.get("erebrus_token");

    const response = await axios.get(
      `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/config/${region}/${clientId}`,
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    console.log(response);
    const config = response.data;
    const blob = new Blob([config], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${name}.conf`);
  } catch (error) {}
};

const MyVpnCard: React.FC<ReviewCardProps> = ({
  metaData,
  MyReviews = false,
  onReviewDeleted,
  onChildValue
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [delvpn, setdelvpn] = useState(false);
  const [qr, setqr] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadPin, setDownloadPin] = useState('');

  useEffect(() => {
    if (metaData) {
      const date = new Date(metaData.created_at);
      setFormattedDate(date.toLocaleString());
    }
  }, [metaData]);

  
  if (!metaData) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div
          className="w-full h-72 p-5 bg-center bg-cover"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="animate-spin rounded-full h-32 w-32 mx-auto border-t-2 border-b-2 border-green-200"></div>
        </div>
      </div>
    );
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    setShowDescription(!showDescription);
  };

  const handleDelete = () => {
    if (onReviewDeleted) {
      onReviewDeleted(); // Call the callback function when a review is deleted
    }
  };
  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  const downloadConfig = async () => {
    if (downloadPin.length !== 6) {
      alert('Please enter a valid 6-digit PIN');
      return;
    }
  
    try {
      const auth = Cookies.get("erebrus_token");
      const walletAddress = Cookies.get('erebrus_wallet') || '';
  
      if (!walletAddress) {
        throw new Error('Wallet address not found');
      }
  
      // Fetch the encrypted blobId from Erebrus
      const response = await axios.get(
        `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/client/${metaData.UUID}/blobId`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
  
      const encryptedBlobId = response.data.payload.blobId;
      const decryptedBlobId = decryptBlobId(encryptedBlobId, walletAddress, downloadPin);
  
      // Fetch the config from Walrus
      const walrusResponse = await axios.get(
        `https://aggregator-devnet.walrus.space/v1/${decryptedBlobId}`,
        { responseType: 'blob' }
      );
  
      // Download the config file
      const blob = new Blob([walrusResponse.data], { type: 'text/plain' });
      saveAs(blob, `${metaData.name}.conf`);
  
      setShowDownloadModal(false);
      setDownloadPin('');
    } catch (error) {
      console.error('Error downloading config:', error);
      alert('Failed to download config. Please check your PIN and try again.');
    }
  };
  
  const decryptBlobId = (encryptedBlobId: string, walletAddress: string, pin: string) => {
    const key = `${walletAddress}-${pin}`; // Reconstruct the key
    const bytes = CryptoJS.AES.decrypt(encryptedBlobId, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const deletevpn = async (id: string, region: string) => {
    setLoading(true);

    const auth = Cookies.get("erebrus_token");

    try {
      const response = await fetch(
        `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/client/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        console.log("success");
        setdelvpn(false);
        onChildValue("refreshdataafterdelete");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <div className="w-full">
      <div
        className="w-full h-full lg:px-10 md:px-10 lg:py-4 md:py-4 p-4 border-t border-gray-500"
        style={{ backgroundColor: "#202333" }}
      >
        <div className="w-full px-4 flex justify-between">
          <div className="text-l leading-12 font-bold mb-2 text-white w-1/4">
            <div className="flex">
              <div>
                {/* {metaData.UUID.slice(0, 4)}...{metaData.UUID.slice(-4)} */}
                {formattedDate}
              </div>
            </div>
          </div>

          <div className="lg:flex md:flex justify-between w-1/4">
            <div>
              <div className="text-lg rounded-lg pr-1 text-white">
                <div>{metaData.name}</div>
              </div>
            </div>
          </div>


          <div className="text-white text-lg w-1/4 btn bg-blue-gray-700 text-center">
            <div className="flex gap-4 justify-center">
                <div>
                  {metaData.region} 
                </div>
                <img src={`https://flagsapi.com/${metaData.region}/shiny/64.png`} className="w-10"/>
            </div>
          </div>

       


          <div className="flex gap-4 w-1/4 justify-end">
        <button
          className="text-lg rounded-lg"
          onClick={handleDownloadClick}
        >
          <FaDownload className="w-5 h-5 text-white" />
        </button>
        <button
          className="text-lg rounded-lg"
          onClick={() => setdelvpn(true)}
        >
          <Image src={dlt} alt="info" className="w-5 h-5" />
        </button>
      </div>
        
        </div>
      </div>
      {qr && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative lg:w-1/3 w-full max-w-2xl max-h-full">
            <div
              className="relative rounded-lg shadow dark:bg-gray-700 p-6"
              style={{ backgroundColor: "#445088" }}
            >
              <div className="p-4 md:p-5 flex">
                <p className="text-2xl text-center text-white">Scan QR Code</p>
                <button
                  onClick={() => setqr(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <QrCode
                clientId={metaData.UUID}
                name={metaData.name}
                region={metaData.region}
              />
              <div className="text-gray-300 mb-4">
                On your mobile, open the WireGuard app, and use the option to
                add a new connection by scanning a QR code. After scanning, the
                app will import the configuration. You can then connect to
                Erebrus VPN through the WireGuard app.
              </div>
              <Link
                href="https://www.wireguard.com/"
                target="_blank"
                className="text-green-500 font-bold px-4 rounded-lg pb-2 pt-1"
                style={{ border: "1px solid white" }}
              >
                Wireguard
              </Link>
            </div>
          </div>
        </div>
      )}

      {delvpn && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative lg:w-1/3 w-full max-w-2xl max-h-full">
            <div
              className="relative rounded-3xl shadow dark:bg-gray-700 p-16 md:p-20"
              style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
            >
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-4xl text-center text-white font-bold">
                  Are you sure?
                </p>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-md text-center" style={color}>
                  Do you really want to delete this client? This process can not
                  be undone.
                </p>
              </div>
              <div className="flex items-center p-4 md:p-5 rounded-b gap-4">
                <button
                  style={{ border: "1px solid #5696FF"}}
                  onClick={() => setdelvpn(false)}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cancel
                </button>
                <button
                  style={backgroundbutton}
                  onClick={() => deletevpn(metaData.UUID, metaData.region)}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Delete
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
      {showDownloadModal && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="downloadModal"
        >
          <div className="relative lg:w-1/3 w-full max-w-2xl max-h-full">
            <div
              className="relative rounded-3xl shadow dark:bg-gray-700 p-16 md:p-20"
              style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
            >
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-2xl text-center text-white font-bold">
                  Enter PIN to Download
                </p>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <input
                  type="password"
                  value={downloadPin}
                  onChange={(e) => setDownloadPin(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit PIN"
                  className="w-full p-2 rounded-md text-black"
                />
              </div>
              <div className="flex items-center p-4 md:p-5 rounded-b gap-4">
                <button
                  style={{ border: "1px solid #5696FF"}}
                  onClick={() => setShowDownloadModal(false)}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cancel
                </button>
                <button
                  style={backgroundbutton}
                  onClick={downloadConfig}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div
        style={{ backgroundColor: "#040819D9" }}
        className='flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full'
        id='popupmodal'
      >
        <div className='relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full'>
          <div className='relative rounded-lg shadow'>
            <div className='flex justify-center gap-4'>
              <img
                className='w-12 animate-spin duration-[3000] h-12'
                src='/Loadingerebrus.png'
                alt='Loading icon'
              />
  
              <span className='text-white mt-2'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MyVpnCard;
