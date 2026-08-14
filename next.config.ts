import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/mba",
        destination: "/cat",
        permanent: true,
      },
      {
        source: "/mba/:path*",
        destination: "/cat/:path*",
        permanent: true,
      },
      {
        source: "/gdpi",
        destination: "/cat",
        permanent: true,
      },
      {
        source: "/gdpi/:path*",
        destination: "/cat/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
