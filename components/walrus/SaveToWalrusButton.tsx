import React, { useState } from 'react';
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
    } catch (error) {
      console.error('Error saving to Walrus or updating blobId:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setIsPinModalOpen(false); // Close the modal after saving
    }
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="text-md rounded-lg text-white flex btn bg-blue-500 hover:bg-blue-600 transition-colors duration-200 ease-in-out flex-1"
      >
        <div className="flex cursor-pointer p-2 rounded-full mt-4 gap-2 justify-center w-full">
          {isSaving ? 'Saving...' : 'Save to Walrus'}
        </div>
        {saveStatus === 'success' && <span className="text-green-500 ml-2">✓</span>}
        {saveStatus === 'error' && <span className="text-red-500 ml-2">✗</span>}
      </button>

      {/* Modal for PIN and Confirm PIN entry */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg mb-4">Enter PIN and Confirm PIN</h2>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              placeholder="Enter 6-digit PIN"
              className="border border-gray-300 p-2 rounded-md w-full mb-4"
            />
            <input
              type="text"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              maxLength={6}
              placeholder="Confirm PIN"
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveToWalrus}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaveToWalrusButton;
