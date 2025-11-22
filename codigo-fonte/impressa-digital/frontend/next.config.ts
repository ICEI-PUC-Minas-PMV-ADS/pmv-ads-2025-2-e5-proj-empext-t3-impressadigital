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
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://impressadigital-production.up.railway.app/:path*',
      },
    ];
  },
};

export default nextConfig;