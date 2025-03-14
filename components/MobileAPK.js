import React from "react";
import Link from "next/link";

const Pricing = () => {
  return (
    <div className="bg-[#040a20] text-center pb-40">
      <div>
        <h1 className="lg:text-7xl md:text-4xl sm:text-3xl text-4xl pt-20 pb-20 text-center text-white" style={{fontFamily: "DM Sans"}}>
          Your Content Delivery, Uninterrupted!
        </h1>
        <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
          Launch your own VPN and AI agents for sovereign and private experience
        </p>
      </div>
      <div className="flex items-center justify-center mt-20 flex-wrap gap-8 pl-4 pr-4">
        <div className="rounded-3xl pt-12 pb-12 pl-8 pr-8 w-full border-[1px] bg-[#051337] border-white lg:w-3/12">
          <h2 className="text-4xl font-normal mb-10 text-white">
            Last Mile Safe Internet
          </h2>
          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            No censorship or geo-restrictions
          </p>
          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            Enhanced security and privacy
          </p>
        </div>
        <div className="rounded-3xl pt-12 pb-12 pl-8 pr-8 w-full border-[1px] border-white lg:w-3/12 flex flex-col">
          <h2 className="text-4xl font-normal mb-10 text-white">
            CyreneAI <br />
            Coordination Layer
          </h2>
          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            Communication layer for apps and AI agents with sensitive data{" "}
          </p>

          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            Multi-agent coordination with discovery & access control
          </p>
        </div>
        <div className="rounded-3xl pt-12 pb-12 pl-8 pr-8 w-full border-[1px] bg-[#051337] border-white lg:w-3/12 h-auto">
          <h2 className="text-4xl font-normal mb-10 text-white">
            DNS Firewall
          </h2>
          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            Block adware, spyware and malware
          </p>

          <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
            Targeted network protection
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8 items-center lg:items-start pt-20">
        <a
          href="https://docs.netsepio.com/latest/erebrus/setup"
          target="_blank"
          rel="noreferrer"
        >
          <button className="px-6 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-[10px] text-black bg-[#ccc] font-bold text-lg transition-all duration-300 hover:bg-white">
            Deploy Your Node
          </button>
        </a>
        <a
          href="https://www.cyreneai.com/launch-agent"
          target="_blank"
          rel="noreferrer"
        >
          <button className="px-6 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-[10px] text-black bg-[#ccc] font-bold text-lg transition-all duration-300 hover:bg-white">
            Launch Agent
          </button>
        </a>
      </div>
    </div>
  );
};

export default Pricing;
