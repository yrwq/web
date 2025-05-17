import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "var(--color-base)",
        surface: "var(--color-surface)",
        overlay: "var(--color-overlay)",
        muted: "var(--color-muted)",
        subtle: "var(--color-subtle)",
        text: "var(--color-text)",
        red: "var(--color-red)",
        orange: "var(--color-orange)",
        yellow: "var(--color-yellow)",
        green: "var(--color-green)",
        cyan: "var(--color-cyan)",
        blue: "var(--color-blue)",
        purple: "var(--color-purple)",
        "highlight-low": "var(--color-highlight-low)",
        "highlight-med": "var(--color-highlight-med)",
        "highlight-high": "var(--color-highlight-high)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
    },
  },
  plugins: [
    function ({ addBase }: any) {
      addBase({
        // GitHub Light theme colors
        ":root": {
          "--color-base": "#ffffff", // Canvas default
          "--color-surface": "#ebebeb", // Canvas subtle
          "--color-overlay": "#d6d6d6", // Canvas inset
          "--color-muted": "#c7c7c7", // Foreground subtle
          "--color-subtle": "#b8b8b8", // Foreground muted
          "--color-text": "#24292f", // Foreground default
          "--color-red": "#cf222e", // Danger foreground
          "--color-orange": "#bc4c00", // Attention foreground
          "--color-yellow": "#bf8700", // Gold
          "--color-green": "#2da44e", // Success emphasis
          "--color-cyan": "#0969da", // Accent emphasis (blue)
          "--color-blue": "#0969da", // Accent foreground
          "--color-purple": "#8250df", // Purple/Iris
          "--color-highlight-low": "#f6f8fa", // Canvas subtle
          "--color-highlight-med": "#eaeef2", // Neutral muted
          "--color-highlight-high": "#d0d7de", // Border default
          "--color-background": "#ffffff", // Canvas default
          "--color-foreground": "#24292f", // Foreground default
        },
        // Material Darker theme colors
        ".dark": {
          "--color-base": "#212121",
          "--color-surface": "#313131",
          "--color-overlay": "#414141",
          "--color-muted": "#515151",
          "--color-subtle": "#616161",
          "--color-text": "#EEFFFF",
          "--color-red": "#F07178",
          "--color-orange": "#F78C6C",
          "--color-yellow": "#FFCB6B",
          "--color-green": "#C3E88D",
          "--color-cyan": "#89DDFF",
          "--color-blue": "#82AAFF",
          "--color-purple": "#C792EA",
          "--color-highlight-low": "#303030",
          "--color-highlight-med": "#353535",
          "--color-highlight-high": "#4A4A4A",
          "--color-background": "#212121",
          "--color-foreground": "#EEFFFF",
        },
      });
    },
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
            backgroundSize: "20px 20px",
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        },
      );
    },
  ],
};
export default config;
