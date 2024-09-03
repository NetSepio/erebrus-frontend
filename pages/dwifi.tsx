import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import NodeDwifiStream from "../components/nodedataDwifi";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { EnvironmentOutlined } from '@ant-design/icons';


const DwifiMap = dynamic(() => import('../components/DwifiMap'), { ssr: false });

const Dwifi = () => {
  const mapRef = useRef(null);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="explorer-page">
      <div className="mx-auto py-20 lg:h-[40vw]"
        style={{
          backgroundImage: 'url("/explorerhero.png")',  
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="flex flex-col lg:flex-row items-start justify-between lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 mb-36 lg:mb-0 px-4 lg:px-20">
          <div className="flex flex-col items-start justify-start">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-300 mb-8 lg:w-4/5"
            >
              Decentralized Connectivity with Erebrus ÐWi-Fi
            </motion.h1>
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
              className="text-xl md:text-2xl text-white mb-8 w-full"
            >
              <p>Secure and fast Wi-Fi Everywhere</p>
            </motion.h1>
            <div className="flex gap-5">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
                className="text-black font-bold py-3 px-10 rounded-full bg-white text-lg cursor-pointer" 
              >
                <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank" rel="noopener noreferrer">
                  Run Your Node
                </Link>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
                className="text-white font-bold py-3 px-10 rounded-full bg-[#5696FF] text-lg cursor-pointer" 
                onClick={scrollToMap}
              >
               <EnvironmentOutlined  className="inline-block mr-2 animate-bounce duration-700 ease-in-out" /> Active Node Map
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#20253A] to-[#20253A] lg:px-20 pt-16 px-20">
        <div className="text-2xl font-semibold text-gray-300 mb-8">
          Erebrus Decentralized Wi-Fi (ÐWi-Fi) Network Nodes Overview
        </div>
        <div className="text-white">
          <p>
            Discover the Erebrus decentralized Wi-Fi network with our interactive map. View real-time details about Wi-Fi hotspots, including their location, performance, and usage stats. This dashboard helps you find secure and fast Wi-Fi connections globally.
          </p>
        </div>
      </div>
      <div ref={mapRef} className="map-page" style={{ height: '100vh' }}>
        <div className="map-container" style={{ height: '100%', width: '100%' }}>
          <DwifiMap showCurrentLocation={ null } />
        </div>
      </div>

      <NodeDwifiStream />
    </div>
  )
}

export default Dwifi;