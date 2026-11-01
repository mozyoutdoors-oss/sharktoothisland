// STI fonts: ask Google for only the icons the site uses, and load the text fonts without blocking the first paint.
const fs = require("fs"), path = require("path");
const SITE = path.resolve(__dirname, "../sti-speed");
const icons = fs.readFileSync(path.join(__dirname, "sti-icons.txt"), "utf8").trim();
const pages = [...fs.readdirSync(SITE).filter(f => f.endsWith(".html")), ...fs.readdirSync(path.join(SITE, "field-notes")).filter(f => f.endsWith(".html")).map(f => "field-notes/" + f)];
let n = 0;
for (const p of pages) {
  const file = path.join(SITE, p);
  let s = fs.readFileSync(file, "utf8"), before = s;
  s = s.replace("family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap", `family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&icon_names=${icons}&display=swap`);
  s = s.replace(/<link href="(https:\/\/fonts\.googleapis\.com\/css2\?family=(?!Material)[^"]*)" rel="stylesheet">/g,
    (m, href) => `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`);
  if (s !== before) { fs.writeFileSync(file, s); n++; }
}
console.log("pages updated:", n);
