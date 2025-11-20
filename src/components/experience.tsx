import Image from "next/image";

export function Experience() {
  return (
    <section>
      <div className='text-center'>
        <h2 className='text-2xl md:text-3xl font-bold bg-white bg-clip-text text-transparent px-4'>
          <span className='text-blue-500'>/</span>Your Content Delivery,
          Uninterrupted!
        </h2>
        <p className='text-sm md:text-base font-sans mt-4 px-4'>
          Launch your own VPN for sovereign and private experience
        </p>
      </div>

      <div className='flex md:grid md:grid-cols-5 mx-auto gap-x-8 max-w-6xl my-24 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none px-4 md:px-0'>
        {/* Card 1 */}
        <div className='relative card pt-20 shrink-0 snap-center md:snap-align-none'>
          {/* Flag image positioned outside the card */}
          <Image
            src='/images/flag.png'
            alt='Flag '
            width={150}
            height={150}
            className='absolute z-20 left-8 top-0'
          />

          {/* Flag shadow positioned inside the card */}
          <Image
            src='/images/flag-shadow.png'
            alt='Flag Shadow'
            width={150}
            height={150}
            className='absolute z-10 left-8 top-24'
          />

          <div
            className='rounded-2xl relative grid place-items-center p-4 space-y-6 h-80 w-56'
            style={{
              background: "linear-gradient(to bottom, #000000, #1D4AAE)",
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
            }}
          >
            <div className='font-sans space-y-4 self-end'>
              <h3 className='text-xl text-white'>Last Mile Safe Internet</h3>
              <p className='text-sm text-[#D3DCE8]'>
                No censorship or geo-restrictions with enhanced security and
                privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className='relative card pt-20 shrink-0 snap-center md:snap-align-none'>
          {/* Flag image positioned outside the card */}
          <Image
            src='/images/shield.png'
            alt='Shield'
            width={150}
            height={150}
            className='absolute z-20 left-8 top-0'
          />

          {/* Flag shadow positioned inside the card */}
          <Image
            src='/images/shield-shadow.png'
            alt='Shield Shadow'
            width={150}
            height={150}
            className='absolute z-10 left-8 top-24'
          />

          <div
            className='rounded-2xl relative grid place-items-center p-4 space-y-6 h-80 w-56'
            style={{
              background: "linear-gradient(to bottom, #000000, #1D4AAE)",
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
            }}
          >
            <div className='font-sans space-y-4 self-end'>
              <h3 className='text-xl text-white'>DNS Firewall</h3>
              <p className='text-sm text-[#D3DCE8]'>
                Block adware, spyware and malware with targeted network
                protection.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className='relative card pt-20 shrink-0 snap-center md:snap-align-none'>
          {/* Flag image positioned outside the card */}
          <Image
            src='/images/map-pin.png'
            alt='Map pin'
            width={150}
            height={150}
            className='absolute z-20 left-8 top-0'
          />

          {/* Flag shadow positioned inside the card */}
          <Image
            src='/images/map-pin-shadow.png'
            alt='Map pin Shadow'
            width={150}
            height={150}
            className='absolute z-10 left-8 top-24'
          />

          <div
            className='rounded-2xl relative grid place-items-center p-4 space-y-6 h-80 w-56'
            style={{
              background: "linear-gradient(to bottom, #000000, #1D4AAE)",
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
            }}
          >
            <div className='font-sans space-y-4 self-end'>
              <h3 className='text-xl text-white'>Global Coverage</h3>
              <p className='text-sm text-[#D3DCE8]'>
                Access content from anywhere with our worldwide node network.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className='relative card pt-20 shrink-0 snap-center md:snap-align-none'>
          {/* Flag image positioned outside the card */}
          <Image
            src='/images/flash.png'
            alt='Flash '
            width={150}
            height={150}
            className='absolute z-20 left-8 top-0'
          />

          {/* Flag shadow positioned inside the card */}
          <Image
            src='/images/flash-shadow.png'
            alt='Flash Shadow'
            width={150}
            height={150}
            className='absolute z-10 left-8 top-24'
          />

          <div
            className='rounded-2xl relative grid place-items-center p-4 space-y-6 h-80 w-56'
            style={{
              background: "linear-gradient(to bottom, #000000, #1D4AAE)",
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
            }}
          >
            <div className='font-sans space-y-4 self-end'>
              <h3 className='text-xl text-white'>Lightning Fast Speeds</h3>
              <p className='text-sm text-[#D3DCE8]'>
                Optimized routing and high-performance nodes ensure minimal
                latency.
              </p>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className='relative card pt-20 shrink-0 snap-center md:snap-align-none'>
          {/* Flag image positioned outside the card */}
          <Image
            src='/images/lock.png'
            alt='Lock '
            width={150}
            height={150}
            className='absolute z-20 left-8 top-0'
          />

          {/* Flag shadow positioned inside the card */}
          <Image
            src='/images/lock-shadow.png'
            alt='Lock Shadow'
            width={150}
            height={150}
            className='absolute z-10 left-8 top-24'
          />

          <div
            className='rounded-2xl relative grid place-items-center p-4 space-y-6 h-80 w-56'
            style={{
              background: "linear-gradient(to bottom, #000000, #1D4AAE)",
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%)",
            }}
          >
            <div className='font-sans space-y-4 self-end'>
              <h3 className='text-xl text-white'>Military-Grade Encryption</h3>
              <p className='text-sm text-[#D3DCE8]'>
                Your data is protected with the highest level of encryption
                available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
