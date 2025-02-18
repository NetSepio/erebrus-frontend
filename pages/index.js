"use client";
import Head from "next/head";
import Footer from "../components/Footer";
import DepinCarousel from "../components/DepinCarousel";
import MobileAPK from "../components/MobileAPK";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Mission from "../components/Mission";
import Dvpn from "../components/Dvpn.jsx";
import Future from "../components/futureawait.tsx";
import WinnersPage from "../components/winners.tsx";

export default function Home() {
  useEffect(() => {
    parseAuthorizationCode();
  }, []);

  const parseAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    window.history.replaceState({}, document.title, window.location.pathname);

    if (code) {
      localStorage?.setItem("code", code);
      exchangeCodeForToken(code);
      console.log("code", code);
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE_WEB2;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE_WEB2;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET_GOOGLE_WEB2;

  const exchangeCodeForToken = async (code) => {
    const tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";

    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
      console.error("Token exchange error:", error);
    }
  };
  const sendIdToken = async (idToken) => {
    try {
      const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}api/v1.0/account/auth-google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();
      console.log("Response from server:", data);
      const token = data?.payload.token;
      const userId = data?.payload.userId;
      console.log("token", token);
      Cookies.set("erebrus_token", token, { expires: 7 });
      Cookies.set("erebrus_userid", userId, { expires: 7 });
      window.location.reload();
    } catch (error) {
      console.error("Error sending idToken:", error);
    }
  };

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN."
        />
        <meta
          name="keywords"
          content="Erebrus, vpn, decentralized, mint, 111, nft, clients, netsepio, apt, aptos"
        />
        <title>Erebrus</title>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:title" content="Erebrus" />
        <meta
          property="og:description"
          content="Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN."
        />
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

        <img
          src="/erebrus_hero.webp"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div
          className="text-white text-left text-5xl lg:text-8xl font-normal"
          style={{
            position: "absolute",
            top: "40%",
            left: "5%",
            transform: "translate(-0%, -50%)",
          }}
        >
          <h1>
            Building the Global <br /> Decentralized Network
          </h1>
          <div className="flex gap-8 mt-6">
            <a
              href="https://erebrus.io/explorer"
              target="_blank"
              rel="noreferrer"
            >
              <button className="px-6 py-4 lg:px-12 lg:py-4 bg-[#5696FF] text-white rounded-lg text-base font-bold cursor-pointer">
                Explore VPN
              </button>
            </a>
            <a href="https://erebrus.io/dwifi" target="_blank" rel="noreferrer">
              <button className="px-6 py-4 lg:px-12 lg:py-4 bg-[#5696FF] text-white rounded-lg text-base font-bold cursor-pointer">
                Explore Wifi
              </button>
            </a>
          </div>
        </div>
      </div>
      {/* loop */}
      <Mission />
      <Dvpn />
      <div className="gradient-background2">
        <DepinCarousel />
      </div>
      <MobileAPK />

      <Future />

      <WinnersPage />

      {/* <div style={{ height: '22vh', background: 'linear-gradient(to top, rgba(9, 12, 21, 1), rgba(5, 8, 25, 1))', transform: 'rotate(0deg)' }}>
    </div> */}

      <div>
        <div
          className="bg-[#040a20] text-center p-5"
          style={{
            backgroundImage: "url('/Light_Background.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="flex justify-center">
            <img src="/Erebrus_logo_wordmark.webp" />
          </div>
          <h1 className="text-white text-3xl lg:text-5xl pt-16 lg:pb-14">
            Join the Movement. Get Started Now.
          </h1>
          <div className="flex justify-center items-center gap-12 pt-12 pb-40">
            <a
              href="https://discordapp.com/invite/5uaFhNpRF6"
              target="_blank"
              rel="noreferrer"
            >
              <button className="lg:px-12 lg:py-4 lg:text-lg px-8 py-4 text-sm border-2 border-[#0162FF] bg-transparent text-white rounded-lg font-bold cursor-pointer">
                Discord
              </button>
            </a>
            <a href="https://t.me/NetSepio" target="_blank" rel="noreferrer">
              <button className="lg:px-12 lg:py-4 lg:text-lg px-8 py-4 text-sm border-2 border-[#0162FF] bg-transparent text-white rounded-lg font-bold cursor-pointer">
                Telegram
              </button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
