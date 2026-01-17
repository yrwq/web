import RSS from "rss";
import type { BlogPostMeta } from "@/features/blog/types/blog";

export interface RSSFeedOptions {
	title: string;
	description: string;
	site_url: string;
	feed_url: string;
	author?: string;
	language?: string;
}

export function generateRSSFeed(
	posts: BlogPostMeta[],
	options: RSSFeedOptions,
): string {
	const feed = new RSS({
		title: options.title,
		description: options.description,
		feed_url: options.feed_url,
		site_url: options.site_url,
		language: options.language || "en",
		copyright: `© ${new Date().getFullYear()} ${options.author || "Blog Author"}`,
	});

	posts.forEach((post) => {
		const postUrl = `${options.site_url}/blog/${post.slug}`;

		feed.item({
			title: post.title,
			description: post.description || "",
			url: postUrl,
			guid: postUrl,
			date: new Date(post.date),
			categories: post.tags || [],
		});
	});

	return feed.xml({ indent: true });
}
