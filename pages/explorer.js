import React, { useEffect, useState} from "react";
import Link from "next/link";
import NodesData from "../components/NodesData";
import dynamic from 'next/dynamic';
// import Dvpn Map from "../components/DvpnMap"
import { motion } from "framer-motion";

const DvpnMap = dynamic(() => import('../components/DvpnMap'), { ssr: false });


const Explorer = () => {

  const [nodes, setNodes] = useState([]);
  const [activeMap, setActiveMap] = useState('pin');

  useEffect(() => {
    async function fetchNodes() {
      const response = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
      const data = await response.json();
      setNodes(data.payload);
    }
    fetchNodes();
  }, []);

    return (
      <div className="bg-[#040819]">
        <div className="mx-auto py-20"
          style={{
            backgroundImage: 'radial-gradient(circle at left, rgba(86, 150, 255, 0.6) 4%, #0162FF80 10%, black 30%), url("/explorer4.png") ',  
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
            Decentralized Access with 
            Erebrus ÐVPN
          </motion.h1>
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-2xl text-white mb-8"
          >
            <p>
            Unrestricted Uncensored Web Access
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
            {/* <img src="/mapRegions.png"/> */}
        <div className="map-page" style={{ height: '100vh', width: '100vw' }}>
  
          <div className="map-controls" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
            </div>
          <div className="map-container" style={{ height: '100%', width: '100%' }}>
              <DvpnMap nodes={nodes} />
          </div>
        </div>

        <NodesData />
      </div>
    )
}

export default Explorer;