import type { Config } from "tailwindcss";

import svgToDataUri from "mini-svg-data-uri";
import colors from "tailwindcss/colors";
// @ts-expect-error: flattenColorPalette does not have type definitions
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: "class",
  theme: {
  	extend: {
  		colors: {
  			base: 'var(--color-base)',
  			surface: 'var(--color-surface)',
  			overlay: 'var(--color-overlay)',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			subtle: 'var(--color-subtle)',
  			text: 'var(--color-text)',
  			red: 'var(--color-red)',
  			orange: 'var(--color-orange)',
  			yellow: 'var(--color-yellow)',
  			green: 'var(--color-green)',
  			cyan: 'var(--color-cyan)',
  			blue: 'var(--color-blue)',
  			purple: 'var(--color-purple)',
  			'highlight-low': 'var(--color-highlight-low)',
  			'highlight-med': 'var(--color-highlight-med)',
  			'highlight-high': 'var(--color-highlight-high)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    typography,
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
        // GitHub Dark theme colors
        ".dark": {
          "--color-base": "#0d1117", // Canvas default
          "--color-surface": "#161b22", // Canvas subtle
          "--color-overlay": "#21262d", // Canvas inset
          "--color-muted": "#30363d", // Foreground subtle
          "--color-subtle": "#484f58", // Foreground muted
          "--color-text": "#c9d1d9", // Foreground default
          "--color-red": "#f85149", // Danger foreground
          "--color-orange": "#e3b341", // Attention foreground
          "--color-yellow": "#e3b341", // Scale yellow
          "--color-green": "#3fb950", // Success foreground
          "--color-cyan": "#58a6ff", // Accent emphasis
          "--color-blue": "#58a6ff", // Accent foreground
          "--color-purple": "#a371f7", // Done foreground
          "--color-highlight-low": "#161b22", // Canvas subtle
          "--color-highlight-med": "#21262d", // Neutral muted
          "--color-highlight-high": "#30363d", // Border default
          "--color-background": "#0d1117", // Canvas default
          "--color-foreground": "#c9d1d9", // Foreground default
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
      tailwindcssAnimate
],
};
export default config;
