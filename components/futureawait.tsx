import React from "react";

const Future = () => {
  return (
    <div className="text-white bg-[#040a20] min-h-screen">
      <Header />
      <main className="flex flex-col md:flex-row justify-center items-stretch gap-[6vh] mt-20 lg:w-[80%] mx-auto pl-2 pr-2">
        <SubscriptionCard />
        <BenefitsCard />
      </main>
    </div>
  );
};

const Header = () => {
  return (
    <>
      <h1 className="lg:text-7xl md:text-4xl sm:text-3xl text-4xl pt-20 text-center"  style={{fontFamily: "DM Sans"}}>
        Decentralized for Speed and Privacy
      </h1>
      <div className="flex justify-center">
        <img src="/Uncensored.webp" className="lg:w-[20%] md:w-[50%]" />
      </div>
    </>
  );
};

const SubscriptionCard = () => {
  return (
    <div className="rounded-3xl p-12 w-full border-[1px] border-[#0162FF] md:w-5/12 lg:w-4/12 flex flex-col min-h-full">
      <h2 className="text-2xl font-semibold text-[#5696FF] mb-4">
        Tier 1 Subscription
      </h2>
      <p className="lg:text-4xl text-3xl mb-4">$5.99/month</p><br />
      <button className="bg-[#0162FF] text-white rounded-lg px-4 py-2 mb-4 w-2/3">
        Start Free Trial for 7 Days
      </button>
      <div className="flex gap-10 mb-4">
        <button className="bg-white text-black rounded py-1 text-sm flex-1">
          Pay with Crypto
        </button>
        <button className="bg-white text-black rounded text-sm py-1 flex-1">
          Pay with Credit Card
        </button>
      </div>
      <br />
      <ul className="space-y-2 flex-grow">
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Decentralized Wi-Fi
        </li> 
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Decentralized VPN
        </li>
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Cyber threat analysis in browser extension
        </li>
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Access and submit reviews
        </li>
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          AI insights, web summary & critical alerts
        </li>
        <li className="flex items-center text-xl">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          Mobile app
        </li>
      </ul>
      <div className="flex justify-center">
        <button className="bg-[#1d2437] border-white border text-white px-1 py-4 rounded-full mt-6 lg:w-2/4 w-full">
          Start Free Trial
        </button>
      </div>
    </div>
  );
};

const BenefitsCard = () => {
  return (
    <div className="rounded-3xl p-12 w-full border-[1px] border-white md:w-5/12 lg:w-4/12 flex flex-col min-h-full">
      <h2 className="text-4xl font-normal mb-10">Features</h2>
      <ul className="space-y-4 flex-grow">
        <li>
          <h3 className="font-normal text-3xl mb-4">1. Top-Notch Security</h3>
          <p className="text-lg text-white">
            Cutting-edge encryption keeps your data safe.
          </p>
        </li>
        <li>
          <h3 className="font-normal text-3xl mb-4">2. Enhanced Privacy</h3>
          <p className="text-lg text-white">
            Multiple decentralized nodes for anonymity.
          </p>
        </li>
        <li>
          <h3 className="font-normal text-3xl mb-4">
            3. Full Control Over Your Data
          </h3>
          <p className="text-lg text-white">
            You’re in control of your privacy, no data logging.
          </p>
        </li>
        <li>
          <h3 className="font-normal text-3xl mb-4">
            4. Fast & Reliable Connections
          </h3>
          <p className="text-lg text-white">
            Connects you to the best available node.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default Future;
