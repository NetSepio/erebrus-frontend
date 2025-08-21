"use client";

import HeroSection from "../components/HeroSection";
import Head from "next/head";
import DePINRevolutionComponent from "@/components/ui/map";
import SubscriptionCard from "@/components/subs";
import CyreneAISection from "@/components/ui/cyrene";
import VPNContentSection from "@/components/ui/vpnContent";
import PartnersMarquee from "@/components/ui/PartnersMarquee";
import Image from "next/image";
import Link from "next/link";
import { ScrollProgress } from "@/components/ui/scroll-progress";

function Page() {
  return (
    <>
      <Head>
        <title>Erebrus - Decentralized VPN Network</title>
        <meta
          name="description"
          content="Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN."
        />
        <link rel="canonical" href="https://erebrus.io" />
      </Head>
      <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
        <ScrollProgress color="#3b82f6" height={4} />

        <HeroSection />
        <div className="pt-12">
          <PartnersMarquee />
        </div>
        <DePINRevolutionComponent />
        <CyreneAISection />
        <VPNContentSection />

        <section className="w-full py-20 flex flex-col items-center justify-center text-white">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent text-center">
              Decentralized for Speed and Privacy
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left side: Lock animation */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-64 md:h-96">
                  <video
                    src="/animations/lock.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-contain w-full h-full rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Right side: Text content */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Protected & Private
                </h3>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  Erebrus DVPN encrypts your connection, hides your activity,
                  and keeps speeds lightning fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SubscriptionCard />

        <section className="w-full py-24 flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-900 to-black">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              Recognition
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/radarthack_white.webp"
                  alt="RADAR"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/ethsea_white.webp"
                  alt="ETH SEA"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center col-span-2 md:col-span-1 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-left space-y-3">
                  <a
                    href="https://arena.colosseum.org/projects/explore/netsepio?previous=L3Byb2plY3RzL2V4cGxvcmU_c2VlZD1iNGI0ZTYwYzViNGE0NzkwJnNlYXJjaD1uZXRzZXA"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      4th Place Solana Radarhack DePIN
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://netsepio.substack.com/p/erebrus-protocol-by-netsepio-wins"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      Grand Prize at ETH SEA Demoday, Bali
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/ivscrypto_white.webp"
                  alt="IVS"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/aptos_white.webp"
                  alt="APTOS"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center col-span-2 md:col-span-1 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-left space-y-3">
                  <a
                    href="https://x.com/NetSepio/status/1810538904186982587"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      Grand Prize at IVS Crypto Demoday, Japan
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://x.com/overmind_xyz/status/1701980625128071375"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      Grand Prize at Aptos Hackathon, Singapore
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/soonami_white.webp"
                  alt="soonami.io"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <Image
                  src="/recognition/akindo_white.webp"
                  alt="AKINDO"
                  width={150}
                  height={80}
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex items-center justify-center col-span-2 md:col-span-1 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-left space-y-3">
                  <a
                    href="https://soonami.io/post/soonami-cohort-4-winners"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      On the Fast Track Prize at Soonaml Ventureshare
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://app.akindo.io/communities/0n1VBlaXvCRPQVDG/products/La4OvOMglhWdMwjp"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center group hover:text-blue-300 transition-colors"
                  >
                    <span className="mr-2">
                      Several Prizes at Akindo WaveCheck
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <p className="text-lg mb-16 text-blue-100">+ many more!!</p>

            <div className="flex flex-col items-center justify-center space-y-4 mb-10">
              <Image
                src="/images/Erebrus_logo_wordmark.webp"
                alt="Erebrus powered by NetSepio"
                width={300}
                height={100}
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <div className="text-2xl font-medium text-blue-100 mb-8">
              Join the Movement. Get Started Now.
            </div>

            <a
              href="https://discordapp.com/invite/5uaFhNpRF6"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default Page;
