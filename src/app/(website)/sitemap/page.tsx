import type { Metadata } from "next";

import { HtmlSitemapPage } from "@/components/sections/HtmlSitemapPage";
import { buildPageMetadata } from "@/lib/seo";
import { getHtmlSitemapGroups } from "@/lib/seo/sitemap-entries";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap — Rodha",
  description:
    "Browse the full Rodha website structure — categories, courses, faculty, blogs, results, and legal pages.",
  path: "/sitemap",
});

export default async function SitemapHtmlPage() {
  const groups = await getHtmlSitemapGroups();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Sitemap" },
            ])
          ),
        }}
      />
      <HtmlSitemapPage groups={groups} />
    </>
  );
}
