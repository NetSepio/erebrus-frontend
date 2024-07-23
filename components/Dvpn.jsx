"use client";
import { cardDetails2 } from "../utils/data";
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";

const Dvpn = () => {

  return (
    <div className='flex flex-col items-center bg-[#080d1f] mx-auto'
    >
      <div className='w-[80%]'>
      <h3
        className='text-3xl lg:text-[42px] md:text-[42px] mb-[90px] w-full lg:text-start md:text-start text-center text-white mt-20 lg:mt-40 md:mt-40'
      >
       Decentralized VPN & Wi-Fi for Everyone, Anywhere
      </h3>
      
      <div className='w-full flex flex-col lg:gap-10 md:gap-10 gap-10 lg:flex-row h-max justify-between'>
        {cardDetails2.map((item, index) => {
          return (
            <div
            key={index.toString()}
            className='flex lg:w-1/3 md:w-1/3 w-full hover:-translate-y-4 duration-300 flex-col justify-center items-center win-background  rounded-[50px]  '
            style={{border:'1px solid rgba(17, 217, 197, 0.3)'}}
          >
            <Image
              src={`/${item.image}.png`}
              alt='pic'
              className='mb-4 sm:mb-[54px] object-cover overflow-clip px-14 pt-14'
              width={430}
              height={320}
            />
            <div className="pb-8">
            <h4 className='mb-[10px] text-white text-[22px] text-center'>{item.title}</h4>
            <ul className='list-disc px-10'>
              <li className='text-lg font-thin text-[#F3F4F6] '>{item.desc1}</li>
              <li className='text-lg font-thin text-[#F3F4F6] '>{item.desc2}</li>
            </ul>
            </div>
          </div>
          
          );
        })}
      </div>
      </div>
      <div className=" relative overflow-hidden w-full  ">
  <div 
className="absolute inset-0 opacity-30 lg:bg-[radial-gradient(ellipse_at_center,#0262FF,#040819_30%,#080d1f_100%)] md:bg-[radial-gradient(circle_at_top,#0262FF,#040819_30%,#080d1f_100%)] bg-[radial-gradient(circle_at_center,#0262FF,#040819_30%,#080d1f_100%)] transform scale-[2.0]"
  ></div>
  <div className="relative min-h-[300px] flex flex-col items-center justify-center pt-40 pb-60">
    <div className="text-center lg:text-4xl md:text-4xl text-3xl text-white mb-10 lg:w-full md:w-full w-3/4">
      Join the Movement. Get Started Now.
    </div>
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
      className="bg-white text-black font-bold py-3 px-16 text-center rounded-[50px] z-10"
    >
      <Link href="/subscription">
        Join Now
      </Link>
    </motion.div>
  </div>
</div>
      
      
    </div>
    
  );
};

export default Dvpn;
