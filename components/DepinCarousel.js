"use client";
import React from "react";

const DepinCarousel = () => {
  return (
    <div
      className="flex justify-center items-center bg-[#040a20] text-center pb-[10rem]"
      style={{
        backgroundImage: "url('/Light_Background.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="w-full max-w-6xl px-4">
        <h1 className="text-white text-4xl mb-12 mt-0 lg:text-7xl md:text-4xl sm:text-3xl" style={{fontFamily: "DM Sans"}}>
          Meet CyreneAI
        </h1>
        <p className="text-[#ccc] text-2xl leading-6 lg:text-2xl mb-8 sm:text-xl sm:mb-6">
          Private, Secure, and Censorship-Free Internet
        </p>
        <div className="flex justify-center items-center gap-[2rem] flex-col lg:flex-row pt-10">
          <div className="flex-shrink-0 mt-12 lg:mt-0">
            <img
              src="/Cyrene.webp"
              alt="Cyrene AI"
              className="rounded-[20px] max-w-full h-auto"
            />
          </div>
          <div className="flex flex-col gap-8 lg:gap-12 items-center lg:items-start text-center lg:text-left">
            <h1 className="text-white text-2xl lg:text-3xl leading-tight sm:text-3xl">
              Your Cosmic Guide into the Agentic Future
            </h1>
            <h1 className="text-white text-2xl lg:text-3xl leading-tight sm:text-3xl">
              Chat with Cyrene, our advanced AI assistant integrated into
              Erebrus applications, ready to answer your questions and provide
              instant assistance, across space and time.
            </h1>
            <h1 className="text-white text-2xl lg:text-3xl leading-tight sm:text-3xl">
              Get the help you need, anytime.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepinCarousel;
