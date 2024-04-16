import React from "react";
import Link from "next/link";

const Pricing = () => {
  return (
    <div
      id="pricing"
      className="lg:flex items-center justify-center w-[80%] gap-20 mx-auto py-40"
    >
      <div className="lg:mb-0 mb-10">
      <h1 className="text-4xl font-bold mb-4" style={{color:'#3985FF'}}>
      Erebrus Beta Release
      </h1>
      {/* <p className="text-gray-400 mb-8 w-60 text-center">
        Erebrus VPN is available for purchase directly though ownership of the
        Erebrus NFT
      </p> */}
              <div className="flex mr-16 mb-10">
          <ul className="text-gray-400">
            <li>Unlimited Devices</li>
            <li>5 Regions</li>
            <li>Each Subscription is rentable</li>
            <l1>100% Decentralized</l1>
          </ul>
        </div>
        <Link
          href="/plans"
          className="bg-white text-black font-bold py-3 px-6 rounded-full w-full"
          style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
        >
          Start your free trial
        </Link>
        </div>
      <div className="flex flex-col justify-start py-16 px-10 rounded-2xl shadow-lg shadow-blue-500" style={{backgroundColor:'#0162FF'}}>
        <h1 className="text-gray-200 text-xl">Pricing</h1>
        <div className="flex items-center mb-4">
          <h1 className="text-gray-200 mr-2 text-4xl">1.11 APT / 3 months</h1>
          {/* <p className="text-gray-400">/ 3 months</p> */}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
