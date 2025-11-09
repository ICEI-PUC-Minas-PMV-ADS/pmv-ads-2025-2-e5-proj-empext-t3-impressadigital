import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.melhorenvio.com.br",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,

  }
};

export default nextConfig;
