import type { MetadataRoute } from "next";

import { getBlogs } from "@/lib/api/modules/blogs/service";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import { getFacultyPage } from "@/lib/api/modules/faculty/service";
import { getPackages } from "@/lib/api/modules/packages/service";
import { SITE_URL } from "@/lib/constants";

export type SitemapModuleId =
  | "static"
  | "categories"
  | "courses"
  | "faculty"
  | "blogs";

export const SITEMAP_MODULES: SitemapModuleId[] = [
  "static",
  "categories",
  "courses",
  "faculty",
  "blogs",
];

function entry(
  path: string,
  opts?: Partial<MetadataRoute.Sitemap[number]>
): MetadataRoute.Sitemap[number] {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    url: `${SITE_URL}${normalized}`,
    lastModified: new Date(),
    changeFrequency: opts?.changeFrequency ?? "weekly",
    priority: opts?.priority ?? 0.7,
  };
}

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/team", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.7 },
  { path: "/faculty", changeFrequency: "weekly", priority: 0.8 },
  { path: "/courses", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.7 },
  { path: "/results", changeFrequency: "weekly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "weekly", priority: 0.7 },
  { path: "/success-stories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/test-series", changeFrequency: "weekly", priority: 0.6 },
  { path: "/sitemap", changeFrequency: "weekly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

const PAGE_LIMIT = 100;
const MAX_PAGES = 50;

async function collectPaginatedSlugs(
  fetchPage: (
    page: number
  ) => Promise<{ slugs: string[]; totalPages: number } | null>
): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const result = await fetchPage(page);
    if (!result) break;
    slugs.push(...result.slugs.filter(Boolean));
    totalPages = Math.max(1, result.totalPages);
    page += 1;
  }

  return Array.from(new Set(slugs));
}

export async function getStaticSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return STATIC_PATHS.map(({ path, changeFrequency, priority }) =>
    entry(path, { changeFrequency, priority })
  );
}

export async function getCategorySitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const categories = await getActiveCategories();
  return categories.map((category) =>
    entry(`/category/${category.slug}`, {
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );
}

export async function getCourseSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const slugs = await collectPaginatedSlugs(async (page) => {
    const result = await getPackages({ page, limit: PAGE_LIMIT });
    return {
      slugs: result.items.map((item) => item.slug).filter(Boolean),
      totalPages: result.totalPages,
    };
  });
  return slugs.map((slug) =>
    entry(`/courses/${slug}`, { changeFrequency: "weekly", priority: 0.8 })
  );
}

export async function getFacultySitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const slugs = await collectPaginatedSlugs(async (page) => {
    const result = await getFacultyPage({ page, limit: PAGE_LIMIT });
    if (!result) return null;
    return {
      slugs: result.items.map((item) => item.slug).filter(Boolean),
      totalPages: result.pagination.totalPages,
    };
  });
  return slugs.map((slug) =>
    entry(`/faculty/${slug}`, { changeFrequency: "weekly", priority: 0.7 })
  );
}

export async function getBlogSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const slugs = await collectPaginatedSlugs(async (page) => {
    const result = await getBlogs({ page, limit: PAGE_LIMIT });
    if (!result) return null;
    return {
      slugs: result.items.map((item) => item.slug).filter(Boolean),
      totalPages: result.pagination.totalPages,
    };
  });
  return slugs.map((slug) =>
    entry(`/blog/${slug}`, { changeFrequency: "weekly", priority: 0.7 })
  );
}

export async function getSitemapEntriesForModule(
  id: string
): Promise<MetadataRoute.Sitemap> {
  switch (id as SitemapModuleId) {
    case "static":
      return getStaticSitemapEntries();
    case "categories":
      return getCategorySitemapEntries();
    case "courses":
      return getCourseSitemapEntries();
    case "faculty":
      return getFacultySitemapEntries();
    case "blogs":
      return getBlogSitemapEntries();
    default:
      return [];
  }
}

/** Link groups for the human-readable HTML sitemap page. */
export interface HtmlSitemapGroup {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export async function getHtmlSitemapGroups(): Promise<HtmlSitemapGroup[]> {
  const [categories, courses, faculty, blogs] = await Promise.all([
    getActiveCategories(),
    collectPaginatedSlugs(async (page) => {
      const result = await getPackages({ page, limit: PAGE_LIMIT });
      return {
        slugs: result.items.map((item) => `${item.slug}|||${item.title}`),
        totalPages: result.totalPages,
      };
    }),
    collectPaginatedSlugs(async (page) => {
      const result = await getFacultyPage({ page, limit: PAGE_LIMIT });
      if (!result) return null;
      return {
        slugs: result.items.map((item) => `${item.slug}|||${item.name}`),
        totalPages: result.pagination.totalPages,
      };
    }),
    collectPaginatedSlugs(async (page) => {
      const result = await getBlogs({ page, limit: PAGE_LIMIT });
      if (!result) return null;
      return {
        slugs: result.items.map((item) => `${item.slug}|||${item.title}`),
        totalPages: result.pagination.totalPages,
      };
    }),
  ]);

  function splitPairs(entries: string[]) {
    return entries
      .map((raw) => {
        const [slug, label] = raw.split("|||");
        return { slug, label: label || slug };
      })
      .filter((item) => item.slug);
  }

  const courseLinks = splitPairs(courses).map(({ slug, label }) => ({
    label,
    href: `/courses/${slug}`,
  }));
  const facultyLinks = splitPairs(faculty).map(({ slug, label }) => ({
    label,
    href: `/faculty/${slug}`,
  }));
  const blogLinks = splitPairs(blogs).map(({ slug, label }) => ({
    label,
    href: `/blog/${slug}`,
  }));

  const groups: HtmlSitemapGroup[] = [
    {
      title: "Main",
      links: [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" },
        { label: "Faculty", href: "/faculty" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Meet the Team", href: "/team" },
        { label: "FAQ", href: "/faq" },
        { label: "Test Series", href: "/test-series" },
      ],
    },
    {
      title: "Content",
      links: [
        { label: "Resources", href: "/resources" },
        { label: "Student Results", href: "/results" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Success Stories", href: "/success-stories" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  if (categories.length > 0) {
    groups.splice(1, 0, {
      title: "Categories",
      links: categories.map((category) => ({
        label: category.menuLabel || category.name,
        href: `/category/${category.slug}`,
      })),
    });
  }
  if (courseLinks.length > 0) {
    groups.push({ title: "All Courses", links: courseLinks });
  }
  if (facultyLinks.length > 0) {
    groups.push({ title: "All Faculty", links: facultyLinks });
  }
  if (blogLinks.length > 0) {
    groups.push({ title: "All Blog Posts", links: blogLinks });
  }

  return groups;
}
