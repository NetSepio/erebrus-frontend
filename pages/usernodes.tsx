import React from "react";
import NodeDwifiStreamUser from "../components/nodedataDwifiUser";
import NodesDataStreamDvpn from "../components/NodesDataDvpnUser";
import { motion } from "framer-motion";

const Dwifi = () => {
  return (
    
      <div className="  bg-gradient-to-b from-[#040819] via-[#092187] to-[#20253A]">
        <div
          className="flex flex-col items-center justify-center lg:h-[40vw] mb-36 lg:mb-0   w-full h-full "
          style={{
            backgroundImage: 'url("/explorerhero.png")',
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
          }}
        >
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-6xl font-semibold text-gray-300 mb-8 text-center w-full lg:w-3/5"
          >
            Manage Your ÐVPN & ÐWi-Fi Nodes
          </motion.h1>
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-2xl text-white text-center"
          >
            <p>Discover data across your ÐWi-Fi network</p>
          </motion.h1>
        
      </div>
      <NodeDwifiStreamUser />
      <NodesDataStreamDvpn />
    </div>

  );
};

export default Dwifi;
