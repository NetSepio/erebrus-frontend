import Link from "next/link"

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Improved overlay with better gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-blue-900/30 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          <h1 className="mb-8 font-sans text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Building the Global{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Decentralized Network
            </span>
          </h1>
          <p className="mb-12 text-xl text-blue-100 md:text-2xl max-w-3xl mx-auto">
            Join the revolution reshaping how the world connects, shares, and creates value
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Link href="/get-started">
              <button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1 text-lg">
                Explore VPN
              </button>
            </Link>
            <Link href="/learn-more">
              <button className="rounded-full bg-transparent border border-white/30 px-10 py-4 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 transform hover:-translate-y-1 text-lg">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced abstract glowing elements */}
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
      <div className="absolute right-1/3 top-1/4 h-96 w-96 rounded-full bg-cyan-300 opacity-15 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-blue-300 opacity-10 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-purple-400 opacity-10 blur-3xl"></div>
    </div>
  )
}

export default HeroSection
