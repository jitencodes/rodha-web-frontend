import fs from "node:fs";

const html = fs.readFileSync("scripts/sample-blog.html", "utf8");

const start = html.indexOf('<div class="cm-hero-blog">');
const faqEnd = html.indexOf("FAQs on CAT 2026 Notification");
// Find end of last FAQ section - look after last h2
const lastH2 = html.lastIndexOf("<h2");
console.log("start", start, "lastH2", lastH2);

// Find a sensible end - after FAQs section closes before footer/nav
const afterFaq = html.indexOf("</section>", faqEnd);
console.log("afterFaq section", afterFaq);

// Try finding is-box after content
const slice = html.slice(start, start + 50000);
fs.writeFileSync("scripts/sample-body-slice.html", slice);
console.log("wrote slice", slice.length);

// Count tables in slice
console.log("tables", (slice.match(/<table/gi) || []).length);
console.log("h2", (slice.match(/<h2/gi) || []).length);
console.log("h3", (slice.match(/<h3/gi) || []).length);
