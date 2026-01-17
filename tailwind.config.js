export default {
	content: ["./index.html", "./src/**/*.{ts,tsx,md,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				border: "var(--border)",
				accent: "var(--accent)",
				muted: "var(--muted)",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
