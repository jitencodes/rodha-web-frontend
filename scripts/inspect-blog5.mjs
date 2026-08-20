import fs from "node:fs";

const html = fs.readFileSync("scripts/sample-blog.html", "utf8");
const start = html.indexOf('<div class="cm-hero-blog">');
const endWindow = html.slice(45000, 52000);
fs.writeFileSync("scripts/sample-end.html", endWindow);
console.log(endWindow.slice(0, 3000));
