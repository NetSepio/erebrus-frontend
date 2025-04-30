"use client";

// Improve the VPN content section
import { useState, useEffect } from "react";
import { Shield, Network, Layers, Zap, Globe, Lock } from "lucide-react";

export default function VPNContentSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementPosition =
        document.getElementById("vpn-content")?.offsetTop || 0;

      if (scrollPosition > elementPosition) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      title: "Last Mile Safe Internet",
      description:
        "No censorship or geo-restrictions with enhanced security and privacy.",
      icon: <Shield className="w-8 h-8 text-blue-300" />,
      delay: "0",
    },
    {
      title: "CyreneAI Coordination Layer",
      description:
        "Communication layer for apps and AI agents with sensitive data. Multi-agent coordination with discovery & access control.",
      icon: <Layers className="w-8 h-8 text-blue-300" />,
      delay: "150",
    },
    {
      title: "DNS Firewall",
      description:
        "Block adware, spyware and malware with targeted network protection.",
      icon: <Network className="w-8 h-8 text-blue-300" />,
      delay: "300",
    },
    {
      title: "Lightning Fast Speeds",
      description:
        "Optimized routing and high-performance nodes ensure minimal latency.",
      icon: <Zap className="w-8 h-8 text-blue-300" />,
      delay: "450",
    },
    {
      title: "Global Coverage",
      description:
        "Access content from anywhere with our worldwide node network.",
      icon: <Globe className="w-8 h-8 text-blue-300" />,
      delay: "600",
    },
    {
      title: "Military-Grade Encryption",
      description:
        "Your data is protected with the highest level of encryption available.",
      icon: <Lock className="w-8 h-8 text-blue-300" />,
      delay: "750",
    },
  ];

  return (
    <div
      id="vpn-content"
      className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white py-24 px-6"
    >
      <div
        className={`max-w-6xl mx-auto transition-all duration-1000 ${
          visible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent mb-6">
            Your Content Delivery, Uninterrupted!
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Launch your own VPN and AI agents for sovereign and private
            experience
          </p>
        </div>

        {/* Cards with flex-wrap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-gray-700 transform transition-all duration-700 hover:scale-105 hover:shadow-blue-900/20 hover:shadow-lg group"
              style={{
                transitionDelay: `${card.delay}ms`,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                opacity: visible ? 1 : 0,
              }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 p-4 bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-900/30 transition-all duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-400 flex-grow">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <a
           href="https://docs.netsepio.com/latest/erebrus/setup"
           target="_blank"
           rel="noreferrer"
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-500 flex items-center group shadow-lg hover:shadow-blue-900/20">
            <span className="transform transition-transform group-hover:translate-x-1 text-lg">
              Deploy Your Node
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
          <a 
               href="https://www.cyreneai.com/launch-agent"
               target="_blank"
               rel="noreferrer"
           className="px-8 py-4 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-600/30 flex items-center group">
            <span className="transform transition-transform group-hover:translate-x-1 text-lg">
              Launch Agent
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
