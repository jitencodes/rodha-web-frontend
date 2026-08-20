import fs from "node:fs";

const html = fs.readFileSync("scripts/sample-blog.html", "utf8");

// Find cm-hero-blog section
const heroIdx = html.indexOf("cm-hero-blog");
console.log("heroIdx", heroIdx);
console.log(html.slice(Math.max(0, heroIdx - 200), heroIdx + 1500).slice(0, 2000));

console.log("\n--- looking for article / blog body ---");
for (const needle of [
  "blog-detail",
  "article-body",
  "blog-content",
  "cm-blog",
  "post-content",
  "editor-content",
  "ql-editor",
  "is-content-800",
  "blogDescription",
  "articleDescription",
]) {
  const i = html.indexOf(needle);
  console.log(needle, i);
}

// Extract JSON-LD or embedded data
const ld = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
console.log("\nld+json count", ld.length);
for (const m of ld.slice(0, 3)) {
  console.log(m[1].slice(0, 400));
  console.log("---");
}

// Look for __NEXT_DATA__ or window.__INITIAL
for (const needle of ["__NEXT_DATA__", "__INITIAL_STATE__", "window.__", "articles/", "blogPost"]) {
  console.log(needle, html.indexOf(needle));
}
