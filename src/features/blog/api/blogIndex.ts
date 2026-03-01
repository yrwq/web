import { posts } from "virtual:blog-content";
import type { BlogPostMeta } from "../types/blog";

const includeDrafts = import.meta.env.DEV && typeof window !== "undefined";

export function getAllPosts(): BlogPostMeta[] {
	return posts
		.filter((post: BlogPostMeta) => includeDrafts || !post.draft)
		.sort(
			(a: BlogPostMeta, b: BlogPostMeta) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
}
