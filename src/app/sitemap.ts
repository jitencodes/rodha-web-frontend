import type { MetadataRoute } from "next";

import {
  getSitemapEntriesForModule,
  SITEMAP_MODULES,
} from "@/lib/seo/sitemap-entries";

export async function generateSitemaps() {
  return SITEMAP_MODULES.map((id) => ({ id }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  return getSitemapEntriesForModule(id);
}
