import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.20.10.14"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/wisata/:slug",
        destination: "/destinasi/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;