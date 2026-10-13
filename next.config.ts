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
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  },
images: {
  // Keep only if your existing S3/NAT64 setup requires it.
  dangerouslyAllowLocalIP: true,

  remotePatterns: [
    // YouTube thumbnails
    {
      protocol: "https",
      hostname: "img.youtube.com",
      pathname: "/vi/**",
    },

    // AWS S3 — ap-south-1
    {
      protocol: "https",
      hostname: "*.s3.ap-south-1.amazonaws.com",
      pathname: "/**",
    },

    // Google account/profile images
    {
      protocol: "https",
      hostname: "lh3.googleusercontent.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "lh4.googleusercontent.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "lh5.googleusercontent.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "lh6.googleusercontent.com",
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
