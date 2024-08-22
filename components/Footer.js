import {
  FaFacebook,
  FaYoutube,
  FaGithub,
  FaDiscord,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#040819]">
      <div className="max-w-[80%] mx-auto py-12 overflow-hidden">
        <div className=" flex flex-wrap gap-10 justify-between">
          
          <div className="lg:w-1/4 md:w-1/4">
          <div className="text-white">
            <img src="/Erebrus_logo_wordmark.png" alt="Logo" className="w-48" />
            <div className="mt-4 text-sm text-gray-400">Redefining digital connectivity and unleashing the future of internet with globally accessible, secure and private network through the power of DePIN.</div>
          </div>
          </div>

          <div className="text-gray-300 flex flex-col">
          <div className="lg:text-xl text-md font-semibold tracking-wide text-gray-200 mb-4">About</div>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="mb-2">Terms and Conditions</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="">Privacy Policy</a>
          </div>
          <div className="text-gray-300 flex flex-col">
  <div className="lg:text-xl text-md font-semibold tracking-wide text-gray-200 mb-4">
    Contact us
  </div>
  <a
    href="https://discordapp.com/invite/5uaFhNpRF6"
    target="_blank"
    rel="noopener noreferrer"
    className="mb-2 flex items-center"
  >
    <img
      src="/discord_blue.png"
      alt="Discord Logo"
      className="mr-2 w-10 h-8"
    />
    Discord
  </a>
  {/* <a
    href="/terms"
    target="_blank"
    rel="noopener noreferrer"
    className="mb-2 flex items-center"
  >
    <img
      src="/telegram_blue.png"
      alt="Telegram Logo"
      className="mr-2 w-5 h-5"
    />
    Telegram
  </a> */}
  <a
    href="https://netsepio.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center"
  >
    <img
      src="/netsepio_blue.png"
      alt="Netsepio Logo"
      className="mr-2 w-10 h-10"
    />
    Netsepio
  </a>
</div>


    <div>
      <h3 className="lg:text-xl text-md font-semibold tracking-wide text-gray-200">
        Follow Us
      </h3>
      <ul className="mt-4 flex mr-4 text-gray-500">
        <li className="mr-4">
          <Link
            href="https://www.facebook.com/NetSepio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/facebook_blue.png"
              alt="Facebook"
              className="w-10 h-10 hover:opacity-75"
            />
          </Link>
        </li>
        <li className="mr-4">
          <Link
            href="https://twitter.com/NetSepio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/twitter_blue.png"
              alt="Twitter"
              className="w-10 h-10 hover:opacity-75"
            />
          </Link>
        </li>
        <li className="mr-4">
          <Link
            href="https://www.youtube.com/@NetSepio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/youtube_blue.png"
              alt="Youtube"
              className="w-12 h-10 hover:opacity-75"
            />
          </Link>
        </li>
        <li className="mr-4">
          <Link
            href="https://github.com/NetSepio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github_blue.png"
              alt="GitHub"
              className="w-10 h-10 hover:opacity-75"
            />
          </Link>
        </li>
      </ul>
    </div>
        </div>
        <div className="mt-8 text-sm text-white flex flex-col justify-between items-center sm:flex-row">
          <p className="order-2 sm:order-1">
            Erebrus 2024 &copy; All rights reserved.
          </p>
          {/* <div className="flex items-center order-1 sm:order-2 text-white lg:mr-14 md:mr-14">
            <p>Contact us on</p>
            <Link
              href="https://discord.com/invite/5uaFhNpRF6"
              className="text-2xl ml-2 hover:text-[#738ADB]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord />
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
