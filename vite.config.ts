import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import path from "path";

import { blogIndexPlugin } from "./src/lib/plugins/blog-index";
import { remarkRemoveFirstHeading } from "./src/lib/plugins/remark-remove-first-heading";

// https://vite.dev/config/
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
});
