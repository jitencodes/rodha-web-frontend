import type { NextConfig } from "next";

const categorySlugs = ["cat", "ipmat", "clat", "ssc", "skillhouse"] as const;
const buildTime = new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "rodha-dev-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category/:category_slug/courses/:slug",
        destination: "/courses/:slug",
        permanent: true,
      },
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
      {
        source: "/privacypolicy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/termsofuse",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/refundpolicy",
        destination: "/refund-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
