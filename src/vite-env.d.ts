/// <reference types="vite/client" />

// interface ImportMetaEnv {
// 	readonly VITE_APP_TITLE: string;
// 	readonly DEV: boolean;
// }

// interface ImportMeta {
// 	readonly env: ImportMetaEnv;
// }

declare module "*.mdx" {
	import type { ComponentProps, ComponentType } from "react";
	const component: ComponentType<ComponentProps<"div">>;
	export default component;
}

declare module "virtual:blog-content" {
	import type { BlogPostMeta } from "@/features/blog/types/blog";
	export const posts: BlogPostMeta[];
}
