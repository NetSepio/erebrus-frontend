import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import CryptoPrice from "../components/price conversion/price";
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const Plans = () => {
  const [trialbuytrue, settrialbuytrue] = useState(false);
  const [chainSym, setChainSymbol] = useState('');
  const [erebrusWallet, setErebrusWallet] = useState(null);
  const [displayText, setDisplayText] = useState('1.11 APT/3 months');
  const [displayText2, setDisplayText2] = useState(' Pay by APT, crytocurrency or Fiat');
  const [usdPrice, setUsdPrice] = useState('');
 
  const chainSymbol = Cookies.get('Chain_symbol');
  useEffect(() => {
    const chainSym = Cookies.get('Chain_symbol');
    const wallet = Cookies.get('erebrus_token');
    
    setChainSymbol(chainSym);
    setErebrusWallet(wallet);

    if (wallet) {
      if (chainSym === 'sui') {
        setDisplayText('4.91 SUI/ 3 month');
        setDisplayText2(' Pay by SUI, cryptocurrency or Fiat')
      } else if (chainSym === 'evm') {
        setDisplayText('0.0019 ETH/ 3 month');
        setDisplayText2(' Pay by ETH, cryptocurrency or Fiat')
      } else if (chainSym === 'peaq') {
        setDisplayText('0.0019 KRST/ 3 month');
        setDisplayText2(' Pay by KRST, cryptocurrency or Fiat')
      } else if (chainSym === 'sol') {
        setDisplayText('0.035 SOL/ 3 month');
        setDisplayText2(' Pay by SOL, cryptocurrency or Fiat')
      } else if (chainSym === 'google') {
        setDisplayText('$ 15/ 3 month');
        setDisplayText2(' Pay by dollars, cryptocurrency or Fiat')
      } else if (chainSym === 'apt') {
        setDisplayText('1.11 APT/ 3 month');
        setDisplayText2(' Pay by APT, cryptocurrency or Fiat')
        // Fetch the current APT price and calculate USD equivalent
        fetchAptPrice();
      }
    }
  }, []);
  
  const fetchAptPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd');
      const data = await response.json();
      const aptPrice = data.aptos.usd;
      const usdEquivalent = (1.11 * aptPrice).toFixed(2);
      setUsdPrice(usdEquivalent);
    } catch (error) {
      console.error('Error fetching APT price:', error);
      setUsdPrice('N/A');
    }
  };

  const trialbuy = async () => {
    const auth = Cookies.get("erebrus_token");
    try {
      const response = await fetch(
        `${EREBRUS_GATEWAY_URL}api/v1.0/subscription/trial`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          // body: jsonData,
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("trial subsc response", responseData);
        settrialbuytrue(true);
        // for alert
        setTimeout(() => {
          window.location.href = "/subscription";
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  return (
    <>
    <div className="mt-10 mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center text-3xl sm:text-4xl text-white">
        Subscription
      </div>
  
      <div className="mt-10 mx-auto flex justify-center">
        <div className="bg-[#202333E5] rounded-[40px] p-6 sm:p-8 md:p-10 w-full max-w-md border-[2px] border-[#0162FF] text-white">
          <h2 className="text-xl sm:text-2xl text-[#5696FF] mb-4">Standard</h2>
          <CryptoPrice />
          {chainSym !== 'apt' ? (
              <p className="text-lg sm:text-xl font-light mb-4">$5.99/month</p>
            ) : (
              <p className="text-lg sm:text-xl font-light mb-4">${usdPrice}/month</p>
            )}
          <button className="bg-[#0162FF] text-white rounded-lg px-6 py-2 mb-4 w-2/8">
      7 days Free trial
      </button>
          <div className="flex gap-3 w-5/6 mb-4">
  <button className="bg-white text-black rounded py-1 text-sm flex-1 md:w-2/5 lg:w-2/3">
    Pay with Crypto
  </button>
  <button
  className="bg-white text-black rounded text-sm py-1 flex-1 md:w-3/5 lg:w-4/5 opacity-50 cursor-not-allowed"
  disabled
>
  Pay with Credit Card
</button>

</div>
  
          <ul className="space-y-2 text-sm sm:text-base">
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              Decentralized Wi-Fi (Pay for what you use)
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              Decentralized VPN
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              Cyber threat analysis in browser extension
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              Access and submit reviews
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              AI insights, web summary & critical alerts
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-2"></span>
              Mobile app
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6">
            <button
              className="border-2 border-[#0162FF] text-white text-base sm:text-lg bg-transparent px-4 py-2 rounded-[10px] w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#0162FF] focus:ring-offset-2"
              onClick={trialbuy}
            >
              Start Free Trial
            </button>
            <button
              className="bg-white text-black text-base sm:text-lg border-2 border-white px-4 py-2 rounded-[10px] w-full sm:w-1/2 focus:outline-none"
            >
              <Link href="/mint">
                Mint NFT Now
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
    {trialbuytrue && (
      <div className="fixed z-50 top-0 w-full">
        <div className="bg-blue-100 text-blue-700 px-4 py-3" role="alert">
          <p className="font-bold">Successfully Trial Subscription Taken!</p>
          <p className="text-sm">
            You are redirected to subscription page to view your current
            subscription plan and to create clients.
          </p>
        </div>
      </div>
    )}
  </>
  );
};

export default Plans;
