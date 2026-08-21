import type { NextConfig } from "next";

const categorySlugs = ["cat", "ipmat", "clat", "ssc", "skillhouse"] as const;

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
