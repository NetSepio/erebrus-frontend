"use client"
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Howto from "../components/Howto";
import DepinCarousel from "../components/DepinCarousel";
import Pricing from "../components/Pricing";
import MobileAPK from "../components/MobileAPK";
import { motion } from "framer-motion";
import { useAddress } from "@thirdweb-dev/react";
import Link from 'next/link';
import react, { useEffect } from "react";
import Cookies from "js-cookie";
import Carousel from "./Carousel"
import Mission from "../components/Mission";
import Dvpn from "../components/Dvpn.jsx"
import Future from "../components/futureawait.tsx"
import WinnersPage from "../components/winners.tsx"
import Banner from "../components/Banner.tsx";

export default function Home() {
  

  useEffect(() => {
    parseAuthorizationCode();
  }, []);

  const parseAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    window.history.replaceState({}, document.title, window.location.pathname);
  
    if (code) {
      localStorage.setItem("code",code)
      exchangeCodeForToken(code);
      console.log("code", code)
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE_WEB2;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE_WEB2;
  const CLIENT_SECRET= process.env.NEXT_PUBLIC_CLIENT_SECRET_GOOGLE_WEB2;
  
  const exchangeCodeForToken = async (code) => {
    const tokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';
  
    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };
  
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequestBody).toString(),
      });
  
      const tokenData = await response.json();
  
      // Assuming id_token is present in tokenData
      const idToken = tokenData.id_token;
      const accessToken = tokenData.access_token;
      sendIdToken(idToken);

      console.log("token", tokenData);
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  };
  const sendIdToken = async (idToken) => {
    try {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
      const response = await fetch(`${REACT_APP_GATEWAY_URL}api/v1.0/account/auth-google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Response from server:", data);
      const token = data?.payload.token
      const userId =data?.payload.userId
      console.log("token",token)
      Cookies.set("erebrus_token", token, { expires: 7 });
      Cookies.set("erebrus_userid", userId, { expires: 7 });
      window.location.reload()
    } catch (error) {
      console.error('Error sending idToken:', error);
    }
  };

  return (
    
    <div>
     
      
     <Head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN." />
  <meta name="keywords" content="Erebrus, vpn, decentralized, mint, 111, nft, clients, netsepio, apt, aptos" />
  <title>Erebrus</title>
  <link rel="icon" href="/favicon.ico" />
  <meta property="og:image" content="/metaimg.png" />
  <meta property="og:title" content="Erebrus" />
  <meta property="og:description" content="Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN." />
</Head>

      <div className="min-h-screen relative overflow-hidden ">
    {/* <video
    className=" absolute top-0 left-0 w-full h-full object-cover  "
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/background.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video> */}

  {/* <iframe className=" absolute top-0 left-0 w-full h-full object-cover" src="https://www.youtube.com/embed/y6X1RbZ9ssE?autoplay=1&loop=1&playlist=y6X1RbZ9ssE" frameborder="0" allowfullscreen></iframe> */}
  
  <img src="/erebrus_hero.png" className="absolute top-0 left-0 w-full h-full object-cover"/>

  <div className="container mx-auto pt-20 w-[80%] relative">
    <div className="flex flex-col items-center justify-start lg:h-full md:mt-16 mt-8 mb-36">
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="lg:text-6xl text-3xl font-semibold text-white mb-6 mr-auto w-3/5"
      >
        Building the Global
        Decentralized Network
      </motion.h1>
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="lg:text-xl text-md text-white mb-8 w-3/5 mr-auto"
      >
        <p>
        Unleash the power of future internet with our ÐVPN and ÐWi-Fi 
        </p>
      </motion.h1>
      <div className="lg:flex md:flex lg:space-x-4 md:space-x-4 w-3/5 mr-auto lg:gap-5 md:gap-10 gap-0">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
          className="text-black font-bold lg:py-3 lg:px-14 md:py-3 md:px-14 py-3 px-8 rounded-full lg:text-md text-sm"
          style={{backgroundColor:'#E3EEFF'}}
        >
          <Link href="/subscription">
            Explore VPN
          </Link>
        </motion.div>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
          className="text-black font-bold lg:py-3 lg:px-14 md:py-3 md:px-14 py-3 px-8 rounded-full lg:text-md text-sm mt-4 lg:mt-0 md:mt-0"
          style={{backgroundColor:'#E3EEFF'}}
        >
          <Link href="/dwifi">
            Explore Wi-Fi
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
</div>
{/* loop */}
<Carousel/>
<Mission/>
<Dvpn/>


<div  className="py-10 gradient-background2">


<DepinCarousel />
</div>
<Future/>

      <MobileAPK />
      <WinnersPage/>

      
      {/* <div style={{ height: '22vh', background: 'linear-gradient(to top, rgba(9, 12, 21, 1), rgba(5, 8, 25, 1))', transform: 'rotate(0deg)' }}>
    </div> */}

      <div className="min-h-screen mx-auto py-20 w-full flex items-center justify-center bg-cover bg-[url('/revolution.png')]">
  <div className="lg:w-1/2 md:w-1/2 background-gradient lg:py-10 md:py-10 py-5 rounded-3xl mx-4 lg:mx-0 md:mx-0">
    <div className="flex flex-col items-center justify-start lg:h-full mt-10 lg:ml-0 lg:mr-0 md:ml-0 md:mr-0 ml-4 mr-4 lg:mb-0 mb-2">
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="lg:text-4xl md:text-3xl text-2xl text-gray-300 mb-10 text-center lg:w-2/3 md:w-2/3"
        style={{ lineHeight: '1.2'}}
      >
        Revolutionizing Internet Access Through the Power of DePIN
      </motion.h1>
      <motion.p
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="lg:text-lg md:text-lg text-lg text-gray-300 mb-8 text-center"
      >
        Subscribe for insights from our DePIN experts.
      </motion.p>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
        className="text-black font-semibold py-2 px-14 rounded-full bg-white text-lg"
        // style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
      >
        <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank" rel="noopener noreferrer">
          Subscribe
        </Link>
      </motion.div>
    </div>
  </div>
</div>

      <Footer />
    </div>
  );
}