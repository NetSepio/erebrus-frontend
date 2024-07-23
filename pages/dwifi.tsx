import React, { useEffect, useState} from "react";
import Link from "next/link";
import  NodeDwifiStream from "../components/nodedataDwifi";
import { motion } from "framer-motion";

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
      <div className="flex flex-col items-start justify-start lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 mb-36 lg:mb-0 px-20 py-40">
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
      <NodeDwifiStream />
            <img src="/mapRegions.png"/>
        </div>
    )
}

export default Dwifi;