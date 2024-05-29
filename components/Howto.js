import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt, FaExternalLinkSquareAlt } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";

const Howto = () => {
  return (
    <div
      id="howto"
      className="flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 lg:mb-36 mb-24"
    >
      <div className="mb-2 font-figtree w-[70%] text-left">
        <h1 className="font-bold text-4xl lg:mb-16 mb-12 lg:mt-36 text-left text-gray-200">
          Start using Erebrus <br></br>VPN now!
        </h1>
        <div className="flex lg:flex-row flex-col items-center justify-center gap-4">
          <div className="flex flex-col py-10 px-6 rounded-3xl" style={{backgroundColor:'#3985FF'}}>
            <div className="bg-white w-20 h-20 rounded-full mb-10 mt-14">
            <Link
              href="https://testnets.opensea.io/collection/erebrus-v4"
              target={"_blank"}
            >
              <img src="/icon6.png" className="mt-2 w-16 h-16 mx-auto" />
            </Link>
            </div>
            <h2 className="text-white lg:text-2xl text-xl font-bold">
              <div className="flex items-center">
                Get the Erebrus NFT{" "}
                <Link href={"https://app.erebrus.io/mint"} target="_blank">
                  <GoLinkExternal />
                </Link>
              </div>
            </h2>
            <p className="text-white text-sm mt-4">
              The team at Erebrus has created an innovative and easy way to
              purchase a VPN subscription. All you need is a wallet address with
              some APT!
            </p>
          </div>
          <div className="flex flex-col py-10 px-4 rounded-3xl" style={{backgroundColor:'#8EB9FF'}}>
          <div className="bg-black w-20 h-20 rounded-full mb-10 mt-14">
            <img src="/icon7.png " className="mt-5 w-10 h-10 mx-auto" />
            </div>
            <h2 className="text-black lg:text-2xl text-xl font-bold">
              Generate client config file
            </h2>
            <p className="text-black text-sm mt-4">
              Once you have the Erebrus NFT, it will allow you to create VPN
              clients based on name, region and device - this will
              generate your VPN client config
            </p>
          </div>
          <div className="flex flex-col py-10 px-4 rounded-3xl" style={{backgroundColor:'#E3EEFF'}}>
          <div className="bg-black w-20 h-20 rounded-full mb-10 mt-14">
          <img src="/icon8.png " className="mt-5 w-10 h-10 mx-auto" />
          </div>
            <h2 className="text-black lg:text-2xl text-xl font-bold">
              Scan QR code or .conf
            </h2>
            <p className="text-black text-sm mt-4">
              Once you&apos;ve generated your config file for your VPN client,
              scan the QR code or add the .conf file with the WireGuard app to
              start using your VPN!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howto;
