import React, { useState } from "react";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const DepinCarousel = () => {

  const customRenderIndicator = (clickHandler, isSelected, index, label) => {
    const indicatorStyle = {
      width: 20, // Adjust the width
      height: 20, // Adjust the height
      borderRadius: '50%',
      backgroundColor: isSelected ? '#202434' : 'white', // Change colors as needed
      display: 'inline-block',
      margin: '10px 8px', // Adjust the space between indicators
      cursor: 'pointer'
    };

    return (
      <button
        style={indicatorStyle}
        onClick={clickHandler}
        onKeyDown={clickHandler}
        tabIndex={0}
        title={`${label} ${index}`}
        aria-label={`${label} ${index}`}
      />
    );
  };

  return (
    <div
      id="howto"
      className="min-h-screen flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 mb-20"
      // style={{ backgroundColor: "#E3EEFF" }}
    >
      <div className="mb-2 font-figtree w-[70%] text-left text-white lg:text-2xl text-sm text-left">
        <h1 className="font-bold lg:text-4xl text-2xl lg:mb-16 mb-12 lg:mt-40 text-left text-black">
          From Challenge to Connectivity
        </h1>
        <div>
          <Carousel
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            renderIndicator={customRenderIndicator}
          >
            <div className="mb-20">
                <div className="lg:flex gap-2">
                  <div className="rounded-3xl lg:w-2/3 relative">
                    <img src="/depin1.png" alt="Slide 1" className="rounded-3xl"/>
                    <div className="absolute bottom-0 right-0 mb-4 w-26 h-26">
                      <img src="/carousel_logo.png" alt="Bottom logo"/>
                    </div>
                  </div>
                  <div
                    className="rounded-3xl p-10 lg:w-1/3 text-left"
                    style={{ backgroundColor: "#202434" }}
                  >
                    <div>
                    Navigate the web 
                    securely with Erebrus
                    VPN, keeping  <span style={{color:'#3985FF'}}>your data 
                    safe</span> from threats.
                    </div>
                  </div>
                </div>
              </div>
            <div className="mb-20">
            <div className="lg:flex gap-2">
                  <div className="rounded-3xl lg:w-2/3 relative">
                    <img src="/depin2.png" alt="Slide 2" className="rounded-3xl"/>
                    <div 
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl p-10 text-left text-3xl font-semibold"
                    >
                        A World Connected
                    </div>
                    <div className="absolute bottom-0 right-0 mb-4 w-26 h-26">
                      <img src="/carousel_logo.png" alt="Bottom logo"/>
                    </div>
                  </div>
                  <div
                    className="rounded-3xl p-10 lg:w-1/3 text-left"
                    style={{ backgroundColor: "#202434" }}
                  >
                    <div>
                    Erebrus connects you to 
                    a world of <span style={{color:'#3985FF'}}>decentralized 
                    Wi-Fi hotspots,</span> making 
                    digital boundaries 
                    disappear.
                    </div>
                  </div>
                </div>
            </div>
            <div className="mb-20">
            <div className="lg:flex gap-2">
                  <div className="rounded-3xl lg:w-2/3 relative">
                    <img src="/depin3.png" alt="Slide 3" className="rounded-3xl"/>
                    <div 
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl p-10 text-left text-3xl font-semibold"
                    >
                       Quest for Connection
                    </div>
                    <div className="absolute bottom-0 right-0 mb-4 w-26 h-26">
                      <img src="/carousel_logo.png" alt="Bottom logo"/>
                    </div>
                  </div>
                  <div
                    className="rounded-3xl p-10 lg:w-1/3 text-left"
                    style={{ backgroundColor: "#202434" }}
                  >
                    <div>
                    Lost in a bustling city 
                    and craving a solid 
                    internet link? Erebrus is 
                    your answer, offering 
                    <span style={{color:'#3985FF'}}> reliable access </span>
                    everywhere.
                    </div>
                  </div>
                </div>
            </div>
            <div className="mb-20">
            <div className="lg:flex gap-2">
                  <div className="rounded-3xl lg:w-2/3 relative">
                    <img src="/depin4.png" alt="Slide 4" className="rounded-3xl"/>
                    <div 
                      className="absolute top-0 left-0 right-0 bottom-0 rounded-3xl p-10 text-left text-3xl font-semibold"
                    >
                        Be Part of the Change
                    </div>
                    <div className="absolute bottom-0 right-0 mb-4 w-26 h-26">
                      <img src="/carousel_logo.png" alt="Bottom logo"/>
                    </div>
                  </div>
                  <div
                    className="rounded-3xl p-10 lg:w-1/3 text-left"
                    style={{ backgroundColor: "#202434" }}
                  >
                    <div>
                      Transition from a <span style={{color:'#3985FF'}}>user to 
                    a contributor</span> with Erebrus, 
                    shaping a more secure 
                    and open internet for all.
                    </div>
                  </div>
                </div>
            </div>
            <div className="mb-20">
            <div className="lg:flex gap-2">
                  <div className="rounded-3xl lg:w-2/3 relative">
                    <img src="/depin5.png" alt="Slide 5" className="rounded-3xl"/>
                    <div 
                      className="absolute top-0 left-10 right-0 bottom-0 rounded-3xl p-10 text-left text-3xl font-semibold"
                    >
                        Connect and Earn
                    </div>
                    <div className="absolute bottom-0 right-0 mb-4 w-26 h-26">
                      <img src="/carousel_logo2.png" alt="Bottom logo"/>
                    </div>
                  </div>
                  <div
                    className="rounded-3xl p-10 lg:w-1/3 text-left"
                    style={{ backgroundColor: "#202434" }}
                  >
                    <div>
                    Share your bandwidth or 
                    set up a node and <span style={{color:'#3985FF'}}>earn 
                    crypto rewards, </span>
                    enhancing your 
                    connectivity experience.
                    </div>
                  </div>
                </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default DepinCarousel;
