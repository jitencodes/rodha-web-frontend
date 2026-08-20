import fs from "node:fs";

const html = await (await fetch("https://www.rodha.co.in/blog/cat-2026-notification")).text();
fs.writeFileSync("scripts/sample-blog.html", html);
console.log("len", html.length);
console.log("title", (html.match(/<title[^>]*>([^<]+)/i) || [])[1]);

function meta(prop) {
  const re1 = new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)`, "i");
  const re2 = new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, "i");
  const re3 = new RegExp(`name=["']${prop}["'][^>]*content=["']([^"']+)`, "i");
  const re4 = new RegExp(`content=["']([^"']+)["'][^>]*name=["']${prop}["']`, "i");
  return (html.match(re1) || html.match(re2) || html.match(re3) || html.match(re4) || [])[1];
}

console.log("og:image", meta("og:image"));
console.log("og:description", (meta("og:description") || "").slice(0, 160));
console.log("description", (meta("description") || "").slice(0, 160));

const classes = [...html.matchAll(/class=["']([^"']*(?:blog|article|content|post|editor)[^"']*)["']/gi)]
  .map((m) => m[1])
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 40);
console.log("classes", classes);

const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]).slice(0, 20);
console.log("imgs", imgs);
