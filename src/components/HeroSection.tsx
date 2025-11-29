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
      <div className='relative z-20 flex flex-col md:flex-row h-full w-full items-center justify-center px-6 pt-32 md:pt-0 pointer-events-none'>
        <div className='md:text-left flex flex-col items-center justify-center md:block px-8 md:px-0 pointer-events-auto'>
          <h1 className='mb-8 text-2xl md:text-3xl font-bold text-white'>
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
          <Link href='/explorer'>
            <button
              className=' bg-white px-18 py-4 font-medium font-sans text-sm text-black transition-all duration-300 rounded-full md:rounded-none'
              aria-label='Explore Erebrus VPN network'
            >
              Explore VPN
            </button>
          </Link>
        </div>
        <div className='basis-2/5 mt-8 md:mt-32 mb-8 md:mb-0 relative z-30'>
          <Image
            src='/devices.png'
            alt='Hero Image'
            width={800}
            height={800}
            className='mx-auto w-full max-w-sm md:max-w-none'
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
