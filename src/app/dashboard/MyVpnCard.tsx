"use client";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';

const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

interface ReviewCardProps {
  metaData: {
    created_at: string;
    UUID: string;
    name: string;
    region: string;
    walletAddress: number;
  } | null;
}

const backgroundbutton = {
  backgroundColor: "#0162FF",
};

const MyVpnCard: React.FC<ReviewCardProps> = ({ metaData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [delvpn, setdelvpn] = useState(false);
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
      <div className="flex flex-col items-center justify-center w-full mx-auto py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        <p className="text-white mt-4">Loading VPN details...</p>
      </div>
    );
  }

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
    const key = `${walletAddress}-${pin}`;
    const bytes = CryptoJS.AES.decrypt(encryptedBlobId, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const deletevpn = async (id: string) => {
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

      if (response.status === 200) {
        setdelvpn(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-2">
      <div
        className="rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
        style={{ backgroundColor: "#1a1d2e" }}
      >
        <div className="w-full p-4">
          <div className="flex flex-col lg:flex-row md:flex-row justify-between items-center gap-4">
            <div className="text-white text-sm lg:text-base font-medium">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gray-800 px-4 py-2 rounded-full text-white font-medium">
                {metaData.name}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
                <span className="text-white mr-2">{metaData.region}</span>
                <img src={`https://flagsapi.com/${metaData.region}/shiny/64.webp`} className="w-6 h-6" alt={`${metaData.region} flag`} />
              </div>
            </div>

            <div className="flex gap-3">
             
              <button
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 transition-colors p-2 rounded-full"
                onClick={() => setdelvpn(true)}
                title="Delete VPN"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {delvpn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="relative w-full max-w-md mx-4">
            <div
              className="relative rounded-xl shadow-lg p-6"
              style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
            >
              <div className="mb-6">
                <p className="text-2xl text-center text-white font-bold">
                  Are you sure?
                </p>
                <p className="text-sm text-center text-gray-400 mt-2">
                  Do you really want to delete this client? This process cannot
                  be undone.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  style={{ border: "1px solid #5696FF"}}
                  onClick={() => setdelvpn(false)}
                  type="button"
                  className="w-full text-white font-medium focus:ring-4 focus:outline-none focus:ring-blue-800 rounded-full text-sm px-5 py-2.5 text-center hover:bg-blue-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  style={backgroundbutton}
                  onClick={() => deletevpn(metaData.UUID)}
                  type="button"
                  className="w-full text-white font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-5 py-2.5 text-center hover:bg-blue-700 transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="relative w-full max-w-md mx-4">
            <div
              className="relative rounded-xl shadow-lg p-6"
              style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
            >
              <div className="mb-6">
                <p className="text-xl text-center text-white font-bold">
                  Enter PIN to Download
                </p>
                <div className="mt-4">
                  <input
                    type="password"
                    value={downloadPin}
                    onChange={(e) => setDownloadPin(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit PIN"
                    className="w-full p-2 rounded-md text-black bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  style={{ border: "1px solid #5696FF"}}
                  onClick={() => setShowDownloadModal(false)}
                  type="button"
                  className="w-full text-white font-medium focus:ring-4 focus:outline-none focus:ring-blue-800 rounded-full text-sm px-5 py-2.5 text-center hover:bg-blue-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  style={backgroundbutton}
                  onClick={downloadConfig}
                  type="button"
                  className="w-full text-white font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-5 py-2.5 text-center hover:bg-blue-700 transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 border-blue-200"></div>
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVpnCard;