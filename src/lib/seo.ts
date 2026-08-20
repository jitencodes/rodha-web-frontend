import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const DEFAULT_OG_IMAGE = "/assets/og/og-rodha.png";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}

/** Shared title/description/canonical/OG/Twitter metadata for marketing pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path === "/" ? `${SITE_URL}/` : url,
    },
    openGraph: {
      title,
      description,
      url: path === "/" ? `${SITE_URL}/` : url,
      siteName: SITE_NAME,
      type,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
