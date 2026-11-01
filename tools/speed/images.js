// Smaller versions of STI's heavy images, then a srcset on every <img> that uses them.
const fs = require("fs"), path = require("path"), sharp = require("sharp");
const SITE = path.resolve(__dirname, "../sti-speed");
const plan = [
  { re: /^images\/(break-hunting|break-approach)\.webp$|^images\/hero-island\.jpg$/, widths: [800, 1280], sizes: "100vw" },
  { re: /^images\/guide2026-[a-z]+\.jpg$/, widths: [600], sizes: "(max-width: 768px) 100vw, 50vw" },
  { re: /^images\/tooth-[a-z-]+\.webp$/, widths: [300], sizes: "(max-width: 768px) 50vw, 25vw" },
];
const pages = [...fs.readdirSync(SITE).filter(f => f.endsWith(".html")), ...fs.readdirSync(path.join(SITE, "field-notes")).filter(f => f.endsWith(".html")).map(f => "field-notes/" + f)];
(async () => {
  const made = {};
  for (const f of fs.readdirSync(path.join(SITE, "images"))) {
    const rel = "images/" + f, rule = plan.find(p => p.re.test(rel));
    if (!rule) continue;
    const meta = await sharp(path.join(SITE, rel)).metadata();
    made[rel] = { rule, w: meta.width, variants: [] };
    for (const w of rule.widths) {
      if (w >= meta.width) continue;
      const out = rel.replace(/\.(jpg|webp)$/, `-${w}.webp`);
      await sharp(path.join(SITE, rel)).resize({ width: w }).webp({ quality: 76 }).toFile(path.join(SITE, out));
      made[rel].variants.push([w, out]);
      console.log(out, Math.round(fs.statSync(path.join(SITE, out)).size / 1024) + "KB");
    }
  }
  let tags = 0;
  for (const p of pages) {
    const file = path.join(SITE, p);
    let html = fs.readFileSync(file, "utf8");
    const dir = path.posix.dirname(p);
    html = html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (tag, pre, src, post) => {
      if (/srcset=/.test(tag) || /^https?:/.test(src)) return tag;
      const rel = path.posix.normalize(path.posix.join(dir, src)), m = made[rel];
      if (!m || !m.variants.length) return tag;
      const prefix = src.slice(0, src.length - rel.length + rel.indexOf("images/")) ;
      const set = [...m.variants.map(([w, out]) => `${prefix}${out} ${w}w`), `${src} ${m.w}w`].join(", ");
      tags++;
      return `<img${pre}src="${src}" srcset="${set}" sizes="${m.rule.sizes}"${post}>`;
    });
    fs.writeFileSync(file, html);
  }
  console.log("img tags updated:", tags);
})();
