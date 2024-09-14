import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; // For encryption

interface SaveToWalrusButtonProps {
  configFile: string;
  vpnName: string;
  clientUUID: string;
}

const SaveToWalrusButton: React.FC<SaveToWalrusButtonProps> = ({ configFile, vpnName, clientUUID }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  // Encryption function using wallet address and PIN
  const encryptBlobId = (blobId: string, walletAddress: string, pin: string) => {
    const key = `${walletAddress}-${pin}`; // Combine wallet address and PIN for encryption key
    return CryptoJS.AES.encrypt(blobId, key).toString(); // Encrypt the blobId
  };

  // Open modal to enter the PIN
  const handleSave = async () => {
    setIsPinModalOpen(true); // Open the modal
  };

  // Function to save to Walrus and update Erebrus with encrypted blobId
  const saveToWalrus = async () => {
    if (pin.length !== 6) {
      alert('Please enter a valid 6-digit PIN');
      return;
    }

    if (pin !== confirmPin) {
      alert('PIN and confirmation PIN do not match');
      return;
    }

    setIsLoading(true);
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save to Walrus
      const walrusResponse = await axios.put(
        'https://publisher-devnet.walrus.space/v1/store',
        configFile,
        {
          params: { epochs: 5 },
          headers: { 'Content-Type': 'text/plain' },
        }
      );
      if (walrusResponse.data.alreadyCertified) {
        setSaveStatus('success');
        setPopupMessage('Configuration is already saved.');
        setShowPopup(true);
        return;
      }

      const blobId = walrusResponse.data.newlyCreated.blobObject.blobId;

      // Retrieve user's wallet address from cookies
      const walletAddress = Cookies.get('erebrus_wallet') || '';
      if (!walletAddress) {
        throw new Error('Wallet address not found');
      }

      // Encrypt blobId with wallet address and PIN
      const encryptedBlobId = encryptBlobId(blobId, walletAddress, pin);

      // Update encrypted blobId in Erebrus Gateway
      const erebrusGatewayUrl = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL || '';
      await axios.put(`${erebrusGatewayUrl}api/v1.0/erebrus/client/${clientUUID}/blobId`, 
        { blobId: encryptedBlobId },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('erebrus_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSaveStatus('success');
      setPopupMessage('Configuration saved successfully!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error saving to Walrus or updating blobId:', error);
      setSaveStatus('error');
      setPopupMessage('Failed to save configuration.');
      setShowPopup(true);
    } finally {
      setIsSaving(false);
      setIsPinModalOpen(false);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setSaveStatus('idle');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
         <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex-1 text-white border-2 border-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-5 text-center dark:bg-transparent dark:hover:opacity-80 dark:focus:ring-blue-800"
      >
        <div className="flex cursor-pointer p-2 rounded-full gap-2 justify-center w-full">
          {isSaving ? 'Saving...' : 'Save to Walrus'}
        </div>
      </button>

      {/* Status Popup */}
      {showPopup && (
        <div className="fixed bottom-5 right-5 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
             style={{
               backgroundColor: saveStatus === 'success' ? 'rgba(52, 211, 153, 0.9)' : 'rgba(248, 113, 113, 0.9)',
             }}>
          <div className="flex items-center">
            <div className="mr-3">
              {saveStatus === 'success' ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <p className="text-white font-semibold">
              {popupMessage}
            </p>
          </div>
        </div>
      )}
     {isLoading && (
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
      {/* Modal for PIN and Confirm PIN entry */}
      {isPinModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-30">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl mb-4 font-semibold text-gray-800">Secure Your Configuration</h2>
      <p className="text-amber-600 text-sm mb-4 font-medium bg-amber-50 p-3 rounded-md border border-amber-200">
        Important: This PIN is your key to accessing your saved configuration. 
        Please store it securely. If forgotten, you will need to create a new configuration.
      </p>
      <div className="mb-4">
        <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit PIN</label>
        <div className="relative">
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            placeholder="••••••"
            className="border border-gray-300 p-2 pl-10 pr-10 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
        <div className="relative">
          <input
            type="password"
            id="confirmPin"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            maxLength={6}
            placeholder="••••••"
            className="border border-gray-300 p-2 pl-10 pr-10 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => setIsPinModalOpen(false)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={saveToWalrus}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Configuration
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default SaveToWalrusButton;