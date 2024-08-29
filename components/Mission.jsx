"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useAnimation, motion } from "framer-motion";
import Link from "next/link";

const Mission = () => {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const animation = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();

  useEffect(() => {
    console.log("inView", inView);

    if (!inView) {
      animation.start({
        x: -300,
        opacity: 0,
        scale: 0,
      });
      animation2.start({
        scale: 0,
        opacity: 0,
        x: 300,
      });
      animation3.start({
        opacity: 0,
        y: 300,
      });
    } else {
      animation.start({
        x: 0,
        opacity: 1,
        scale: 1,
      });
      animation2.start({
        scale: 1,
        opacity: 1,
        x: 0,
      });
      animation3.start({
        y: 0,
        opacity: 1,
      });
    }
  }, [inView, animation, animation2, animation3]);

  return (
    <div ref={ref} className='h-screen w-full flex items-center bg-[#080d1f]'>
      <div className='w-[80%] rounded-[50px] relative h-auto lg:h-[80%] md:h-[80%] gradient-background mx-auto mt-20'>
        <div className='w-full h-full z-20 rounded-[50px] mission-bg'>
          <div className='w-full h-full z-20 rounded-[50px] lg:flex md:flex items-center justify-between bg-gradient-to-tl from-primary2/20 to-primary2/20'>
            {/* Mobile view */}
            <div className='lg:hidden md:hidden flex flex-col items-center text-center px-4 py-6 h-full'>
              <h3 className='text-white max-w-[600px] leading-tight mb-6 mt-5 text-2xl font-bold'>
                Pioneering the DePIN Revolution
              </h3>
              
              <div className='w-[150px] h-[150px] mb-4 mt-5 relative'>
  <Image
    className='object-cover rounded-[10px]'
    src={"/mission1.png"}
    alt='access'
    width={150}
    height={150}
  />
</div>


              <p className='text-sm mb-8 mt-5 text-white font-thin'>
                Prepare to witness a groundbreaking leap in internet technology with the Erebrus Protocol,
                the vanguard in democratizing safe, private, and accessible internet through DePIN. 
                By seamlessly integrating decentralized VPN (ÐVPN) and decentralized WiFi (ÐWiFi) within a 
                robust infrastructure, Erebrus is set to redefine digital connectivity.
              </p>
             
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
                className="text-black font-bold py-2 px-4 text-center rounded-[8px] text-sm w-auto z-10 bg-[#8EB9FF]" 
              >
                <Link href="https://netsepio.com/mission">
                  Our Mission
                </Link>
              </motion.div>
            </div>

            {/* Desktop view */}
            <motion.div
              transition={{ duration: 1.5 }}
              className='hidden lg:flex md:flex flex-col lg:w-2/3 my-auto justify-center items-start lg:px-20 md:px-20 px-10 h-[80%]'
            >
              <h3 className='text-white max-w-[600px] leading-none mb-16 lg:mt-0 md:mt-0 mt-16 text-3xl lg:text-[60px]'>
                Pioneering the DePIN Revolution
              </h3>
              <p className='text-base sm:text-[18px] mb-16 text-white font-thin'>
                Prepare to witness a groundbreaking leap in internet technology with the Erebrus Protocol,
                the vanguard in democratizing safe, private, and accessible internet through DePIN. 
                By seamlessly integrating decentralized VPN (ÐVPN) and decentralized WiFi (ÐWiFi) within a 
                robust infrastructure, Erebrus is set to redefine digital connectivity.
              </p>
             
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
                className="text-black font-bold py-3 text-center rounded-[50px] lg:w-[25%] md:w-[25%] w-1/2 z-10 bg-button " 
              >
                <Link href="https://netsepio.com/mission">
                  Our mission
                </Link>
              </motion.div>
            </motion.div>

            <div className='lg:w-1/3 md:w-1/3 w-full lg:flex md:flex hidden justify-between h-[80%]'>
              <motion.div
                animate={animation2}
                transition={{ type: "tween", duration: 2 }}
                className='w-[80%] h-[80%] flex flex-col relative overflow-hidden my-auto'
              >
                <Image
                  className='object-cover rounded-[10px]'
                  src={"/mission1.png"}
                  fill
                  alt='access'
                />
              </motion.div>
            </div>
          </div>
        </div>
        {/* Gradient Radial */}
        <div className='absolute rounded-[50px] top-0 bottom-0 w-full h-full element2 opacity-50'></div>
      </div>
    </div>
  );
};

export default Mission;