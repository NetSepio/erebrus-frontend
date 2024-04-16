import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const Features = () => {
  const [aboutRef, setAboutRef] = useState(null);
  const animation = useAnimation();
  const itemAnimation = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.getBoundingClientRect().top < window.innerHeight) {
        animation.start("visible");
        itemAnimation.start("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [aboutRef, animation, itemAnimation]);

  const itemVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    hidden: {
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div
      id="features"
      ref={setAboutRef}
      className="flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 mb-36 lg:mb-12"
    >
      <div className="mb-2 font-figtree lg:w-[60%] w-[80%] text-center">
        <motion.h2
          animate={animation}
          initial="hidden"
          variants={itemVariants}
          className="font-bold lg:text-4xl text-2xl mb-10 lg:mt-36 text-gray-200 text-left"
        >
         Be a part of Decentralized <br></br>Internet
        </motion.h2>
      </div>
      <div className="w-[60%]">
        <motion.div
          animate={itemAnimation}
          initial="hidden"
          variants={itemVariants}
          className="flex mb-10 lg:flex-row flex-col justify-center items-start gap-4"
        >
          <div className="lg:w-[50%] w-[100%] pt-24 pb-12 px-6 rounded-2xl text-black" style={{backgroundColor: '#8EB9FF'}}>
            <div className="text-4xl bg-black rounded-full w-20 h-20"><img src="/icon1.png" className="w-12 mx-auto pt-4"/></div>
            <div className="flex flex-col mt-4">
              <motion.h1 className="font-bold lg:text-3xl text-xl">
                Power of <br></br>Decentralization
              </motion.h1>
              <motion.p className="lg:w-[80%] text-sm font-semibold mt-4">
                Equipped with Blockchain based Security and verified Hosting
                Providers, you get to experience the true power of
                decentralization.
              </motion.p>
            </div>
          </div>
          <div className="lg:w-[50%] w-[100%] pt-28 pb-12 px-6 rounded-2xl text-black" style={{backgroundColor: '#E3EEFF'}}>
          <div className="text-4xl bg-black rounded-full w-20 h-20"><img src="/icon2.png" className="w-12 mx-auto pt-4"/></div>
            <div className="flex flex-col mt-4">
              <motion.h1 className="font-bold lg:text-3xl text-xl">
                Fast Speed & <br></br>Unlimited Bandwidth.
              </motion.h1>
              <motion.p className="lg:w-[80%] text-sm font-semibold mt-4">
                We offer speeds that match popular providers out there, allowing
                for a fast browsing experience.
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={itemAnimation}
          initial="hidden"
          variants={itemVariants}
          className="flex lg:flex-row flex-col justify-center items-start mb-10 gap-4"
        >
          <div className="lg:w-[50%] w-[100%] pt-32 pb-10 px-6 rounded-2xl text-white" style={{backgroundColor: '#3985FF'}}>
          <div className="text-4xl bg-white rounded-full w-20 h-20"><img src="/icon3.png" className="w-12 mx-auto pt-4"/></div>
            <div className="flex flex-col mt-4">
              <motion.h1 className="font-bold lg:text-3xl text-xl">
                IP Address Protection
              </motion.h1>
              <motion.p className="lg:w-[80%] text-sm font-semibold mt-4">
                Hide your IP address and location from websites and applications
                to keep your search history and downloads private.
              </motion.p>
            </div>
          </div>
          <div className="lg:w-[50%] w-[100%] pt-32 pb-10 px-6 rounded-2xl text-white" style={{backgroundColor: '#0162FF'}}>
          <div className="text-4xl bg-white rounded-full w-20 h-20"><img src="/icon4.png" className="w-12 mx-auto pt-4"/></div>
            <div className="flex flex-col mt-4">
              <motion.h1 className="font-bold lg:text-3xl text-xl">
                Multiple Devices
              </motion.h1>
              <motion.p className="lg:w-[80%] text-sm font-semibold mt-4">
              Experience a swift and secure internet connection across multiple devices! 
              Our starter plan allows connections with multiple devices.
              </motion.p>
            </div>
          </div>
        </motion.div>
        <motion.div
          animate={itemAnimation}
          initial="hidden"
          variants={itemVariants}
          className="flex lg:flex-row flex-col justify-center items-center"
        >
          <div className="pt-32 pb-10 px-10 rounded-2xl text-white flex" style={{backgroundColor: '#202333'}}>
            <div className="flex flex-col lg:w-1/2">
            <div className="text-4xl bg-white rounded-full w-20 h-20">
            <img src="/icon5.png" className="w-12 mx-auto pt-4"/>
            </div>
              <motion.h1 className="font-bold lg:text-3xl text-xl mt-4">
                NFT Subscriptions
              </motion.h1>
              <motion.p className="text-sm font-semibold mt-4">
                Pay using cryptocurrencies and surf the internet securely -
                Anonymous Browsing without sacrificing speed or bandwidth had
                never been this easy.
              </motion.p>
            </div>
            <img src="/landing.png" className="w-1/2 lg:visible hidden"/>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
