import React from "react";

const Winners: React.FC = () => {
  const images = [
    "radarthack",
    "ethsea",
    "ivscrypto",
    "aptos",
    "soonami",
    "akindo",
  ];

  const links = [
    {
      text: "4th Place Solana Radarhack DePIN",
      url: "https://arena.colosseum.org/projects/explore/netsepio?previous=L3Byb2plY3RzL2V4cGxvcmU_c2VlZD1iNGI0ZTYwYzViNGE0NzkwJnNlYXJjaD1uZXRzZXA",
    },
    {
      text: "Grand Prize at ETH SEA Demoday, Bali",
      url: "https://netsepio.substack.com/p/erebrus-protocol-by-netsepio-wins",
    },
    {
      text: "Grand Prize at IVS Crypto Demoday, Japan",
      url: "https://x.com/NetSepio/status/1810538904186982587",
    },
    {
      text: "Grand Prize at Aptos Hackathon, Singapore",
      url: "https://x.com/overmind_xyz/status/1701980625128071375",
    },
    {
      text: "On the Fast Track Prize at Soonami Venturethon",
      url: "https://soonami.io/post/soonami-cohort-4-winners",
    },
    {
      text: "Several Prizes at Akindo WaveChack",
      url: "https://app.akindo.io/communities/0n1VBlaXvCRPQVDG/products/La4OvOMglhWdMwjp",
    },
  ];

  return (
    <div className="flex justify-center items-center pt-40 bg-[#040a20] text-center pb-40">
      <div>
        <h1 className="lg:text-7xl md:text-4xl sm:text-3xl text-5xl pb-20 text-center text-white">
          Recognition
        </h1>
        <div className="flex flex-wrap justify-center items-center">
          <div className="flex flex-wrap justify-center gap-4 items-center lg:w-[30%] w-[100%]">
            {images.map((img) => (
              <img
                key={img}
                src={`/${img}_white.webp`}
                alt={img}
                className="w-[25%] lg:w-[40%]"
              />
            ))}
          </div>
          <div className="text-left text-white px-8 pt-14 lg:pt-0">
            {links.map((item) => (
              <a
                key={item.text}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="no-underline text-white flex items-center gap-2 hover:text-gray-300"
              >
                <h2 className="text-xl lg:text-3xl flex items-center gap-2 mb-4">
                  {item.text}{" "}
                  <img
                    src="/arrow.webp"
                    alt="arrow"
                    className="lg:w-[50px] w-[30px]"
                  />
                </h2>
              </a>
            ))}
            <br />
            <h2 className="text-lg lg:text-3xl">+ many more!!</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Winners;
