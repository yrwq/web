import { posts } from "virtual:blog-content";
import type { BlogPost } from "../types/blog";

const modules = import.meta.glob("/src/content/blog/*.mdx");

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	// Remove .mdx extension if present (in case the route includes it)
	const cleanSlug = slug.replace(/\.mdx$/, "");

	const meta = posts.find((p) => p.slug === cleanSlug);
	if (!meta) {
		return null;
	}

	const path = `/src/content/blog/${cleanSlug}.mdx`;

	if (!modules[path]) {
		console.error(
			`Post component not found for slug: ${slug} at path: ${path}`,
		);
		return null;
	}

	try {
		const mdxModule = (await modules[path]()) as {
			default: React.ComponentType<Record<string, never>>;
		};

		return {
			meta,
			Component: mdxModule.default,
		};
	} catch (e) {
		console.error(`Failed to load post component for slug: ${slug}`, e);
		return null;
	}
}
