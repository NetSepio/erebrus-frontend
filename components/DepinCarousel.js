import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import Link from 'next/link';
const DepinCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const customRenderIndicator = (index) => {
    const indicatorStyle = {
      width: 30,
      height: 30,
      borderRadius: '50%',
      backgroundColor: currentSlide === index ? '#202434' : 'white',
      display: 'inline-block',
      margin: '10px 8px',
      cursor: 'pointer'
    };

    return (
      <button
        key={index}
        style={indicatorStyle}
        onClick={() => setCurrentSlide(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    );
  };

  const slides = [
    {
      heading: "Last Mile Safe Internet Connectivity",
      subheadings: [
        {
          subheading: "Break Free from Censorship",
          description: "Get rid of censorship and geo-restrictions and provide access to any website, anywhere, with complete freedom."
        },
        {
          subheading: "Security That Pays",
          description: "We've got you covered. Enjoy peace of mind knowing your clients’ internet access and cybersecurity are covered when using your apps."
        },
        {
          subheading: "Smart Security, Seamless Speed",
          description: "Use targeted VPN protection (split tunneling) for your apps, ensuring clients’ security without slowing down their browsing experience."
        }
      ]
    },
    {
      heading: "DNS-Based Roaming Firewall",
      subheadings: [
        {
          subheading: "Unprecedented Network Control",
          description: "Gain complete oversight and deep inspection capabilities for all your network traffic with our DNS-Based Roaming Firewall."
        },
        {
          subheading: "Fortress on the Move",
          description: "Securely connect to a highly secure enterprise network anytime, anywhere, with our innovative solution."
        },
        {
          subheading: "Enhanced Security & Privacy by Design",
          description: "Manage and regulate your network traffic with ease, ensuring unparalleled security and privacy for your connected devices."
        }
      ]
    }
  ];

  return (
    <div id="howto" className="min-h-screen flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 mb-20">
      <div className="mb-2  font-normal w-[80%] text-white lg:text-2xl text-sm text-left">
        <h1 className=" lg:text-5xl md:text-4xl text-3xl lg:mb-8 mb-8 lg:mt-10 text-left text-white">
          Companies and Enterprises: Content Delivery, Uninterrupted
        </h1>
        <h1 className=" lg:text-xl text-xl lg:mb-8 mb-10 text-left text-white">
          Subsidize Safe and Uncensored Internet & Cybersecurity for Your Teams and Users
        </h1>
        <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
      className="bg-[#E3EEFF] text-black py-3 px-6 text-center lg:text-lg md:text-sm text-sm rounded-[10vh] z-10 w-[30vh] mb-10 h-[7vh]"
    >
      <Link href="/subscription">
        Deploy Your Node
      </Link>
    </motion.div>
        <div className="lg:flex gap-14">
          <div className="rounded-3xl lg:w-2/5 w-full relative">
            <img src="/depin.png" alt="Static Image" className="rounded-3xl w-full" />
          </div>
          <div className="rounded-3xl px-10 pt-10 lg:w-3/5 w-full text-left custom-gradient-bg mt-10 lg:mt-0 md:mt-0" >
            <Carousel
              selectedItem={currentSlide}
              onChange={setCurrentSlide}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
            >
              {slides.map((slide, index) => (
                <div key={index} className="text-left">
                  <h2 className="text-3xl  font-normal mb-10">{slide.heading}</h2>
                  {slide.subheadings.map((sub, subIndex) => (
                    <div key={subIndex} className="mb-4">
                      <h3 className="text-xl font-semibold">{sub.subheading}</h3>
                      <p className="text-base text-[#BEBEBE] mb-10">{sub.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-1/3 justify-end">
        {slides.map((_, index) => customRenderIndicator(index))}
      </div>
    </div>
  );
};

export default DepinCarousel;
