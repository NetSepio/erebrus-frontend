/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

// Improve the subscription card component
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { Shield, Lock, Database, Zap, Smartphone, ChevronRight } from "lucide-react"

export default function SubscriptionCard() {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isHovered) {
      setIsAnimating(true)
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const elementPosition = document.getElementById("subscription-section")?.offsetTop || 0

      if (scrollPosition > elementPosition - 200) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHovered])

  const handleMouseMove = (e: any) => {
    if (!isHovered) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      id="subscription-section"
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-6 py-24"
    >
      <div
        className={`w-full flex flex-wrap gap-10 justify-center transition-all duration-1000 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-20"}`}
        onMouseMove={handleMouseMove}
      >
        {/* Glow background effect */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-900/5 blur-3xl rounded-full pointer-events-none"></div>

        {/* Subscription Card */}
        <div
          className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 flex-1 min-w-[320px] max-w-[500px] relative overflow-hidden transition-all duration-500 ${isHovered ? "shadow-lg shadow-blue-900/20 transform scale-105" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Dynamic highlight effect */}
          <div
            className={`absolute bg-blue-500/10 w-64 h-64 rounded-full blur-3xl transition-opacity duration-1000 ${isHovered ? "opacity-100" : "opacity-0"}`}
            style={{
              left: `${mousePosition.x - 128}px`,
              top: `${mousePosition.y - 128}px`,
            }}
          ></div>

          {/* Card accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

          <div className="relative">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 mb-2">
              PREMIUM
            </span>
            <h2 className="text-gray-100 text-2xl font-bold mb-2">Quantum Tier Subscription</h2>
            <p className="text-gray-400 text-sm mb-6">Advanced security & networking features</p>

            <div className="flex items-baseline mb-8">
              <span className="text-white text-4xl font-bold">$5.99</span>
              <span className="text-gray-500 ml-2">/month</span>
              <span className="ml-3 text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">SAVE 40%</span>
            </div>

            <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-md py-3 px-4 text-center text-white font-medium mb-8 shadow-lg shadow-blue-900/20 cursor-pointer hover:shadow-blue-900/40 transition-all duration-300">
              <span className={`inline-block transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}>
                Start 7-Day Free Trial
              </span>
            </div>


            <ul className="space-y-4 mb-8">
              {[
                { icon: <Lock size={16} />, text: "Decentralized Zero-Trust Network" },
                { icon: <Shield size={16} />, text: "Multi-layer Quantum Encryption" },
                { icon: <Database size={16} />, text: "Real-time Threat Analysis & Prevention" },
                { icon: <Zap size={16} />, text: "AI-powered Security Insights" },
                { icon: <Smartphone size={16} />, text: "Cross-platform Secure Access" },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center text-gray-400 transition-all duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 mr-3">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Features Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 flex-1 min-w-[320px] max-w-[500px] relative overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-500">
          {/* Card accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

          <div className="flex items-center mb-8">
            <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
            <h2 className="text-white text-2xl font-bold">Advanced Features</h2>
          </div>

          <div className="space-y-8">
            {[
              {
                number: "01",
                title: "Military-Grade Security",
                description: "256-bit AES encryption with perfect forward secrecy",
              },
              {
                number: "02",
                title: "Enhanced Privacy Protocol",
                description: "Distributed node architecture with zero-knowledge validation",
              },
              {
                number: "03",
                title: "Complete Data Sovereignty",
                description: "Full control over your digital footprint with no logging policy",
              },
              {
                number: "04",
                title: "Optimized Connection Routing",
                description: "AI-driven path optimization for minimal latency",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 hover:translate-x-2 group`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start">
                  <span className="text-blue-500 font-mono mr-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    {feature.number}
                  </span>
                  <div>
                    <h3 className="text-gray-100 font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500">{feature.description}</p>
                  </div>
                </div>
                {index < 3 && <div className="w-full h-px bg-gray-800 mt-8"></div>}
              </div>
            ))}
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}
