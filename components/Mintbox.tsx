'use client'

import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Mintbox() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/mint');
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 right-full mr-4 w-[400px] z-10"
      >
        <div className="bg-[#202333] border border-[#0162FF] rounded-3xl p-6 w-full h-[350px] flex flex-col shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Mint</h2>
          <div 
            className="flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-[#0162FF] rounded-xl p-6 mb-4 cursor-pointer"
            onClick={handleNavigate}
          >
            <FiPlus className="text-[#0162FF] text-6xl mb-4" />
            <p className="text-white text-lg mb-2">Click to navigate to Mint page</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}