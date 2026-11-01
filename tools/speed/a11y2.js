// STI accessibility, round 2: dark footers, page-level grays, the strata chart, two blue panels.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const SITE = path.resolve(__dirname, "../sti-speed");
const pages = [...fs.readdirSync(SITE).filter(f => f.endsWith(".html")), ...fs.readdirSync(path.join(SITE, "field-notes")).filter(f => f.endsWith(".html")).map(f => "field-notes/" + f)];
const n = {};
const hit = k => { n[k] = (n[k] || 0) + 1; };
for (const p of pages) {
  const file = path.join(SITE, p);
  let s = fs.readFileSync(file, "utf8");
  // Dark navy footers: the deep orange is for light backgrounds; use the light orange there
  s = s.replace(/<footer[\s\S]*?<\/footer>/g, f => /bg-field-dark/.test(f) ? f.replace(/\btext-field-accent-ink\b/g, () => (hit("footer orange"), "text-field-accent-light")) : f);
  // Light footers: the Mozy credit link gets an underline
  s = s.replace(/class="text-blue-900 hover:text-blue-700"/g, () => (hit("footer link"), 'class="text-blue-900 underline underline-offset-2 hover:text-blue-700"'));
  // Grays written into page styles
  s = s.replace(/(color:\s*)#7a756d/gi, (m, a) => (hit("page gray"), a + "#6a655e"));
  s = s.replace(/(--stp-muted:\s*)#717781/g, (m, a) => (hit("page gray"), a + "#62686f"));
  s = s.replace(/fill="#717781"/g, () => (hit("page gray"), 'fill="#62686f"')).replace(/color:#717781/g, () => (hit("page gray"), "color:#62686f"));
  // Blue panels
  s = s.replace('class="text-primary-fixed-dim font-body leading-relaxed"', () => (hit("blue panel"), 'class="text-white/90 font-body leading-relaxed"'));
  s = s.replace('class="font-label text-[11px] uppercase tracking-widest opacity-70 mt-2 block"', () => (hit("blue panel"), 'class="font-label text-[11px] uppercase tracking-widest opacity-90 mt-2 block"'));
  // Depth of Time strata: darker age labels on the light bands, dark text on the tan Oligocene band
  if (p === "depth-of-time.html") {
    s = s.replace(/(style="background:#(e9dcc2|d4b887);">\s*<span class="font-label text-\[10px\] uppercase tracking-widest )text-outline/g, (m, a) => (hit("strata"), a + "text-on-surface-variant"));
    s = s.replace(/(<div class="p-5 flex items-start gap-4" style="background:#a8875a;">[\s\S]*?<\/div>\s*<\/div>)/, blk => (hit("strata"), blk.replace("text-white/80", "text-on-surface/80").replace("text-white\"", "text-on-surface\"").replace("text-white/85", "text-on-surface/85")));
  }
  s = s.replace(/(\/css\/tw\/[\w-]+\.css)\?v=\d+/g, "$1?v=20261102b");
  fs.writeFileSync(file, s);
}
const cfgDir = path.join(SITE, "tools/speed/cfg");
const env = { ...process.env, NODE_PATH: path.join(__dirname, "node_modules") };
for (const f of fs.readdirSync(cfgDir)) {
  execFileSync(process.execPath, [path.join(__dirname, "node_modules/tailwindcss/lib/cli.js"), "-c", path.join(cfgDir, f), "-i", path.join(SITE, "tools/speed/input.css"), "-o", path.join(SITE, "css/tw", f.replace(".config.js", ".css")), "--minify"], { cwd: SITE, env, stdio: "pipe" });
}
console.log(n);
