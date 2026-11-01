// Replace the Tailwind Play CDN on each STI page with a prebuilt stylesheet made from that page's own config.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const SITE = path.resolve(__dirname, "../sti-speed");
const OUT = path.join(SITE, "css/tw");
const VER = process.argv[2] || "20261101";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(__dirname, "cfg"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "input.css"), "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n");
const pages = [...fs.readdirSync(SITE).filter(f => f.endsWith(".html")), ...fs.readdirSync(path.join(SITE, "field-notes")).filter(f => f.endsWith(".html")).map(f => "field-notes/" + f)];
const CDN = /<script src="https:\/\/cdn\.tailwindcss\.com\?plugins=forms,container-queries"><\/script>\s*/;
const CFG = /<script>\s*tailwind\.config\s*=\s*([\s\S]*?)<\/script>\s*/;
let done = 0;
for (const p of pages) {
  const file = path.join(SITE, p);
  let html = fs.readFileSync(file, "utf8");
  if (!CDN.test(html)) continue;
  const m = html.match(CFG);
  if (!m) throw new Error("no config in " + p);
  const literal = m[1].trim().replace(/;\s*$/, "");
  const name = p.replace(/\//g, "--").replace(/\.html$/, "");
  const cfgFile = path.join(__dirname, "cfg", name + ".config.js");
  fs.writeFileSync(cfgFile, `const c = ${literal};\nmodule.exports = Object.assign(c, { content: [${JSON.stringify(file)}], plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")] });\n`);
  execFileSync(process.execPath, [path.join(__dirname, "node_modules/tailwindcss/lib/cli.js"), "-c", cfgFile, "-i", path.join(__dirname, "input.css"), "-o", path.join(OUT, name + ".css"), "--minify"], { cwd: __dirname, stdio: "pipe" });
  // The CDN injected its styles at the end of <head>; put the prebuilt sheet there too so the cascade doesn't change
  html = html.replace(CDN, "").replace(CFG, "");
  const nl = html.includes("\r\n") ? "\r\n" : "\n";
  html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="/css/tw/${name}.css?v=${VER}">${nl}</head>`);
  fs.writeFileSync(file, html);
  done++;
  console.log(name, Math.round(fs.statSync(path.join(OUT, name + ".css")).size / 1024) + "KB");
}
console.log("pages converted:", done);
