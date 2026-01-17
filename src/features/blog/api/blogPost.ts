import { posts } from "virtual:blog-content";
import type { BlogPost } from "../types/blog";

const postModules = import.meta.glob("/src/content/blog/*.mdx");

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const cleanSlug = slug.replace(/\.mdx$/, "");

	const meta = posts.find((p) => p.slug === cleanSlug);
	if (!meta) {
		return null;
	}

	try {
		const modulePath = `/src/content/blog/${cleanSlug}.mdx`;
		let loader: (() => Promise<unknown>) | undefined = postModules[modulePath];
		if (!loader) {
			const match = Object.entries(postModules).find(([path]) =>
				path.endsWith(`${cleanSlug}.mdx`),
			);
			loader = match?.[1];
		}
		if (!loader) {
			return null;
		}
		const mdxModule = (await loader()) as {
			default: React.ComponentType<Record<string, never>>;
		};

		return {
			meta,
			Component: mdxModule.default,
		};
	} catch (_e) {
		return null;
	}
}
