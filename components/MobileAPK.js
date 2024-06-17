import React from "react";
import Link from "next/link";

const Pricing = () => {
  return (
    <div
      id="pricing"
      className="lg:flex items-center justify-center gap-20 mx-auto py-40"
    >

<div className="w-1/2">
        <img src="/apk.png" />
      </div>

      <div className=" w-1/2">
      <h1 className="text-5xl font-bold mb-4 text-white pr-20">
      Your Online Security with 
Our Web3-Powered VPN
      </h1>
              <div className="flex mb-10 text-white pr-20">
          <div>Secure your online activity with our blockchain VPN app, <br></br>
          utilizing NFTs for robust privacy and decentralization.</div>
        </div>
        <Link
          href="https://drive.google.com/drive/folders/1Sxa7Fiy2BF4BA3rZ-NhKo2mZIBtbIClo?usp=drive_link" target="_blank"
          className="bg-white text-black font-bold py-3 px-6 rounded-full w-full mr-10"
          style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
        >
          Download APK
        </Link>
        </div>
      
    </div>
  );
};

export default Pricing;
