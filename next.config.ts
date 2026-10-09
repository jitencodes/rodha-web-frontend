import type { NextConfig } from "next";

const categorySlugs = ["cat", "ipmat", "clat", "ssc", "skillhouse"] as const;
const buildTime = new Date().toISOString();
const defaultHomePath =
  process.env.NEXT_PUBLIC_DEFAULT_HOME_PATH?.trim() || "/category/cat";

const nextConfig: NextConfig = {
  /**
   * Standalone output is required for the multi-stage Docker image.
   * Disable on Vercel: Next 16.3 + Vercel’s injected adapter skips emitting
   * `.next/next-server.js.nft.json`, which then crashes onBuildComplete when
   * `output: "standalone"` is set (vercel/next.js#96646).
   */
  output: process.env.VERCEL ? undefined : "standalone",
  env: {
    NEXT_PUBLIC_BUILD_TIME: buildTime,
    // Force-inline at build time (Vercel/GitLab). Adding the var in the dashboard
    // without a redeploy leaves an empty client bundle — rebuild after changes.
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  },
  images: {
    // This network resolves S3 to NAT64 (64:ff9b::/96). Next blocks those
    // as private IPs and returns 400 for every CMS image on localhost.
    // Hostnames stay limited to the remotePatterns below.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const homeRedirects =
      defaultHomePath === "/"
        ? []
        : [
            {
              source: "/",
              destination: defaultHomePath,
              permanent: false,
            },
          ];

    return [
      ...homeRedirects,
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
