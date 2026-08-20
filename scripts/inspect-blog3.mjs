import fs from "node:fs";

const html = fs.readFileSync("scripts/sample-blog.html", "utf8");

// Find all h1/h2 near content
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").trim()
);
console.log("h2 count", h2s.length);
console.log(h2s.slice(0, 20));

// Find the main article container - look for "Key Highlights"
const idx = html.indexOf("CAT 2026 Notification: Key Highlights");
console.log("\nkey highlights idx", idx);
console.log(html.slice(idx - 300, idx + 200));

// Find featured image near top
const cloudImgs = [...html.matchAll(/https:\/\/d502jbuhuh9wk\.cloudfront\.net\/articles\/[^"'\s>]+/g)].map(
  (m) => m[0]
);
console.log("\ncloudfront imgs unique", [...new Set(cloudImgs)]);

// Find date patterns
const dates = [...html.matchAll(/(July|August|September|October|November|December|January|February|March|April|May|June)[,\s]+2026/gi)];
console.log("dates", dates.map((d) => d[0]).slice(0, 10));

// Look for author
const authorIdx = html.indexOf("Team Rodha");
console.log("Team Rodha idx", authorIdx, html.slice(authorIdx - 100, authorIdx + 80));
