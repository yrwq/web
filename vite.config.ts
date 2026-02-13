import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
	type CharsElement,
	type LineElement,
} from "rehype-pretty-code";
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
			rehypePlugins: [
				rehypeSlug,
				rehypeAutolinkHeadings,
				[
					rehypePrettyCode,
					{
						theme: "gruvbox-dark-hard",
						keepBackground: true,
						onVisitLine(node: LineElement) {
							if (node.children.length === 0) {
								node.children = [{ type: "text", value: " " }];
							}
							node.properties.className = [
								...(node.properties.className || []),
								"line",
							];
						},
						onVisitHighlightedLine(node: LineElement, _id?: string) {
							node.properties.className = [
								...(node.properties.className || []),
								"highlighted",
							];
						},
						onVisitHighlightedChars(node: CharsElement, _id?: string) {
							node.properties.className = [
								...(node.properties.className || []),
								"highlighted-word",
							];
						},
					},
				],
			],
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
