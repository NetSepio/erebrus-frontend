"use client";

import HeroSection from "../components/HeroSection";
import Head from "next/head";
import PartnersMarquee from "@/components/ui/PartnersMarquee";
import Image from "next/image";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Experience } from "@/components/experience";
import VPNPlans from "@/components/vpn-plans";
import Recognition from "@/components/recognition";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/footer";
import dynamic from "next/dynamic";
import { globeConfig, sampleArcs } from "@/config/globe-config";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

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
              className='rounded-3xl relative w-5/6 flex flex-col md:flex-row items-start pt-8 md:pt-16 gap-4 md:gap-16 p-4 pb-8 md:pb-0 md:pr-30 md:top-1.5 bg-linear-to-r from-[#001655] to-[#1f4eb4]'
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% calc(100% - 75px), calc(100% - 75px) 100%, 0% 100%)",
              }}
            >
              <Image
                src='/images/world.png'
                alt='World Image'
                width={300}
                height={300}
                className='self-end -mt-8 md:mt-0'
              />
              <div className='font-sans space-y-4 pb-4 md:pb-0'>
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
        <section className='my-12 sm:my-20 md:my-40 lg:my-80 relative'>
          <div className='absolute left-0 -top-60'>
            <Image
              src='/mid-background-blur.png'
              alt='background blur'
              height={800}
              width={800}
              className='blur-sm'
            />
          </div>
          <PartnersMarquee />
        </section>
        <Experience />
        <div className='relative my-40'>
          <Image
            src='/decen.png'
            alt='accent'
            height={800}
            width={1500}
            className='absolute -top-96'
          />
        </div>
        <section className='my-40'>
          {/* <h1 className='text-[18rem] py-0 leading-none transition-transform duration-500 ease-out hover:-translate-x-8 cursor-pointer'>
            DECENTRALIZED
          </h1> */}
          <ScrollVelocity
            texts={["DECENTRALIZED"]}
            velocity={50}
            className='custom-scroll-text text-[18rem]'
          />
        </section>
        <section className='my-40 relative'>
          <Image
            src='/tralized.png'
            alt='accent'
            height={5000}
            width={1000}
            className='absolute -top-20 left-0'
          />
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

        {/* Globe background container for floating footer effect */}
        <div className='relative mt-20 md:mt-32 mb-0'>
          <div className='absolute w-full h-full' style={{ zIndex: 1 }}>
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>
          {/* Gradient overlays */}
          <div
            className='absolute top-0 left-0 w-full h-48 bg-linear-to-b from-[#020417]/90 to-transparent pointer-events-none'
            style={{ zIndex: 2 }}
          />

          <div className='relative z-10 flex items-center justify-center min-h-screen'>
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
