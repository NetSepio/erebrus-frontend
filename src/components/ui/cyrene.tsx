import { MoonStar, MessageSquare, Shield } from "lucide-react"
import Image from "next/image"

export default function VPNandAISections() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white py-24">
      <div className="container mx-auto px-6">
        {/* FIRST SECTION: Decentralized VPN */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              Decentralized VPN
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Private, Secure, and Censorship-Free Internet</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side: Buttons */}
            <div className="flex flex-col space-y-5 md:w-1/3 order-2 md:order-1">
              <a
                 href="https://play.google.com/store/apps/details?id=com.erebrus.app"
                 target="_blank"
                 rel="noreferrer"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium w-48 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
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
                  className="mr-2"
                >
                  <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                  <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="m2 2 7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
                Play Store
              </a>
              <a
               href="https://testflight.apple.com/join/BvdARC75"
               target="_blank"
               rel="noreferrer"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium w-48 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
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
                  className="mr-2"
                >
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                  <path d="M10 2c1 .5 2 2 2 5"></path>
                </svg>
                iOS Test Flight
              </a>
              <a
               href="https://erebrus.io/"
               target="_blank"
               rel="noreferrer"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-48 hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center">
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
                  className="mr-2"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"></path>
                  <path d="m16 12-4-4-4 4"></path>
                  <path d="M12 16V8"></path>
                </svg>
                Web App
              </a>
            </div>

            {/* Right side: Phone images */}
            <div className="md:w-2/3 order-1 md:order-2 mb-8 md:mb-0 flex justify-center relative">
              <div className="relative">
                <Image
                  src="/Erebrus_Mobile.webp"
                  alt="Erebus Mobile App"
                  className="w-full max-w-md object-contain z-10 relative"
                  width={500}
                  height={500}
                   sizes='100vw'
                />
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* SECOND SECTION: Meet CyreneAI */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              Meet CyreneAI
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Your Intelligent Digital Companion</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side: Image */}
            <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center relative">
              <div className="relative">
                <Image
                  src="/Cyrene.webp"
                  alt="Cyrene AI Interface"
                  className="w-full max-w-md object-contain z-10 relative"
                  width={500}
                  height={500}
                   sizes='100vw'
                />
                <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-3xl font-bold mb-6 text-blue-100">Your Cosmic Guide into the Agentic Future</h3>

              <p className="text-gray-300 mb-8 text-lg">
                Chat with Cyrene, our advanced AI assistant integrated into Erebus applications, ready to answer your
                questions and provide instant assistance, across space and time.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <MoonStar className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Intelligent Assistance</h4>
                    <p className="text-gray-400">
                      Get the help you need, anytime, anywhere with context-aware responses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <MessageSquare className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Natural Conversations</h4>
                    <p className="text-gray-400">Interact with an AI that understands natural language and context.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <Shield className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Privacy-Focused</h4>
                    <p className="text-gray-400">Your conversations stay private with end-to-end encryption.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
