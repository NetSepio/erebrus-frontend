import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Recognition() {
  return (
    <section className='max-w-5xl mx-auto my-12 md:my-18 px-4'>
      <h2 className='text-2xl md:text-3xl text-white text-center md:text-left'>
        <span className='text-[#2283F6] '>/</span>WE'VE BEEN <br /> RECOGNIZED
      </h2>

      <div className='flex flex-col md:flex-row md:items-center md:justify-between my-8 md:my-12'>
        {/* Diamond on top for mobile, right side for desktop */}
        <div className='order-first md:order-last'>
          <Image
            src='/images/diamond.png'
            alt='Diamond'
            width={500}
            height={500}
            className='mx-auto md:mx-0 max-w-[200px] md:max-w-[400px] lg:max-w-[500px] h-auto'
          />
        </div>
        <div className='text-base space-y-4 md:space-y-6 font-sans w-full md:w-auto'>
          <Link
            href='https://arena.colosseum.org/projects/explore/netsepio?previous=L3Byb2plY3RzL2V4cGxvcmU_c2VlZD1iNGI0ZTYwYzViNGE0NzkwJnNlYXJjaD1uZXRzZXA'    
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/recognition/radar-hack.png'
                alt='Radar Hack'
                width={65}
                height={25}
              />
              <span className='text-sm'>4th Place Solana Radarhack DePIN</span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
          <Link
            href='https://netsepio.substack.com/p/erebrus-protocol-by-netsepio-wins'
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/recognition/eth-sea.png'
                alt='ETH Sea'
                width={65}
                height={25}
              />
              <span className='text-sm'>
                Grand Prize at ETH SEA Demoday, Bali
              </span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
          <Link
            href='https://x.com/NetSepio/status/1810538904186982587'
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/recognition/ivs.png'
                alt='IVS Crypto'
                width={50}
                height={25}
              />
              <span className='text-sm'>
                Grand Prize at IVS Crypto Demoday, Japan
              </span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
          <Link
            href='https://x.com/overmind_xyz/status/1701980625128071375'
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/recognition/aptos_white.webp'
                alt='Aptos Hackathon'
                width={65}
                height={15}
              />
              <span className='text-sm'>
                Grand Prize at Aptos Hackathon, Singapore
              </span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
          <Link
            href='https://soonami.io/post/soonami-cohort-4-winners'
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/partners/6.soonami.webp'
                alt='Soonami'
                width={65}
                height={25}
              />
              <span className='text-sm'>
                On the Fast Track Prize at Soonami Ventureshare
              </span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
          <Link
            href='https://app.akindo.io/communities/0n1VBlaXvCRPQVDG/products/La4OvOMglhWdMwjp'     
            target='_blank'
            className='rounded-full w-full bg-white/10 px-8 py-4 flex items justify-between'
          >
            <div className='flex gap-12'>
              <Image
                src='/partners/7.akindo.webp'
                alt='Akindo Wavehack'
                width={65}
                height={25}
              />
              <span className='text-sm'>
                Several Prizes at Akindo WaveCheck
              </span>
            </div>
            <ArrowUpRight color='#82AAFF' className='size-6 hidden md:block' />
          </Link>
        </div>
      </div>
    </section>
  );
}
