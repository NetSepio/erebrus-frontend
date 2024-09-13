import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import { BrowserView, MobileView } from 'react-device-detect';
import axios from 'axios';

const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

const BaliDVPNNFTPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleGoClick = async () => {
    setIsLoading(true);
    
    setTimeout(async () => {
      try {
        const result = await axios.post(`${REACT_APP_GATEWAY_URL}api/v1.0/dvpnnft/chain=evm`, {
          wallet_address: walletAddress
        });
        setResponse(result.data);
        setError(null);
        
        if (result.data && result.data.transaction_hash) {
          setShowPopup(true);
        } else if (result.status === 302) {
          setShowPopup(true);
          setResponse({ alreadyMinted: true });
        }
      } catch (err) {
        if (err.response && err.response.status === 302) {
          setShowPopup(true);
          setResponse({ alreadyMinted: true });
        } else {
          setError('An error occurred while processing your request.');
          setResponse(null);
        }
      } finally {
        setIsLoading(false);
      }
    }, 3000); // 3 second delay
  };

  const renderLoadingAnimation = () => {
    if (!isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className=" bg-transparent p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Processing...</p>
        </div>
      </div>
    );
  };
  const renderResponse = () => {
    if (error) {
      return <p className="text-red-500 mt-4">{error}</p>;
    }


    if (response && !response.alreadyMinted) {
      return (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Response:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  };

  const renderPopup = () => {
    if (!showPopup) return null;
  
    const isAlreadyMinted = response && response.alreadyMinted;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-4">
              {isAlreadyMinted ? (
                <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isAlreadyMinted ? "Already Minted" : "Success!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAlreadyMinted 
                ? "You have already minted an NFT with this wallet address."
                : "Your transaction was successful."}
            </p>
            {!isAlreadyMinted && (
              <div className="bg-gray-100 p-3 rounded-lg mb-6">
                <p className="text-sm font-medium text-gray-500">Transaction Hash:</p>
                <p className="text-xs text-gray-700 break-all">{response.transaction_hash}</p>
                <p className="text-gray-600 mb-6">
                You can view these NFTs at{' '}
                <a 
                  href="https://element.market/collections/erebrus-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 und  erline"
                >
                  element.market
                </a>
              </p>
              </div>
            )}
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <MobileView>
        <div className="flex flex-col justify-center items-center h-screen mt-10 bg-black p-4">
      <div className="text-center text-white mb-10">
        <h2 className="text-2xl ">Mint Your FREE Bali ÐVPN NFT</h2>
        <p className='text-2xl'>Secure, Private, Exclusive</p>
      </div>

      <input
        type="text"
        placeholder="enter wallet address"
        value={walletAddress}
        onChange={handleWalletAddressChange}
        className="border border-gray-300 px-4 py-2 rounded-md w-3/4 max-w-md mb-10 text-xl text-center"
      />
      
      <button
            onClick={handleGoClick}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-full text-xl mb-6"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'GO'}
          </button>
{renderResponse()}
      <div className="w-full max-w-xs my-10">
        <img src="/bali-dvpn-nft.jpeg" alt="Erebrus DVPN" className="rounded-lg" />
      </div>
      {renderPopup()}
      </div>
    </MobileView>
    <BrowserView>
    <div className='mx-20 mt-10'>
          <h1 className="text-5xl text-white mb-3 text-left">
            Mint Your FREE Bali DVPN NFT
          </h1>
        </div>
        <div className="min-h-screen flex items-center justify-center mx-20">
          <div className="flex w-full h-full">
            <div className="flex-1">
              <img 
                src="/bali-dvpn-nft.jpeg" 
                alt="Erebrus DVPN"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 bg-[#4D9FCB] flex flex-col items-center pt-20 p-6">
              <h2 className="text-6xl text-white mb-20 text-center">
                Secure, Private, Exclusive
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); handleGoClick(); }}>
                <p className="text-black text-3xl mb-16">
                  Enter your wallet address and click GO
                </p>
                <div className='text-center mb-10'>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletAddressChange}
                    placeholder="wallet address"
                    className="w-2/3 p-2 rounded text-2xl text-center mb-4"
                  />
                </div>
                <div className='text-center'>
                <button
              type="submit"
              className="bg-[#1C126C] text-3xl text-white px-6 py-3 rounded-[40px] font-semibold hover:bg-indigo-600 transition duration-300"
              onClick={handleGoClick}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'GO'}
            </button>
            {renderResponse()}
                </div>
              </form>
              {renderPopup()}
            </div>
          </div>
        </div>

   </BrowserView>
   {renderLoadingAnimation()}
   
   <Footer/>
   </>
  );
};

export default BaliDVPNNFTPage;
