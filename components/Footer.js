import React from "react";

const Footer = () => {
  
  const links = [
    { label: "About NetSepio", url: "https://netsepio.com/" },
    { label: "Meet CyreneAI", url: "https://www.cyreneai.com/" },
    { label: "Terms and Conditions", url: "https://erebrus.io/terms" },
    { label: "Privacy Policy", url: "https://erebrus.io/privacy" },
  ];

  return (
    <div
      className="bg-cover bg-center text-left"
      style={{ backgroundImage: "url('/Footer.png')" }}
    >
      <div className="flex flex-wrap justify-between items-stretch w-[70%] mx-auto py-8">
        <div>
          <img
            src="/Erebrus_logo_wordmark.webp"
            alt="NetSepio-Logo"
            className="h-20"
          />
          <h1 className="text-white text-lg font-normal pt-8">
            Redefining digital connectivity by <br /> unlocking a secure,
            private, and <br />
            globally accessible internet <br /> through the power of DePIN.
          </h1>
        </div>

        <div className="flex flex-col min-h-full">
          <h1 className="text-2xl text-white font-normal pt-4 pb-8">Explore</h1>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-white text-lg font-normal no-underline block py-2 flex items-center gap-2"
            >
              {link.label} <img src="/arrow.webp" alt="up-arrow" />
            </a>
          ))}
        </div>

        <div className="flex flex-col min-h-full">
          <h1 className="text-2xl text-white font-normal pt-4 pb-8">
            Get Erebrus
          </h1>
          {[
            { name: "Play Store", url: "https://play.google.com/store/apps/details?id=com.erebrus.app" },
            { name: "App Store", url: "https://testflight.apple.com/join/BvdARC75" },
            {
              name: "WebApp",
              url: "/",
            },
          ].map((product, index) => (
            <a
              key={index}
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="text-white text-lg font-normal no-underline block py-2 flex items-center gap-2"
            >
              {product.name} <img src="/arrow.webp" alt="up-arrow" />
            </a>
          ))}
        </div>

        <div className="flex flex-col min-h-full">
          <h1 className="text-2xl text-white font-normal pt-4 pb-8">Connect</h1>
          <div className="flex items-center gap-4 py-2">
            {[
              {
                name: "Telegram",
                url: "https://t.me/NetSepio",
                img: "Telegram.png",
              },
              {
                name: "Github",
                url: "https://github.com/Netsepio",
                img: "github_blue.webp",
              },
              {
                name: "Discord",
                url: "https://discordapp.com/invite/5uaFhNpRF6",
                img: "discord_blue.webp",
              },
            ].map((social, index) => (
              <a key={index} href={social.url} target="_blank" rel="noreferrer">
                <img
                  src={`/${social.img}`}
                  alt={social.name}
                  className="rounded-xl h-[40px]"
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 py-2">
            {[
              {
                name: "Linkedin",
                url: "https://www.linkedin.com/company/netsepio/",
                img: "Linkedin.png",
              },
              {
                name: "X",
                url: "https://x.com/netsepio",
                img: "twitter_blue.webp",
              },
            ].map((social, index) => (
              <a key={index} href={social.url} target="_blank" rel="noreferrer">
                <img
                  src={`/${social.img}`}
                  alt={social.name}
                  className="rounded-xl h-[40px]"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[70%] mx-auto border-t border-[#0162FF]"></div>

      <div className="text-center pb-8 pt-8">
        <h1 className="text-white text-sm">
          © 2025 - NetSepio. All rights reserved.
        </h1>
      </div>
    </div>
  );
};

export default Footer;
