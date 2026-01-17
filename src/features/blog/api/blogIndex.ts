import { posts } from "virtual:blog-content";
import type { BlogPostMeta } from "../types/blog";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
	return posts
		.filter((post: BlogPostMeta) => import.meta.env.DEV || !post.draft)
		.sort(
			(a: BlogPostMeta, b: BlogPostMeta) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
}
