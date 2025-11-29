import Link from "next/link";
import Image from "next/image";
import GradientBlinds from "./ui/gradient-blinds";

const HeroSection = () => {
  return (
    <div className='relative h-screen w-full'>
      {/* GradientBlinds - hidden on mobile, visible on desktop */}
      <div className='absolute inset-0 z-0 hidden md:block'>
        <GradientBlinds
          gradientColors={["#000000", "#1D4AAE", "#0066FF"]}
          angle={25}
          noise={0.3}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection='left'
          mixBlendMode='lighten'
        />
        {/* Improved overlay with better gradient */}
        <div className='absolute inset-0 bg-linear-to-b from-black/10 via-blue-900/30 to-black/90 pointer-events-none'>
          <Image src='/dotter.png' alt='background' height={523} width={1557} />
        </div>
      </div>

      {/* Static background image - visible on mobile only */}
      <div className='absolute inset-0 z-0 md:hidden'>
        <Image
          src='/background.png'
          alt='background'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Content */}
      <div className='relative z-20 flex flex-col md:flex-row h-full w-full items-center justify-center px-6 pt-32 md:pt-0 pointer-events-none md:max-w-6xl mx-auto'>
        <div className='basis-2/3 md:text-left flex flex-col items-center justify-center md:block px-8 md:px-0 pointer-events-auto'>
          <h1 className='mb-8 text-2xl md:text-4xl text-white'>
            new era of private,
            <br />
            <span className='bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>
              Decentralized
            </span>
            <br />
            <span className='bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>
              internet
            </span>
          </h1>
          <p className='mb-12 text-base text-blue-100 font-sans mx-auto md:mx-0'>
            Join the movement redefining freedom, <br />
            privacy, and digital sovereignty.
          </p>
          <div className='flex flex-col md:flex-row gap-4'>
            <Link href='/explorer'>
              <button
                className=' bg-white px-18 md:px-10 py-4 font-medium font-sans text-sm text-black transition-all duration-300 rounded-full md:rounded-none'
                aria-label='Explore Erebrus VPN network'
              >
                Explore VPN
              </button>
            </Link>
            <Link href='https://play.google.com/store/apps/details?id=com.erebrus.app'>
              <button
                className='text-white flex gap-4 px-18 md:px-8 items-center py-1 font-medium font-sans text-sm bg-transparent border border-white transition-all duration-300 rounded-full md:rounded-none'
                aria-label='Explore Erebrus VPN network'
              >
                <svg
                  width='23'
                  height='25'
                  viewBox='0 0 23 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M0.428163 1.05193C0.156954 1.32874 0 1.7597 0 2.31782V22.2254C0 22.7835 0.156954 23.2145 0.428163 23.4913L0.495101 23.552L11.9367 12.401V12.1377L0.495101 0.986671L0.428163 1.05193Z'
                    fill='white'
                  />
                  <path
                    d='M17.1312 16.1191L13.3215 12.4002V12.1369L17.1358 8.41804L17.2212 8.46642L21.7382 10.9723C23.0274 11.6835 23.0274 12.8537 21.7382 13.5693L17.2212 16.0707L17.1312 16.1191Z'
                    fill='white'
                  />
                  <path
                    d='M16.5287 16.7628L12.6291 12.9607L1.12061 24.1826C1.54877 24.6214 2.24699 24.6743 3.041 24.2355L16.5287 16.7628Z'
                    fill='white'
                  />
                  <path
                    d='M16.5287 7.77271L3.04094 0.300058C2.24693 -0.134281 1.54871 -0.0813964 1.12054 0.357443L12.629 11.5749L16.5287 7.77271Z'
                    fill='white'
                  />
                </svg>
                <span>
                  <span className='text-xs text-white/60'>Get it on</span>
                  <br />
                  Explore VPN
                </span>
              </button>
            </Link>
          </div>
        </div>
        <div className='basis-[45%] mt-8 md:mt-32 mb-8 md:mb-0 relative z-30 bg-red-700'>
          <Image
            src='/devices.png'
            alt='Hero Image'
            width={1000}
            height={1000}
            className='mx-auto max-w-sm md:max-w-none md:absolute -bottom-46 right-4 w-140'
            priority
          />
        </div>
      </div>

      {/* Enhanced abstract glowing elements */}
      {/* <div className='absolute left-0 hidden md:inline-block -top-10'>
        <Image
          src='/background-blur-1.png'
          alt='blur effect'
          width={765}
          height={765}
        />
      </div> */}
      {/* <div className='absolute left-1/6 hidden md:inline-block -top-10'>
        <Image
          src='/background-blur-2.png'
          alt='blur effect'
          width={500}
          height={500}
          className='brightness-50'
        />
      </div> */}
      {/* <div className='absolute right-0 -top-20 z-0'>
        <Image
          src='/background-blur-3.png'
          alt='blur effect'
          width={755}
          height={200}
          className='brightness-50'
        />
      </div> */}
    </div>
  );
};

export default HeroSection;
