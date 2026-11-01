# SharkToothIsland.org: notes for Claude Code

Claude Code edits this site (not Codex). Rob approves anything that goes live: a push to `main` publishes on GitHub Pages in about a minute, and there is no preview host, so work on a branch and preview locally (the `sti-speed-preview` / `sti-main-preview` configs in `Sites\.claude\launch.json`).

## Styles are prebuilt (since Nov 1, 2026)
Pages do **not** load the Tailwind Play CDN any more. Each page links its own stylesheet, `/css/tw/<page>.css` (field notes: `/css/tw/field-notes--<page>.css`), built from that page's Tailwind config.

**Any time you add or change Tailwind classes on a page, or its config, rebuild that page's CSS**, or the new classes will have no styles:

```bash
npx -y tailwindcss@3.4.17 -c tools/speed/cfg/<page>.config.js -i tools/speed/input.css -o css/tw/<page>.css --minify
```

- The config files live in `tools/speed/cfg/`. Their plugins (`@tailwindcss/forms@0.5.10`, `@tailwindcss/container-queries@0.1.1`) must be installed where you run the build (`npm i tailwindcss@3.4.17 @tailwindcss/forms@0.5.10 @tailwindcss/container-queries@0.1.1` in a scratch folder works; point `-c` at the config).
- A new page: copy the nearest config in `tools/speed/cfg/`, set `content` to the new page, build, and add `<link rel="stylesheet" href="/css/tw/<page>.css?v=YYYYMMDD">` just before `</head>`.
- Then bump that `?v=` so browsers fetch the new file.
- Tailwind only sees class names written out in full. Don't build them from pieces in scripts (`'bg-' + color`); write each full class name somewhere in the page.
- Never put the CDN script back. It cost about 6 seconds of blank screen on phones.

## Icons
The Material Symbols font is requested with `&icon_names=` so it only contains the icons the site uses (15 KB instead of 1 MB). **A new icon must be added to that list on every page** (it's the same list everywhere; keep it alphabetical), or it will show as its name in plain text. The list was built by `tools/speed/fonts.js`.

## Images
Big photos have smaller WebP versions (`-800`, `-1280`, `-600`) and a `srcset`. A new large photo should get the same treatment (`tools/speed/images.js` shows how). Don't add `srcset` to images that size themselves from their own dimensions (the tooth illustrations with `max-w-full max-h-full`): it changes how big they render.

## Analytics
`analytics.js` loads Google Analytics after the page has loaded. Visits that leave within a second or two may not be counted. `stiTrack()` events queue until the tag loads.

## Accessibility (Nov 1, 2026 pass on branch a11y)
23 of 25 pages score 100. Text colors darkened (field-ink-light #6a655e, outline #62686f, new field-accent-ink #a15516 for orange text on light backgrounds; dark footers use field-accent-light), footer column titles are `<p>` not `<h5>`, inline links underlined, sliders labeled. Still open: one item each on depth-of-time and field-notes/index. Scripts: tools/speed/a11y.js, a11y2.js.

## Speed record
Lighthouse mobile performance, before -> after (Nov 1, 2026): Home 56 -> 89, How to visit 57 -> 85, Hunt Planner 57 -> 86, Field Guide 56 -> 74, How to find 56 -> 90, Finds 57 -> 99.
