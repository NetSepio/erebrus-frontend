import { MoonStar, MessageSquare, Shield } from "lucide-react";
import Image from "next/image";

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
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Private, Secure, and Censorship-Free Internet
            </p>
          </div>

          {/* Animation and Image Side by Side */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 max-w-5xl mx-auto">
            {/* Left side: Animation */}
            <div className="flex justify-center lg:w-1/2">
              <div className="relative w-full max-w-lg">
                <video
                  src="/animations/freedom.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-64 md:h-80 rounded-2xl"
                />
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </div>

            {/* Right side: Phone images */}
            <div className="flex justify-center lg:w-1/2">
              <div className="relative">
                <Image
                  src="/Erebrus_Mobile.webp"
                  alt="Erebrus Mobile App"
                  className="w-full max-w-md object-contain z-10 relative"
                  width={500}
                  height={500}
                  sizes="100vw"
                />
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </div>
          </div>

          {/* Centered App Buttons */}
          <div className="flex justify-center">
            <div className="flex flex-row space-x-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.erebrus.app"
                target="_blank"
                rel="noreferrer"
                className="bg-black border border-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
              <a
                href="https://testflight.apple.com/join/BvdARC75"
                target="_blank"
                rel="noreferrer"
                className="bg-black border border-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* SECOND SECTION: Meet CyreneAI */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              Meet CyreneAI
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your Intelligent Digital Companion
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side: Only Animation */}
            <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center relative">
              <div className="relative w-full max-w-md flex flex-col items-center">
                <video
                  src="/animations/AI-agents.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full rounded-2xl"
                />
                <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-3xl font-bold mb-6 text-blue-100">
                Your Cosmic Guide into the Agentic Future
              </h3>

              <p className="text-gray-300 mb-8 text-lg">
                Chat with Cyrene, our advanced AI assistant integrated into
                Erebrus applications, ready to answer your questions and provide
                instant assistance, across space and time.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <MoonStar className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Intelligent Assistance
                    </h4>
                    <p className="text-gray-400">
                      Get the help you need, anytime, anywhere with
                      context-aware responses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <MessageSquare className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Natural Conversations
                    </h4>
                    <p className="text-gray-400">
                      Interact with an AI that understands natural language and
                      context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                    <Shield className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Privacy-Focused
                    </h4>
                    <p className="text-gray-400">
                      Your conversations stay private with end-to-end
                      encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
