import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import readingTime from "reading-time";
import type { BlogPostMeta } from "../../features/blog/types/blog.ts";

export interface BlogPostWithContent {
	meta: BlogPostMeta;
	content: string;
	mdxContent: string;
}

export function parseFrontmatter(content: string) {
	const normalized = content.replace(/^\uFEFF/, "");
	const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);

	if (!match) {
		return { data: {}, content: normalized };
	}

	try {
		const data = yaml.load(match[1]);
		const body = normalized.slice(match[0].length).trim();
		return { data: data as Record<string, unknown>, content: body };
	} catch (_e) {
		return { data: {}, content: normalized };
	}
}

export async function getBlogPostsWithContent(): Promise<
	Array<BlogPostWithContent>
> {
	const contentDir = path.resolve(process.cwd(), "src/content/blog");
	const posts: Array<{
		meta: BlogPostMeta;
		content: string;
		mdxContent: string;
	}> = [];

	try {
		const files = await fs.readdir(contentDir);
		const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

		for (const file of mdxFiles) {
			const filePath = path.join(contentDir, file);
			const fileContent = await fs.readFile(filePath, "utf-8");
			const { data, content } = parseFrontmatter(fileContent);

			if (!data.title || data.draft) {
				continue;
			}

			const slug = file.replace(/\.mdx$/, "");
			const stats = readingTime(content);

			const { slug: _slug, ...restData } = data;

			const meta: BlogPostMeta = {
				slug,
				title: data.title as string,
				date: data.date
					? new Date(data.date as string).toISOString()
					: new Date().toISOString(),
				description: (data.description as string) || "",
				tags: (data.tags as string[]) || [],
				draft: (data.draft as boolean) || false,
				readingTime: stats.text,
				...restData,
			};

			posts.push({
				meta,
				content,
				mdxContent: fileContent,
			});
		}
	} catch (_error) {}

	return posts.filter((post) => !post.meta.draft);
}

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
	const postsWithContent = await getBlogPostsWithContent();
	return postsWithContent
		.map((post) => post.meta)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
