import { posts } from "virtual:blog-content";
import type { BlogPostMeta } from "../types/blog";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
	// Sort and filter logic
	return posts
		.filter((post) => import.meta.env.DEV || !post.draft)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
