#!/usr/bin/env bun
import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import puppeteer from "puppeteer";
import type { BlogPostMeta } from "../src/features/blog/types/blog";
import { getBlogPostsWithContent } from "../src/lib/utils/blog-utils";
import { generateRSSFeed as createRSSFeed } from "../src/lib/utils/rss";

type BlogPostContent = { meta: BlogPostMeta; content: string };

function createBlogPostHTML(post: BlogPostContent): string {
	const { meta } = post;

	const htmlContent = marked(post.content, {
		gfm: true,
		breaks: true,
	});

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 2.5em; margin-bottom: 0.5em; color: #1a202c; }
        .meta { color: #666; margin-bottom: 2em; font-size: 0.9em; }
        .tags { margin-top: 2em; }
        .tag { display: inline-block; background: #e2e8f0; padding: 0.25em 0.5em; margin-right: 0.5em; border-radius: 0.25em; font-size: 0.8em; }
        h2, h3, h4, h5, h6 { margin-top: 2em; margin-bottom: 1em; color: #2d3748; }
        p { margin-bottom: 1em; }
        code { background: #f7fafc; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.9em; }
        pre { background: #f7fafc; padding: 1em; border-radius: 0.5em; overflow-x: auto; margin-bottom: 1em; font-size: 0.9em; }
        pre code { background: none; padding: 0; font-size: inherit; }
        blockquote { border-left: 4px solid #cbd5e0; padding-left: 1em; margin: 1em 0; color: #4a5568; }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        li { margin-bottom: 0.5em; }
        @media print { body { padding: 0; } pre, code { font-size: 8pt; }
    </style>
</head>
<body>
    <div class="meta">
        ${new Date(meta.date).toLocaleDateString()} ${meta.readingTime ? `• ${meta.readingTime}` : ""}
    </div>

    <div class="content">
        ${htmlContent}
    </div>

    ${
			meta.tags && meta.tags.length > 0
				? `
    <div class="tags">
        ${meta.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join("")}
    </div>
    `
				: ""
		}
</body>
</html>`;
}

async function generatePDFs(posts: BlogPostContent[]) {
	if (posts.length === 0) return;

	const pdfDir = path.resolve(process.cwd(), "public/pdf");
	await fs.mkdir(pdfDir, { recursive: true });

	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		for (const post of posts) {
			const page = await browser.newPage();
			const htmlContent = createBlogPostHTML(post);

			await page.setContent(htmlContent, {
				waitUntil: "networkidle0",
			});

			const pdfData = await page.pdf({
				format: "A4",
				margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
				printBackground: true,
				preferCSSPageSize: true,
			});

			const pdfPath = path.join(pdfDir, `${post.meta.slug}.pdf`);
			await fs.writeFile(pdfPath, pdfData);
			await page.close();
		}
	} finally {
		await browser.close();
	}
}

async function generateRSSFeed(posts: Array<{ meta: BlogPostMeta }>) {
	const rssOptions = {
		title: "yrwq",
		description: "Personal blog and website",
		site_url: "https://yrwq.dev",
		feed_url: "https://yrwq.dev/rss.xml",
		author: "yrwq",
		language: "en",
	};

	const rssXml = createRSSFeed(
		posts.map((p) => p.meta),
		rssOptions,
	);

	const publicDir = path.resolve(process.cwd(), "public");
	await fs.mkdir(publicDir, { recursive: true });

	const rssPath = path.join(publicDir, "rss.xml");
	const rssContent = await rssXml;
	await fs.writeFile(rssPath, rssContent, "utf8");
}

async function generateAll() {
	const posts = await getBlogPostsWithContent();

	if (posts.length === 0) return;

	await generatePDFs(posts);
	await generateRSSFeed(posts);
}

generateAll();
