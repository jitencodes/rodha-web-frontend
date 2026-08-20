import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LANDING_PATH = path.join(ROOT, "src/data/category-landings.json");
const IMAGE_DIR = path.join(ROOT, "public/assets/images/category/ipmat/students");
const HOME_LIMIT = 10;

const IPMAT_RESULTS = [
  {
    name: "Geet Lunkad",
    rank: 4,
    college: "IIM Indore",
    driveUrl:
      "https://drive.google.com/file/d/1kMo90Aw0O0hoAMxwyCPddh2ZRcAjstFx/view?usp=sharing",
  },
  {
    name: "Shaurya Gupta",
    rank: 11,
    college: "IIM Indore, IIM Kozhikode",
    driveUrl: "https://drive.google.com/open?id=12dAi8tVeKmaYhYPs1AXcL6huXO9yYWbu",
    youtubeId: "vHZ7abtaxcM",
  },
  {
    name: "Aarav Narwal",
    college: "IIM Sirmaur",
    driveUrl: "https://drive.google.com/open?id=1AR0Erdm2q6RXZkDWSFItAQz34cgh4yV2",
  },
  {
    name: "Agrim Jain",
    college: "IIM Rohtak",
    driveUrl: "https://drive.google.com/open?id=1M7LmuKIDYqLG2XQPkygObvWuA6rSYBTr",
    youtubeId: "C0H8DcI_XIk",
  },
  {
    name: "Akshara Somgade",
    college: "IIM Sirmaur",
    driveUrl: "https://drive.google.com/open?id=1ffp1vLeJ0wBQ6ocUWQtzcntqlsiSA1Cs",
  },
  {
    name: "Bhavneet Singh",
    college: "IIM Jammu, IIM Bodh Gaya, IIM Kozhikode BMS, IIM Rohtak",
    driveUrl: "https://drive.google.com/open?id=1buo_fSqiUw0zLANS0kCZmr9o2M4vXrvW",
  },
  {
    name: "K D Omm Prakash",
    college: "IIM Kozhikode",
    driveUrl:
      "https://drive.google.com/file/d/1R_Ooap1z7gPDcRdhyQwTNRgjQVdS8cqw/view?usp=sharing",
  },
  {
    name: "Krishna Verma",
    college: "IIM Kozhikode",
    driveUrl: "https://drive.google.com/open?id=1S3Ak6fn6yEz5J68txZ0gMGqiGf347LLY",
    youtubeId: "wVh6Lq-4uUg",
  },
  {
    name: "Nandika",
    college: "IIM Kozhikode, IIM Sambalpur",
    driveUrl: "https://drive.google.com/open?id=1D8YNVfttGM7dSLXXkgUoW5JX3nVoFInm",
    youtubeId: "TJrfQ6a29MI",
  },
  {
    name: "Parshva Parekh",
    college: "IIM Indore, IIM Amritsar",
    driveUrl: "https://drive.google.com/open?id=1Yax4vnBnciAwuaS5SxeSy0ul7RnYHc3X",
    youtubeId: "TGwguesOz5I",
  },
  {
    name: "Prashasti Soumya",
    college: "IIFT Kakinada, IIM Ranchi",
    driveUrl:
      "https://drive.google.com/file/d/1idQ6PB_NYwEwb_O7fevPmt_Mlz9_Aq8H/view?usp=sharing",
  },
  {
    name: "Prince Mishra",
    college: "IIM Bodh Gaya",
    driveUrl: "https://drive.google.com/open?id=1Ti3p4S9TgN_Jg0-nVi1Em3SO9BMKjoLH",
    youtubeId: "oKgY4KModM8",
  },
  {
    name: "Sangbarta Das",
    college: "IIM Amritsar, IIM Sambalpur",
    driveUrl: "https://drive.google.com/open?id=1NPRYywHJrkrVx4IgVTZUrBertLTonr_3",
    youtubeId: "1US7shDDLgw",
  },
  {
    name: "Teekshan Jain",
    college: "IIM Rohtak",
    driveUrl: "https://drive.google.com/open?id=1qX92LsjazlI_AXGRja-gd_533lygEtQ1",
  },
  {
    name: "Utkarsh Raj",
    college: "IIM Bangalore (UG - Data Science), SSCBS (BMS)",
    driveUrl: "https://drive.google.com/open?id=1Z-DbetpfJ3QHkE1CZAG9B0HStHA6ulnC",
  },
  {
    name: "Vedaant Sehgal",
    college: "NALSAR Hyderabad, IIM Sirmaur",
    driveUrl: "https://drive.google.com/open?id=17poiAwZLzpTIuKEQ7rZ3PDaVZYmc7qlE",
  },
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function driveId(url) {
  return (
    url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1] ||
    ""
  );
}

function looksLikeImage(buffer, contentType) {
  if (buffer.length < 2048) return false;
  if ((contentType || "").includes("text/html")) return false;
  const header = buffer.subarray(0, 16);
  const jpeg = header[0] === 0xff && header[1] === 0xd8;
  const png =
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47;
  const gif = header.toString("ascii", 0, 3) === "GIF";
  const webp = header.toString("ascii", 0, 4) === "RIFF";
  const riffWebp = webp && header.toString("ascii", 8, 12) === "WEBP";
  return jpeg || png || gif || riffWebp || webp;
}

async function fetchBuffer(url) {
  const response = await fetch(url, { redirect: "follow", headers: HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType, finalUrl: response.url };
}

async function downloadDriveFile(fileId) {
  const candidates = [
    `https://lh3.googleusercontent.com/d/${fileId}=s2000`,
    `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  let lastError = null;
  for (const url of candidates) {
    try {
      const result = await fetchBuffer(url);
      if (looksLikeImage(result.buffer, result.contentType)) {
        return result.buffer;
      }

      if ((result.contentType || "").includes("text/html")) {
        const html = result.buffer.toString("utf8");
        const confirm = html.match(/confirm=([0-9A-Za-z_-]+)/)?.[1];
        const uuid = html.match(/name="uuid" value="([^"]+)"/)?.[1];
        if (confirm) {
          const confirmUrl = uuid
            ? `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirm}&uuid=${uuid}`
            : `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirm}`;
          const retry = await fetchBuffer(confirmUrl);
          if (looksLikeImage(retry.buffer, retry.contentType)) {
            return retry.buffer;
          }
        }
      }
      lastError = new Error(`Not an image from ${url}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`Failed to download ${fileId}`);
}

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    return null;
  }
}

async function saveWebp(buffer, destPath, sharp) {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  if (sharp) {
    await sharp(buffer)
      .rotate()
      .resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);
    return;
  }
  await fs.writeFile(destPath.replace(/\.webp$/i, ".bin"), buffer);
  throw new Error("sharp is required to write webp portraits");
}

function toResultRecord(row, index, imagePath) {
  const record = {
    id: `ipmat-result-${index + 1}`,
    name: row.name,
    exam: "IPMAT 2026",
    college: row.college,
    year: 2026,
    image: imagePath,
    category: "ipmat",
    batch: [],
  };
  if (row.rank != null) record.rank = row.rank;
  return record;
}

async function main() {
  const sharp = await loadSharp();
  if (!sharp) {
    throw new Error("Install sharp first: npm install --no-save sharp");
  }

  await fs.mkdir(IMAGE_DIR, { recursive: true });
  const records = [];
  const stories = [];

  for (const [index, row] of IPMAT_RESULTS.entries()) {
    const slug = slugify(row.name);
    const dest = path.join(IMAGE_DIR, `${slug}.webp`);
    const publicPath = `/assets/images/category/ipmat/students/${slug}.webp`;
    try {
      await fs.access(dest);
      console.log(`skip ${slug}.webp`);
    } catch {
      const fileId = driveId(row.driveUrl);
      if (!fileId) throw new Error(`No Drive id for ${row.name}`);
      const buffer = await downloadDriveFile(fileId);
      await saveWebp(buffer, dest, sharp);
      console.log(`ok  ${slug}.webp (${buffer.length} bytes in)`);
    }
    records.push(toResultRecord(row, index, publicPath));
    if (row.youtubeId) {
      stories.push({
        id: `ipmat-story-${stories.length + 1}`,
        youtubeId: row.youtubeId,
        student: row.name,
        subtitle: row.college.split(",")[0].trim(),
      });
    }
  }

  const landing = JSON.parse(await fs.readFile(LANDING_PATH, "utf8"));
  for (const category of landing.categories) {
    if (category.id === "ipmat") {
      category.results = records;
      if (stories.length) category.stories = stories;
    } else if (category.id !== "cat") {
      category.results = [];
    }
  }

  await fs.writeFile(LANDING_PATH, `${JSON.stringify(landing, null, 2)}\n`);
  console.log(`Wrote ${records.length} IPMAT results (home limit ${HOME_LIMIT})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
