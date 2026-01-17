import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

import { blogIndexPlugin } from "./src/lib/plugins/blog-index";
import { remarkRemoveFirstHeading } from "./src/lib/plugins/remark-remove-first-heading";
export default defineConfig({
	plugins: [
		blogIndexPlugin(),
		mdx({
			remarkPlugins: [
				remarkFrontmatter,
				[remarkMdxFrontmatter, { name: "frontmatter" }],
				remarkGfm,
				remarkRemoveFirstHeading,
			],
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
			providerImportSource: "@mdx-js/react",
		}),
		react(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		fs: {
			allow: [".."],
		},
	},
	publicDir: "public",
});
