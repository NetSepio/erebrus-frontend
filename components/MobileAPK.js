import React from "react";
import Link from "next/link";

const Pricing = () => {
  return (
    <div
      id="pricing"
      className="lg:flex md:flex items-center justify-center lg:gap-20 md:gap-20 mx-auto pt-20 pb-32 bg-[#040819]"
    >

<div className="lg:w-1/2 md:w-1/2 w-full">
        <img src="/apk1.png" />
      </div>

      <div className="lg:w-1/2 md:w-1/2 w-full lg:p-0 md:p-0 p-4">
  <h1 className="lg:text-5xl md:text-5xl text-3xl font-semibold mb-4 lg:font-thin md:font-thin text-white lg:pr-20 md:pr-20 text-center lg:text-left md:text-left">
    Unleash the Power of Future Internet
  </h1>
  <div className="flex mb-10 text-white lg:text-xl md:text-xl text-sm font-thin lg:pr-20 md:pr-20 text-center lg:text-left md:text-left">
    <div>
      Empower your online activity with our mobile app for secure, private <br/> and accessible network. We utilize NFTs for robust 
      privacy and decentralization.
    </div>
  </div>
  <div className="text-center lg:text-left md:text-left">
    <Link
     href='https://drive.google.com/file/d/1jdkqwIXY825iG3shRRoFyg5SMGy6LN8J/view?usp=drive_link' target="_blank"
      className="text-black bg-white font-bold py-3 px-6 rounded-full w-full lg:w-auto md:w-auto button-bg"
    >
      Download Now
    </Link>
  </div>
</div>

      
    </div>
  );
};

export default Pricing;
