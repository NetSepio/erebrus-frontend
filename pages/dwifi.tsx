import React, { useEffect, useState} from "react";
import Link from "next/link";
import  NodeDwifiStream from "../components/nodedataDwifi";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const DwifiMap = dynamic(() => import('../components/DwifiMap'), { ssr: false });


const Dwifi = () => {

    return(
      <div className="bg-black">
      <div className="mx-auto py-20"
        style={{
          backgroundImage: 'radial-gradient(circle at left, rgba(86, 150, 255, 0.6) 4%, #0162FF80 10%, black 30%), url("/explorer2.png")',  
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
          }}
          >
      <div className="flex flex-col items-start justify-start lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 mb-36 lg:mb-0 px-20 ">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
          className="text-6xl font-semibold text-gray-300 mb-8 w-3/5"
        >
          Decentralized Connectivity 
          with Erebrus ÐWi-Fi
        </motion.h1>
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
          className="text-2xl text-white mb-8"
        >
          <p>
          Secure and fast Wi-Fi Everywhere
          </p>
        </motion.h1>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
          className="text-black font-bold py-3 px-10 rounded-full bg-white text-lg" 
          // style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
        >
          <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank"
            rel="noopener noreferrer">
            Run Your Node
          </Link>
        </motion.div>
      </div>
    </div>
    <div className="bg-[#20253A] pt-16 px-20">
          <div className="text-2xl font-semibold text-gray-300 mb-8 ">
          Erebrus Decentralized Wi-Fi (ÐWi-Fi) Network Nodes Overview
          </div>
          <div className="text-white">
            <p>
            Discover the Erebrus decentralized Wi-Fi network with our interactive map. View real-time details about Wi-Fi hotspots, including their location, performance, and usage stats. This dashboard helps you find secure and fast Wi-Fi connections globally.            </p>
          </div>
        </div>
    <div className="map-page" style={{ height: '100vh', width: '100vw' }}>
      
      <div className="map-controls" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
      </div>
      <div className="map-container" style={{ height: '100%', width: '100%' }}>
          <DwifiMap />
      </div>
    </div>

      <NodeDwifiStream />

            {/* <img src="/mapRegions.png"/> */}
        </div>
    )
}

export default Dwifi;