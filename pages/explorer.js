import React, { useEffect, useState} from "react";
import Link from "next/link";
import NodesData from "../components/NodesData";
import { motion } from "framer-motion";

const Explorer = () => {

    return(
        <div className="">
            <div className="container mx-auto py-20 w-4/5" 
            style={{backgroundImage: 'radial-gradient(circle at center, #0162FF80 20%, black)'}}>
        <div className="flex flex-col items-center justify-start lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 mb-36 lg:mb-0 ">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-5xl font-semibold text-gray-300 mb-4 lg:text-center md:text-center md:w-[80%]"
          >
            Access Safe Internet over DeWi Networks
          </motion.h1>
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-lg text-white mb-8 lg:text-center md:text-center md:w-[80%]"
          >
            <p>
            Become part of our strong network
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
            <NodesData />
            <img src="/mapRegions.png"/>
        </div>
    )
}

export default Explorer;