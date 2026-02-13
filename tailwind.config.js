export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          light: "var(--accent-light)",
        },
        muted: "var(--muted)",
        panel: {
          DEFAULT: "var(--panel)",
          deeper: "var(--panel-deeper)",
        },
        red: "var(--red)",
        orange: "var(--orange)",
        yellow: "var(--yellow)",
        green: "var(--green)",
        aqua: "var(--aqua)",
        blue: "var(--blue)",
        purple: "var(--purple)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
