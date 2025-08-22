import mdx from "@mdx-js/esbuild";
import { defineConfig } from "@vercel/turbopack";

export default defineConfig({
	plugins: [
		mdx({
			providerImportSource: "@mdx-js/react",
		}),
	],
});
