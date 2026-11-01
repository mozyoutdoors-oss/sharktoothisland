const c = {
  theme: {
    extend: {
      colors: {
        "field-dark":    "#0f2e3d",
        "field-teal":    "#1a4f5e",
        "field-accent":  "#d97b2b",
        "field-accent-light": "#f0a050",
        "field-cream":   "#f5f0e8",
        "field-paper":   "#ede7db",
        "field-ink":     "#1c1a17",
        "field-ink-mid": "#4a4640",
        "field-ink-light":"#7a756d",
        "field-rule":    "#d5cfc5"
      },
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
      fontFamily: { headline: ["Public Sans"], body: ["Public Sans"], label: ["Space Grotesk"] }
    }
  }
};
module.exports = Object.assign(c, { content: ["how-to-find-shark-teeth.html"], plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")] });
