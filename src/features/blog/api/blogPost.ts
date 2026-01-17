import { posts } from "virtual:blog-content";
import type { BlogPost } from "../types/blog";

const modules = import.meta.glob("/src/content/blog/*.mdx");

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const meta = posts.find((p) => p.slug === slug);
	if (!meta) {
		return null;
	}

	const path = `/src/content/blog/${slug}.mdx`;

	if (!modules[path]) {
		console.error(
			`Post component not found for slug: ${slug} at path: ${path}`,
		);
		return null;
	}

	try {
		const mdxModule = (await modules[path]()) as {
			default: React.ComponentType<any>;
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
