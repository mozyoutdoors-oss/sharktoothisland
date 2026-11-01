const c = {
  theme: {
    extend: {
      colors: {
        "surface": "#f9f9f9",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#414750",
        "outline": "#62686f",
        "outline-variant": "#c1c7d2",
        "primary": "#085f9e",
        "primary-container": "#3478b8",
        "primary-fixed": "#d1e4ff",
        "primary-fixed-dim": "#9ecaff",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#001d36",
        "secondary": "#5e5e5e",
        "tertiary": "#435c86",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a"
      },
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
      fontFamily: { headline: ["Public Sans"], body: ["Public Sans"], label: ["Space Grotesk"] }
    }
  }
};
module.exports = Object.assign(c, { content: ["depth-of-time.html"], plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")] });
