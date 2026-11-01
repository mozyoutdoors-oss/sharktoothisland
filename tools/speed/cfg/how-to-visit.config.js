const c = {
  theme: {
    extend: {
      colors: {
        "surface": "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#414750",
        "outline": "#717781",
        "outline-variant": "#c1c7d2",
        "primary": "#085f9e",
        "primary-container": "#3478b8",
        "primary-fixed": "#d1e4ff",
        "on-primary": "#ffffff"
      },
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
      fontFamily: { headline: ["Public Sans"], body: ["Public Sans"], label: ["Space Grotesk"] }
    }
  }
};
module.exports = Object.assign(c, { content: ["how-to-visit.html"], plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")] });
