/**
 * One-off migration: fetch 9 Rodha Graphy blogs → local images + blog posts JSON.
 * Run: node scripts/migrate-blogs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "assets", "images", "blog");
const REPORT_PATH = path.join(__dirname, "blog-migration-report.json");

const POSTS = [
  {
    slug: "cat-2026-notification",
    category: "mba-cat",
    featured: true,
    publishedDate: "2026-07-15",
  },
  {
    slug: "cat-2026-4-month-preparation-plan",
    category: "mba-cat",
    featured: false,
    publishedDate: "2026-08-01",
  },
  {
    slug: "how-to-use-rodha-cat-accelerator",
    category: "mba-cat",
    featured: false,
    publishedDate: "2026-08-01",
  },
  {
    slug: "cat-sectional-test-strategy-2026",
    category: "mba-cat",
    featured: false,
    publishedDate: "2026-07-15",
  },
  {
    slug: "ipmat-online-coaching-balance-pre-boards-2026",
    category: "ipmat",
    featured: false,
    publishedDate: "2026-07-15",
  },
  {
    slug: "ipmat-preparation-with-previous-year-papers",
    category: "ipmat",
    featured: false,
    publishedDate: "2026-08-01",
  },
  {
    slug: "working-student-ipmat-timeline-5-month-study-plan",
    category: "ipmat",
    featured: false,
    publishedDate: "2026-07-15",
  },
  {
    slug: "ipmat-interview-prep-2026-written-to-wat-to-pi-framework",
    category: "ipmat",
    featured: false,
    publishedDate: "2026-07-15",
  },
  {
    slug: "rodha-s-ssc-cgl-2026-preparation-priorities",
    category: "ssc",
    featured: false,
    publishedDate: "2026-08-01",
  },
];

function meta(html, prop) {
  const patterns = [
    new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)`, "i"),
    new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, "i"),
    new RegExp(`name=["']${prop}["'][^>]*content=["']([^"']+)`, "i"),
    new RegExp(`content=["']([^"']+)["'][^>]*name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtml(m[1]);
  }
  return undefined;
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const t = stripTags(h1[1]);
    if (t) return t;
  }
  const title = html.match(/<title[^>]*>([^<]+)/i);
  return title ? decodeHtml(title[1].trim()) : undefined;
}

function extractAuthor(html) {
  const m = html.match(/Author:<\/strong>\s*([^<]+)/i);
  return m ? stripTags(m[1]) : "Team Rodha";
}

function extractDateLabel(html) {
  const month = html.match(
    />(January|February|March|April|May|June|July|August|September|October|November|December),?\s+2026</i
  );
  return month ? `${month[1]}, 2026` : undefined;
}

function extractBodyHtml(html) {
  // Prefer left content column inside cm-hero-blog
  const startMarkers = [
    '<!-- LEFT CONTENT -->',
    '<div class="cm-hero-content">',
  ];
  let start = -1;
  for (const marker of startMarkers) {
    start = html.indexOf(marker);
    if (start !== -1) {
      if (marker.startsWith("<!--")) {
        const div = html.indexOf('<div class="cm-hero-content">', start);
        if (div !== -1) start = div;
      }
      break;
    }
  }
  if (start === -1) {
    throw new Error("Could not find cm-hero-content body");
  }

  const endMarkers = [
    "<!-- LEFT CONTENT end -->",
    "<!-- RIGHT SIDEBAR -->",
    '<div class="cm-hero-sidebar">',
  ];
  let end = -1;
  for (const marker of endMarkers) {
    const i = html.indexOf(marker, start + 50);
    if (i !== -1 && (end === -1 || i < end)) end = i;
  }
  if (end === -1) {
    // close the content div by brace matching is hard; fall back to last FAQ paragraph area
    end = html.indexOf("</div>", html.lastIndexOf("<h3>", start));
  }

  let body = html.slice(start, end);
  // Strip opening wrapper div
  body = body.replace(/^<div class="cm-hero-content">\s*/i, "");
  // Remove mobile TOC blocks
  body = body.replace(/<div class="cm-hero-toc[\s\S]*?<\/div>/gi, "");
  body = body.replace(/<!-- TOC MOBILE -->[\s\S]*?(?=<!--|<[hp]|<h[1-6]|<img|<table|<ul|<ol)/gi, "");
  // Remove HTML comments
  body = body.replace(/<!--[\s\S]*?-->/g, "");
  // Remove script/style
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove font-awesome icons in leftover toc
  body = body.replace(/<i class="fa-[^"]*"[^>]*><\/i>/gi, "");
  // Clean empty wrappers that only contain TOC remnants
  body = body.replace(/<div class="cm-hero-toc[^"]*"[\s\S]*?<\/div>/gi, "");
  // Normalize whitespace a bit
  body = body.replace(/\r\n/g, "\n").trim();
  // Close dangling if we cut mid-div: ensure we don't leave open cm-hero-content
  return body;
}

function rewriteLinks(html, category) {
  let out = html;
  // Blog self links
  out = out.replace(
    /https?:\/\/(?:www\.)?rodha\.co\.in\/blog\/([a-z0-9-]+)/gi,
    "/blog/$1"
  );
  // Category explore links
  const categoryMap = {
    "mba-cat": "/category/cat",
    ipmat: "/category/ipmat",
    ssc: "/category/ssc",
  };
  const dest = categoryMap[category] || "/category/cat";
  out = out.replace(
    /https?:\/\/(?:www\.)?rodha\.co\.in\/s\/pages\/(?:cat2026|ipmat|ssc)[^"'\s>]*/gi,
    dest
  );
  out = out.replace(
    /https?:\/\/(?:www\.)?rodha\.co\.in\/?(?=["'#\s])/gi,
    "/"
  );
  // Common course explore anchors that pointed at home
  out = out.replace(
    /(<a[^>]+href=["'])\/(["'][^>]*>)((?:CAT|IPMAT|SSC)\s+courses)/gi,
    `$1${dest}$2$3`
  );
  return out;
}

function collectImageUrls(html) {
  const urls = new Set();
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const src = m[1];
    if (src.startsWith("http") && !src.includes("facebook.com") && !src.includes("<@")) {
      urls.add(src);
    }
  }
  // also srcset
  for (const m of html.matchAll(/srcset=["']([^"']+)["']/gi)) {
    for (const part of m[1].split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (u?.startsWith("http")) urls.add(u);
    }
  }
  return [...urls];
}

function extFromUrl(url) {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname);
    const ext = path.extname(base).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) return ext;
  } catch {
    /* ignore */
  }
  return ".png";
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: { "User-Agent": "RodhaMigrationBot/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

function estimateReadTime(html) {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function excerptFrom(html, metaDesc) {
  if (metaDesc && metaDesc.length > 40) return metaDesc;
  const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (firstP) {
    const t = stripTags(firstP[1]);
    return t.length > 220 ? `${t.slice(0, 217)}...` : t;
  }
  return "";
}

function escapeTsString(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

async function migratePost(spec, index) {
  const url = `https://www.rodha.co.in/blog/${spec.slug}`;
  const report = {
    slug: spec.slug,
    url,
    ok: false,
    issues: [],
    images: [],
    missingImages: [],
  };

  console.log(`\nFetching ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "RodhaMigrationBot/1.0" },
  });
  if (!res.ok) {
    report.issues.push(`Fetch failed: HTTP ${res.status}`);
    return { report };
  }
  const html = await res.text();

  const title = extractTitle(html);
  if (!title) report.issues.push("Missing title");

  const metaTitle = meta(html, "og:title") || title;
  const metaDescription =
    meta(html, "og:description") || meta(html, "description") || "";
  if (!metaDescription) report.issues.push("Missing meta description — used lead excerpt");

  const author = extractAuthor(html);
  const dateLabel = extractDateLabel(html);

  let body;
  try {
    body = extractBodyHtml(html);
  } catch (e) {
    report.issues.push(String(e.message || e));
    return { report };
  }

  // Featured image: prefer first cloudfront article image in full page hero/right, then body
  const allImgs = collectImageUrls(html);
  const articleImgs = allImgs.filter((u) => u.includes("cloudfront.net/articles/"));
  const bodyImgs = collectImageUrls(body);

  const postImgDir = path.join(OUT_DIR, spec.slug);
  fs.mkdirSync(postImgDir, { recursive: true });

  const urlToLocal = new Map();
  let imgIndex = 0;

  async function localize(remoteUrl, preferredName) {
    if (urlToLocal.has(remoteUrl)) return urlToLocal.get(remoteUrl);
    const ext = extFromUrl(remoteUrl);
    const filename = preferredName || `image-${++imgIndex}${ext}`;
    const dest = path.join(postImgDir, filename);
    const publicPath = `/assets/images/blog/${spec.slug}/${filename}`;
    try {
      const size = await downloadImage(remoteUrl, dest);
      urlToLocal.set(remoteUrl, publicPath);
      report.images.push({ remoteUrl, publicPath, size });
      console.log(`  saved ${filename} (${size} bytes)`);
      return publicPath;
    } catch (e) {
      report.missingImages.push({ remoteUrl, error: String(e.message || e) });
      console.warn(`  FAILED image ${remoteUrl}: ${e.message}`);
      return null;
    }
  }

  // Featured/thumbnail
  let thumbnail = "/assets/images/placeholders/blog-thumbnail.svg";
  const featuredRemote =
    articleImgs.find((u) => /\/p[A-Z0-9]/i.test(u) || u.includes("/p3")) ||
    articleImgs[0] ||
    bodyImgs[0];
  if (featuredRemote) {
    const local = await localize(featuredRemote, `featured${extFromUrl(featuredRemote)}`);
    if (local) thumbnail = local;
  } else {
    report.issues.push("No featured/article image found on page");
  }

  // Localize body images
  for (const remote of bodyImgs) {
    const local = await localize(remote);
    if (local) {
      body = body.split(remote).join(local);
    }
  }

  // Also replace any remaining cloudfront article URLs that might appear without img tag context
  for (const [remote, local] of urlToLocal) {
    body = body.split(remote).join(local);
  }

  body = rewriteLinks(body, spec.category);

  // Remove leftover absolute cloudfront refs
  if (/cloudfront\.net|rodha\.co\.in\/.*\.(png|jpe?g|webp)/i.test(body)) {
    report.issues.push("Body still contains remote image host references after localization");
  }

  const shortDescription = excerptFrom(body, metaDescription);
  const readTime = estimateReadTime(body);

  const post = {
    id: `blog-${index + 1}`,
    slug: spec.slug,
    title,
    category: spec.category,
    thumbnail,
    shortDescription,
    content: body,
    publishedDate: spec.publishedDate,
    readTime,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || shortDescription,
    metaKeywords: undefined,
    tags: [spec.category, "rodha"],
    featured: spec.featured,
    author,
    excerpt: shortDescription,
    image: thumbnail,
    publishedAt: spec.publishedDate,
    dateLabel,
  };

  report.ok = report.missingImages.length === 0 && !report.issues.some((i) =>
    i.startsWith("Fetch failed") || i.startsWith("Could not")
  );
  // Soft issues shouldn't block
  if (title && body.length > 200) report.ok = true;

  return { report, post };
}

function generateBlogTs(posts) {
  const header = `import type { BlogPost } from "@/lib/types";

// ---------------------------------------------------------------------------
// Blog categories
// ---------------------------------------------------------------------------

export interface BlogCategory {
  id: string;
  label: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "All" },
  { id: "mba-cat", label: "MBA" },
  { id: "ipmat", label: "IPMAT" },
  { id: "ssc", label: "SSC" },
];

export const BLOG_ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Blog posts (migrated from rodha.co.in)
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
`;

  const items = posts
    .map((p) => {
      const keywords = p.metaKeywords
        ? `metaKeywords: ${JSON.stringify(p.metaKeywords)},`
        : "";
      return `  {
    id: ${JSON.stringify(p.id)},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    category: ${JSON.stringify(p.category)},
    thumbnail: ${JSON.stringify(p.thumbnail)},
    shortDescription: ${JSON.stringify(p.shortDescription)},
    content: \`${escapeTsString(p.content)}\`,
    publishedDate: ${JSON.stringify(p.publishedDate)},
    readTime: ${JSON.stringify(p.readTime)},
    metaTitle: ${JSON.stringify(p.metaTitle)},
    metaDescription: ${JSON.stringify(p.metaDescription)},
    ${keywords}
    tags: ${JSON.stringify(p.tags)},
    featured: ${p.featured},
    author: ${JSON.stringify(p.author)},
    excerpt: ${JSON.stringify(p.excerpt)},
    image: ${JSON.stringify(p.image)},
    publishedAt: ${JSON.stringify(p.publishedAt)},
  }`;
    })
    .join(",\n");

  // Keep existing helper functions from original blog.ts — append after reading them
  return header + items + "\n];\n";
}

async function main() {
  const reports = [];
  const posts = [];

  for (let i = 0; i < POSTS.length; i++) {
    const { report, post } = await migratePost(POSTS[i], i);
    reports.push(report);
    if (post) posts.push(post);
    else console.error(`SKIPPED ${POSTS[i].slug}`);
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reports, null, 2));
  fs.writeFileSync(
    path.join(__dirname, "migrated-posts.json"),
    JSON.stringify(posts, null, 2)
  );

  // Read helpers from existing blog.ts tail
  const existing = fs.readFileSync(path.join(ROOT, "src", "data", "blog.ts"), "utf8");
  const helpersStart = existing.indexOf("export function getBlogBySlug");
  const helpers =
    helpersStart !== -1
      ? existing.slice(helpersStart)
      : `export function getBlogBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
`;

  const ts = generateBlogTs(posts) + "\n" + helpers;
  fs.writeFileSync(path.join(ROOT, "src", "data", "blog.ts"), ts);
  console.log(`\nWrote ${posts.length} posts to src/data/blog.ts`);
  console.log("Report:", REPORT_PATH);
  for (const r of reports) {
    console.log(
      `- ${r.slug}: ok=${r.ok} images=${r.images.length} missing=${r.missingImages.length} issues=${r.issues.join("; ") || "none"}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
