/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
    {
      protocol: "https",
      hostname: "assets.aceternity.com",
      pathname: '/**',
    }
    ],
   
  },
  webpack: (config: { externals: string[] }) => {
    config.externals = config.externals || [];
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
