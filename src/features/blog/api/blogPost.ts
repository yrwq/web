import { posts } from "virtual:blog-content";
import type { BlogPost } from "../types/blog";

const postModules = import.meta.glob("/src/content/blog/*.mdx", { eager: true });

export function getPostBySlug(slug: string): BlogPost | null {
	const cleanSlug = slug.replace(/\.mdx$/, "");

	const meta = posts.find((p) => p.slug === cleanSlug);
	if (!meta) {
		return null;
	}

	try {
		const modulePath = `/src/content/blog/${cleanSlug}.mdx`;
		const mdxModule = postModules[modulePath] as
			| { default: React.ComponentType<Record<string, never>> }
			| undefined;
		if (!mdxModule) {
			return null;
		}

		return {
			meta,
			Component: mdxModule.default,
		};
	} catch (_e) {
		return null;
	}
}
