import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className='relative h-screen w-full'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/background.png'
          alt='background'
          fill
          className='object-cover'
          priority
        />
        {/* Improved overlay with better gradient */}
        <div className='absolute inset-0 bg-linear-to-b from-black/10 via-blue-900/30 to-black/90'>
          {/* <Image
          src='/dotter.png'
          alt='background'
          fill
          className='object-cover'
          priority
        /> */}
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col md:flex-row h-full w-full items-center justify-center px-6 pt-32 md:pt-0'>
        <div className='md:text-left flex flex-col items-center justify-center md:block px-8 md:px-0'>
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
        <div className='basis-2/5 mt-8 md:mt-32 mb-8 md:mb-0'>
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
      {/* <div className='absolute left-1/4 top-12'>
        <Image
          src='/background-blur-1.png'
          alt='blur effect'
          width={384}
          height={384}
        />
      </div> */}
      {/* <div className='absolute right-3/4 top-0'>
        <Image
          src='/background-blur-2.png'
          alt='blur effect'
          width={320}
          height={320}
        />
      </div>
      <div className='absolute right-1/4'>
        <Image
          src='/background-blur-3.png'
          alt='blur effect'
          width={288}
          height={288}
        />
      </div> */}
    </div>
  );
};

export default HeroSection;
