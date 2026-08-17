import type { NextConfig } from "next";

const categorySlugs = ["cat", "ipmat", "clat", "banking", "skillhouse"] as const;

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
        destination: "/category/cat",
        permanent: true,
      },
      {
        source: "/mba/:path*",
        destination: "/category/cat/:path*",
        permanent: true,
      },
      {
        source: "/gdpi",
        destination: "/category/cat",
        permanent: true,
      },
      {
        source: "/gdpi/:path*",
        destination: "/category/cat/:path*",
        permanent: true,
      },
      ...categorySlugs.flatMap((slug) => [
        {
          source: `/${slug}`,
          destination: `/category/${slug}`,
          permanent: true,
        },
        {
          source: `/${slug}/:path*`,
          destination: `/category/${slug}/:path*`,
          permanent: true,
        },
      ]),
    ];
  },
};

export default nextConfig;
