import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const Plans = () => {
  const [trialbuytrue, settrialbuytrue] = useState(false);
  const [chainSym, setChainSymbol] = useState('');
  const [erebrusWallet, setErebrusWallet] = useState(null);
  const [displayText, setDisplayText] = useState('1.76 APT/ 3 month');
  const [displayText2, setDisplayText2] = useState(' Pay by APT, crytocurrency or Fiat');
 
  const chainSymbol = Cookies.get('Chain_symbol');
  useEffect(() => {
    const chainSym = Cookies.get('Chain_symbol');
    const wallet = Cookies.get('erebrus_token');
    
    setChainSymbol(chainSym);
    setErebrusWallet(wallet);

    if (wallet) {
      if (chainSym === 'sui') {
        setDisplayText('4.91 SUI/ 3 month');
        setDisplayText2(' Pay by SUI, crytocurrency or Fiat')
      } else if (chainSym === 'evm') {
        setDisplayText('0.00028 ETH/ 3 month');
        setDisplayText2(' Pay by ETH, crytocurrency or Fiat')
      }
      else if (chainSym === 'peaq') {
        setDisplayText('0.00028 KRST/ 3 month');
        setDisplayText2(' Pay by KRST, crytocurrency or Fiat')
      } else if (chainSym === 'sol') {
        setDisplayText('18.94 Sol/ 3 month');
        setDisplayText2(' Pay by SOL, crytocurrency or Fiat')
      }else if (chainSym === 'google') {
        setDisplayText('$ 15/ 3 month');
        setDisplayText2(' Pay by dollars, crytocurrency or Fiat')
      }
    }
  }, []);

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
      <div className="mt-10 mx-auto min-h-screen max-w-7xl">
        <div className="text-center text-4xl text-white">
          Subscription
        </div>

        <div className="lg:flex mt-10 mx-auto justify-center gap-10">
         {chainSymbol=="apt" || chainSymbol=="sol" &&( 
          
          <div className="bg-[#202333E5] rounded-3xl p-10 w-full border-[2px] border-[#0162FF] md:w-5/12 lg:w-4/12 text-white"
          >
          <h2 className="text-2xl font-semibold text-[#5696FF] mb-4">Tier 1 Subcription</h2>
          <p className="text-2xl  mb-4">{displayText}</p>
          <button className="bg-[#0162FF] text-white rounded-lg px-4 py-2 mb-4 w-2/3">
          Early Node Operator Access
          </button>
          <div className="flex gap-10 mb-4 w-1/2">
            <button className="bg-white text-black rounded  py-1 text-sm flex-1">
              Pay with Crypto
            </button>
            {/* <button className="bg-white text-black rounded  text-sm py-1 flex-1">
              Pay with Credit Card
            </button> */}
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              Limited collection of only 111
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              Tradable with VPN access benefits
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              Unlimited Clients
            </li>
            {/* <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              Access and submit reviews
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              AI insights, web summary & critical alerts
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              Mobile app
            </li> */}
          </ul>
          <button className="bg-[#0162FF] text-white  px-2 py-5 rounded-full mt-32 w-3/4 ml-10 ">
          <Link 
           href="/mint">
            Mint NFT
          </Link>
          </button>
        </div>
                )}

          <div className="bg-[#202333E5] rounded-3xl p-10 w-full border-[2px] border-[#0162FF] md:w-5/12 lg:w-4/12 text-white"
      >
      <h2 className="text-2xl font-semibold text-[#5696FF] mb-4">Tier 2 Subcription</h2>
      <p className="text-2xl  mb-4">$5.99/month</p>
      <button className="bg-[#0162FF] text-white rounded-lg px-4 py-2 mb-4 w-2/3">
        Start Free Trial for 7 Days
      </button>
      <div className="flex gap-10 mb-4">
        <button className="bg-white text-black rounded  py-1 text-sm flex-1">
          Pay with Crypto
        </button>
        <button className="bg-white text-black rounded  text-sm py-1 flex-1">
          Pay with Credit Card
        </button>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Decentralized Wi-Fi
        </li>
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Decentralized VPN
        </li>
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Cyber threat analysis in browser extension
        </li>
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Access and submit reviews
        </li>
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          AI insights, web summary & critical alerts
        </li>
        <li className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Mobile app
        </li>
      </ul>
      <button className="bg-[#0162FF] text-white  px-2 py-5 rounded-full mt-6 w-3/4 ml-10 "
      onClick={trialbuy}>
        Start Free Trial
      </button>
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
