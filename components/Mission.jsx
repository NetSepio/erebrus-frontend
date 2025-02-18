"use client";
import React from "react";

const Mission = () => {
  return (
    <div className="flex justify-center bg-[#040a20] pt-32">
      <div className="relative w-xl flex items-center justify-center border-white border border-1 rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-3xl"
          style={{
            backgroundImage: "url('/world_map.jpeg')",
            filter: "brightness(35%)",
          }}
        ></div>

        <div className="absolute inset-0 bg-blue-900 opacity-50 mix-blend-multiply"></div>

        <div className="relative max-w-6xl p-10 lg:p-20 text-center rounded-lg text-white z-10">
          <h1 className="text-4xl lg:text-6xl mb-16">
            Pioneering the DePIN Revolution
          </h1>
          <p className="text-xl text-left" style={{ lineHeight: "2" }}>
            Prepare to witness a groundbreaking leap in internet technology with
            the Erebrus Protocol, the vanguard in democratizing safe, private,
            and accessible internet through DePIN. By seamlessly integrating
            decentralized VPN (ÐVPN) and decentralized WiFi (ÐWiFi) within a
            robust infrastructure, Erebrus is set to redefine digital
            connectivity with a focus on privacy and sovereignty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
