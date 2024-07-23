import React from 'react';

const Future = () => {
    return (
   
        <div className="text-white bg-[#040819]">
          <div className="mx-auto bg-[#040819] -z-10 pb-20"
           style={{
            backgroundImage: 'radial-gradient(circle at 55% 50%, rgba(86, 150, 255, 0.6) 10%, #0162FF80 30%, #040819 40% )',  
              backgroundSize: 'cover',
              backgroundBlendMode: '',
            }}>
            <Header />
            <main className="flex flex-col md:flex-row justify-center items-start gap-[10vh] mt-20">
              <SubscriptionCard />
              <BenefitsCard />
            </main>
          </div>
        </div>

      );
    }

const Header = () => {
  return (
    <header className="lg:flex md:flex items-center ">
    <h1 className="lg:text-5xl md:text-5xl text-3xl lg:font-thin md:text-whin text-semibold mt-20 lg:w-1/2 md:w-1/2 text-center">The Future Awaits</h1>
    <div className="flex justify-center lg:mr-auto md:mr-auto lg:justify-start md:justify-start">
      <img src="/Erebrus_logo_wordmark.png" alt="Erebrus logo" className="lg:w-1/2 md:w-1/2 w-32 lg:mt-20 md:mt-20 mt-4" />
    </div>
  </header>
  );
}

const SubscriptionCard = () => {
  return (
    <div className="bg-[#202333E5] rounded-3xl p-10 w-full border-[2px] border-[#0162FF] md:w-5/12 lg:w-4/12"
      >
      <h2 className="text-2xl font-semibold text-[#5696FF] mb-4">Tier 1 Subcription</h2>
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
      <button className="bg-[#0162FF] text-white  px-2 py-5 rounded-full mt-6   w-3/4 ml-10 ">
        Start Free Trial
      </button>
    </div>
  );
}

const BenefitsCard = () => {
  return (
    <div className="rounded-3xl p-14 mt-[8vh] w-full md:w-6/12 border-white border-[1px] lg:w-5/12"
    style={{backgroundColor:'rgba(32, 35, 51, 0.6)'}}>
      <h2 className="text-3xl font-normal mb-10">Benefits</h2>
      <ul className="space-y-4">
        <li>
          <h3 className="font-normal text-lg">Secure Wi-Fi Everywhere</h3>
          <p className="text-sm text-gray-400">Surf securely with encrypted WiFi at your fingertips, anywhere in the world!</p>
        </li>
        <li>
          <h3 className="font-normal text-lg">Unrestricted Uncensored Web Access</h3>
          <p className="text-sm text-gray-400">Break free from barriers with unlimited, uncensored internet access!</p>
        </li>
        <li>
          <h3 className="font-normal text-lg">Mobile App for Everyone</h3>
          <p className="text-sm text-gray-400">Experience ultimate privacy with our intuitive, all-access mobile app!</p>
        </li>
        <li>
          <h3 className="font-normal text-lg">DNS Based Roaming Firewall</h3>
          <p className="text-sm text-gray-400">Roam with confidence, protected by our advanced DNS-based firewall!</p>
        </li>
      </ul>
    </div>
  );
}

export default Future;