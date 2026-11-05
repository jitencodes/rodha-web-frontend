import { SITE_URL } from "@/lib/constants";
import { SITEMAP_MODULES } from "@/lib/seo/sitemap-entries";

export const dynamic = "force-static";

/**
 * `generateSitemaps` in `app/sitemaps/sitemap.ts` only serves per-module files, so
 * this route provides the `/sitemap.xml` index that `robots.ts` advertises.
 */
export function GET() {
  const sitemaps = SITEMAP_MODULES.map(
    (id) => `  <sitemap>\n    <loc>${SITE_URL}/sitemaps/sitemap/${id}.xml</loc>\n  </sitemap>`
  ).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
