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
import { Experience } from "@/components/experience";
import VPNPlans from "@/components/vpn-plans";
import Recognition from "@/components/recognition";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/footer";

function Page() {
  return (
    <>
      <Head>
        <title>Erebrus - Decentralized VPN Network</title>
        <meta
          name='description'
          content='Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.'
        />
        <link rel='canonical' href='https://erebrus.io' />
      </Head>
      <main className='bg-[#020417] min-h-screen overflow-hidden'>
        <ScrollProgress color='#3b82f6' height={4} />

        <section className='pt-8 sm:pt-12 md:pt-16 lg:pt-10 pb-12 sm:pb-16 md:pb-20 lg:pb-16'>
          <HeroSection />
          <div className='bg-linear-to-b from-[#080217] to-[#080217] h-auto min-h-32 sm:min-h-36 md:h-24 lg:h-30 flex items-center justify-center relative'>
            <div
              className='rounded-2xl relative w-5/6 flex flex-col md:flex-row items-end pt-8 md:pt-16 gap-4 md:gap-16 p-4 md:pr-30 pb-0 md:top-1.5'
              style={{
                background: "linear-gradient(to right, #001655, #1f4eb4)",
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
              }}
            >
              <Image
                src='/images/world.png'
                alt='World Image'
                width={300}
                height={300}
                className='self-end'
              />
              <div className='font-sans space-y-4 md:text-left mb-4 md:mb-8'>
                <div className='rounded-full text-white capitalize bg-black/20 w-fit px-4 md:mx-0'>
                  erebrus
                </div>
                <h3 className='text-lg md:text-xl'>
                  Pioneering Private Digital Freedom
                </h3>
                <p className='text-sm text-[#D3DCE8]'>
                  Erebrus delivers a decentralized VPN designed to put you in
                  control of your online life. Protect your data, safeguard your
                  privacy, and connect freely in a network built for security,
                  transparency, and digital sovereignty.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className='my-12 sm:my-20 md:my-40 lg:my-60'>
          <PartnersMarquee />
        </section>
        <Experience />
        <section className=' overflow-hidden pl-8'>
          <h1 className='text-[20rem] py-0 leading-none'>DECENTRALIZED</h1>
        </section>
        <VPNPlans />
        <Recognition />
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 py-12'>
          <h3 className='text-xl md:text-2xl text-white text-center'>
            Join the Movement. Get Started Now
          </h3>
          <button className='py-4 px-8 text-base bg-linear-to-r from-[#002C8A] to-[#315FC4] flex items-center gap-4'>
            <span>Get Started </span>
            <ArrowRight color='white' />
          </button>
        </div>

        {/* Background image container for floating footer effect */}
        <div className='relative mt-20 md:mt-32 mb-0'>
          <div
            className='absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: "url('/images/world-background.png')",
              zIndex: 1,
            }}
          />
          <div className='relative z-10 pt-16 md:pt-24 pb-8 md:pb-16'>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
