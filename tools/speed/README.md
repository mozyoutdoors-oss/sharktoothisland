# Prebuilt Tailwind and image sizes (Nov 1, 2026)

Pages no longer load the Tailwind Play CDN. Each page links `/css/tw/<page>.css`, built from that page's own `tailwind.config`.

**When you change a page's classes or its config, rebuild its CSS**, or new classes won't have styles:

1. Keep the page's config in `tools/speed/cfg/<page>.config.js` (the build script writes these from the old inline configs).
2. Run Tailwind 3.4.17 with `@tailwindcss/forms` and `@tailwindcss/container-queries`:
   `npx tailwindcss@3.4.17 -c tools/speed/cfg/<page>.config.js -i tools/speed/input.css -o css/tw/<page>.css --minify`
3. Bump the `?v=` on the page's `<link>`.

`images.js` made the `-800/-1280/-600.webp` versions and their `srcset`s. `fonts.js` trimmed the icon font to the icons in use (`&icon_names=`); add a name there if a page starts using a new icon.
