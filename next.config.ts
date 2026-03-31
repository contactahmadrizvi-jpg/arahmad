import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "**.imgbb.com",
      },
    ],
  },
  // @ts-ignore
  allowedDevOrigins: [
    "tiny-years-trade.loca.lt",
    "dark-results-cry.loca.lt",
    "metal-years-joke.loca.lt"
  ],
};

export default nextConfig;
