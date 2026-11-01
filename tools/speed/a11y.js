// STI accessibility pass: readable text colors, footer headings in order, underlined inline links, labeled sliders.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const SITE = path.resolve(__dirname, "../sti-speed");
const pages = [...fs.readdirSync(SITE).filter(f => f.endsWith(".html")), ...fs.readdirSync(path.join(SITE, "field-notes")).filter(f => f.endsWith(".html")).map(f => "field-notes/" + f)];
const count = {};
// Count each match; a string replacement still expands $1, $2 like String.replace
const sub = (s, re, to, key) => s.replace(re, (...m) => {
  count[key] = (count[key] || 0) + 1;
  return typeof to === "function" ? to(...m) : to.replace(/\$(\d)/g, (x, i) => m[+i] ?? "");
});

for (const p of pages) {
  const file = path.join(SITE, p);
  let s = fs.readFileSync(file, "utf8");
  // text colors
  s = sub(s, /\btext-field-accent(?![-\w/])/g, "text-field-accent-ink", "accent text");
  s = sub(s, /\bbg-field-accent text-white\b/g, "bg-field-accent-ink text-white", "accent buttons");
  s = sub(s, /\btext-white\/(25|30|40)\b/g, "text-white/60", "faint white");
  s = sub(s, /\btext-slate-(400|500)\b/g, "text-slate-600", "slate");
  s = sub(s, /(^|[;{\s"])color:\s*#d97b2b/gi, "$1color: #a15516", "accent in page CSS");
  // footer column titles were h5 with no headings above them
  s = sub(s, /<h5( class="font-label[^"]*")>([\s\S]*?)<\/h5>/g, "<p$1>$2</p>", "h5 to p");
  // links inside text get an underline, not just a color
  s = sub(s, /class="text-primary hover:underline"/g, 'class="text-primary underline underline-offset-2 hover:no-underline"', "body links");
  s = sub(s, /class="text-white\/60 hover:text-white"/g, 'class="text-white/80 underline underline-offset-2 hover:text-white"', "footer credit link");
  s = sub(s, /<a href="identify\.html" style="color:var\(--gold\)">/g, '<a href="identify.html" style="color:var(--gold);text-decoration:underline">', "finds link");
  // sliders need a name
  s = sub(s, /<input type="range" id="tide-slider"/g, '<input type="range" id="tide-slider" aria-label="Tide level"', "labels");
  s = sub(s, /<input type="range" id="tooth-slider"/g, '<input type="range" id="tooth-slider" aria-label="Tooth slant height in millimeters"', "labels");
  // new stylesheet version
  s = s.replace(/(\/css\/tw\/[\w-]+\.css)\?v=\d+/g, "$1?v=20261102");
  fs.writeFileSync(file, s);
}

// colour tokens in each page's saved Tailwind config
const cfgDir = path.join(SITE, "tools/speed/cfg");
for (const f of fs.readdirSync(cfgDir)) {
  const file = path.join(cfgDir, f);
  let c = fs.readFileSync(file, "utf8");
  c = c.replace(/("field-ink-light":\s*)"#7a756d"/g, '$1"#6a655e"').replace(/("outline":\s*)"#717781"/g, '$1"#62686f"');
  if (!c.includes("field-accent-ink")) c = c.replace(/("field-accent":\s*"#d97b2b",)/, '$1 "field-accent-ink": "#a15516",');
  fs.writeFileSync(file, c);
}

// rebuild every page's CSS from the repo root so the saved relative content paths resolve
const env = { ...process.env, NODE_PATH: path.join(__dirname, "node_modules") };
for (const f of fs.readdirSync(cfgDir)) {
  const name = f.replace(".config.js", "");
  execFileSync(process.execPath, [path.join(__dirname, "node_modules/tailwindcss/lib/cli.js"), "-c", path.join(cfgDir, f), "-i", path.join(SITE, "tools/speed/input.css"), "-o", path.join(SITE, "css/tw", name + ".css"), "--minify"], { cwd: SITE, env, stdio: "pipe" });
}
console.log(count);
