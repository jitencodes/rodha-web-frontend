import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COURSE_ROWS as mbaRows } from "./course-rows-mba.mjs";
import { COURSE_ROWS as ipmatClatRows } from "./course-rows-ipmat-clat.mjs";
import { COURSE_ROWS as sscSkillRows } from "./course-rows-ssc-skillhouse.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LANDING_PATH = path.join(ROOT, "src/data/category-landings.json");
const IMAGE_ROOT = path.join(ROOT, "public/assets/images/courses");

const ALL_ROWS = {
  ...mbaRows,
  ...ipmatClatRows,
  ...sscSkillRows,
};

const FOLDER_BY_CATEGORY = {
  mba: "cat",
  ipmat: "ipmat",
  clat: "clat",
  banking: "ssc",
  skillhouse: "skillhouse",
};

const LANDING_ID_BY_CATEGORY = {
  mba: "mba",
  ipmat: "ipmat",
  clat: "clat",
  banking: "ssc",
  skillhouse: "skillhouse",
};

function mapCourseType(type) {
  const t = String(type).toLowerCase();
  if (t.includes("crash")) return "crash";
  if (t.includes("comprehensive") || t.includes("all-in-one") || t === "program") {
    return "comprehensive";
  }
  if (
    t.includes("individual") ||
    t.includes("self-paced") ||
    t.includes("single module") ||
    t.includes("practice engine")
  ) {
    return "individual";
  }
  return "other";
}

function badgeFor(type, courseType) {
  if (/free/i.test(type)) return "Free";
  if (/mock|sectional/i.test(type)) return "Mocks";
  if (courseType === "crash") return "Crash Course";
  if (courseType === "comprehensive") return "Comprehensive";
  if (courseType === "individual") return "Individual";
  return "Package";
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 68);
}

function idFromCta(cta, fallback) {
  const last = cta.split("/").filter(Boolean).pop() || "";
  const hash = last.match(/[a-f0-9]{24}$/i)?.[0];
  if (hash) return hash;
  const cleaned = last.replace(/[^a-z0-9-]/gi, "").slice(-32);
  return cleaned || fallback;
}

function extensionFromContentType(contentType, url) {
  const type = (contentType || "").toLowerCase();
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (url.includes(".png")) return ".png";
  if (url.includes(".webp")) return ".webp";
  return ".jpg";
}

async function findExisting(destWithoutExt) {
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const candidate = `${destWithoutExt}${ext}`;
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // keep looking
    }
  }
  return null;
}

async function downloadImage(url, destWithoutExt) {
  const existing = await findExisting(destWithoutExt);
  if (existing) {
    console.log(`skip ${path.basename(existing)}`);
    return existing;
  }
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    throw new Error(`HTML response instead of image for ${url}`);
  }
  const ext = extensionFromContentType(contentType, url);
  const dest = `${destWithoutExt}${ext}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1024) {
    throw new Error(`Image too small (${buffer.length} bytes) for ${url}`);
  }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buffer);
  return dest;
}

async function toCourse(row, category, usedSlugs) {
  const folder = FOLDER_BY_CATEGORY[category];
  const courseType = mapCourseType(row.type);
  let slug = slugify(row.title);
  if (usedSlugs.has(slug)) {
    slug = `${slug}-${idFromCta(row.cta, "course").slice(-6)}`;
  }
  usedSlugs.add(slug);

  const destBase = path.join(IMAGE_ROOT, folder, slug);
  let thumbnail = `/assets/images/placeholders/course-thumb.svg`;
  try {
    const saved = await downloadImage(row.image, destBase);
    const relative = path.relative(path.join(ROOT, "public"), saved).replaceAll("\\", "/");
    thumbnail = `/${relative}`;
    console.log(`ok  ${slug}${path.extname(saved)}`);
  } catch (error) {
    console.warn(`fail ${slug}: ${error.message}`);
  }

  const course = {
    id: `${category}-${idFromCta(row.cta, slug)}`,
    title: row.title,
    slug,
    language: row.language,
    category,
    description: row.description,
    shortDescription: row.description,
    price: row.price,
    duration: row.type,
    mode: /recorded|self-paced/i.test(row.type) ? "Recorded" : "Live + Recorded",
    features: [],
    highlights: [],
    enrollmentUrl: row.cta,
    badge: badgeFor(row.type, courseType),
    badgeType: "audience",
    detailsLabel: "View Details",
    details: row.faculty ? [row.faculty] : [],
    thumbnail,
    showFaculty: Boolean(row.faculty),
    externalLink: row.cta,
    courseType,
  };

  if (row.count != null) course.caourseCount = row.count;
  if (row.originalPrice && row.originalPrice > row.price) {
    course.originalPrice = row.originalPrice;
  }
  if (row.startDate) course.startDate = row.startDate;
  if (row.faculty) course.faculty = row.faculty;

  return course;
}

async function main() {
  const landing = JSON.parse(await fs.readFile(LANDING_PATH, "utf8"));
  const usedSlugsByCategory = {};

  for (const [category, rows] of Object.entries(ALL_ROWS)) {
    usedSlugsByCategory[category] = new Set();
    const courses = [];
    for (const row of rows) {
      courses.push(await toCourse(row, category, usedSlugsByCategory[category]));
    }
    const landingId = LANDING_ID_BY_CATEGORY[category] ?? category;
    const target = landing.categories.find((item) => item.id === landingId);
    if (!target) {
      throw new Error(`Missing category ${landingId} in landings JSON`);
    }
    target.courses = courses;
  }

  const mba = landing.categories.find((item) => item.id === "mba");
  if (mba) {
    const hrefById = {
      "package-a": "https://exam.rodha.co.in/packages/RodhaCATMocks/MTYwMw==",
      "package-b": "https://exam.rodha.co.in/packages/RodhaSectionalTests/MTYwMg==",
      "package-c":
        "https://exam.rodha.co.in/packages/RodhaCATMocksandSectionalTests/MTYwNA==",
      "package-d":
        "https://exam.rodha.co.in/packages/RodhaCATMocksandOMETSPackage/MTYwNQ==",
    };
    mba.testSeries = mba.testSeries.map((item) =>
      hrefById[item.id] ? { ...item, href: hrefById[item.id] } : item
    );
  }

  await fs.writeFile(LANDING_PATH, `${JSON.stringify(landing, null, 2)}\n`);
  console.log("Updated category-landings.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
