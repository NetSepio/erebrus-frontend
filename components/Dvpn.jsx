"use client";
import React from "react";

const Dvpn = () => {
  return (
    <div
      className="flex justify-center items-center bg-[#040a20] text-center pt-[10rem] pb-[10rem]"
      style={{
        backgroundImage: "url('/Light_Background.png')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-white text-5xl mb-12 mt-0 lg:text-7xl md:text-4xl sm:text-3xl">
          Decentralized VPN
        </h1>
        <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
          Private, Secure, and Censorship-Free Internet
        </p>
        <div className="flex justify-center items-center gap-[5rem] flex-col lg:flex-row">
          <div className="flex flex-col gap-8 lg:gap-12 items-center lg:items-start">
            <a
              href="https://play.google.com/store/apps/details?id=com.erebrus.app"
              target="_blank"
              rel="noreferrer"
            >
              <button className="px-6 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-[10px] text-black bg-[#ccc] font-bold text-lg transition-all duration-300 hover:bg-white">
                Play Store
              </button>
            </a>
            <a
              href="https://testflight.apple.com/join/BvdARC75"
              target="_blank"
              rel="noreferrer"
            >
              <button className="px-6 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-[10px] text-black bg-[#ccc] font-bold text-lg transition-all duration-300 hover:bg-white">
                iOS Test Flight
              </button>
            </a>
            <button className="px-6 py-2 lg:px-8 lg:py-4 border-2 border-white rounded-[10px] text-white bg-transparent cursor-not-allowed opacity-50 font-bold text-lg">
              Web App
            </button>
          </div>
          <div className="flex-shrink-0 mt-12 lg:mt-0">
            <img
              src="/Erebrus_Mobile.png"
              alt="Erebrus Mobile"
              className="rounded-[20px] max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dvpn;
