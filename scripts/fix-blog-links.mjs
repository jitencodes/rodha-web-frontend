import fs from "node:fs";

let s = fs.readFileSync("src/data/blog.ts", "utf8");
s = s.replace(
  /href="\/" target="_blank">CAT online coaching/g,
  'href="/category/cat">CAT online coaching'
);
s = s.replace(
  /href="\/" target="_blank">IPMAT online coaching/g,
  'href="/category/ipmat">IPMAT online coaching'
);
s = s.replace(
  /href="(\/(?:blog|category)[^"]*)" target="_blank"/g,
  'href="$1"'
);
// Explore course CTAs that still point at home
s = s.replace(
  /href="\/"( target="_blank")?>((?:CAT|IPMAT|SSC) courses)</gi,
  (match, _t, label) => {
    const dest =
      label.toLowerCase().startsWith("cat")
        ? "/category/cat"
        : label.toLowerCase().startsWith("ipmat")
          ? "/category/ipmat"
          : "/category/ssc";
    return `href="${dest}">${label}<`;
  }
);
fs.writeFileSync("src/data/blog.ts", s);
console.log({
  cloudfront: (s.match(/cloudfront|d502jbuhuh9wk/g) || []).length,
  oldBlog: (s.match(/rodha\.co\.in\/blog/g) || []).length,
  homeCoaching: (s.match(/href="\/"[^>]*>CAT online coaching/g) || []).length,
});
