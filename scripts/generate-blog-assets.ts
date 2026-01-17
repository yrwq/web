#!/usr/bin/env bun
import fs from "node:fs/promises";
import path from "node:path";
import { Marked, marked } from "marked";
import puppeteer from "puppeteer";
import { createHighlighter } from "shiki";
import type { BlogPostMeta } from "../src/features/blog/types/blog";
import { getBlogPostsWithContent } from "../src/lib/utils/blog-utils";
import { generateRSSFeed as createRSSFeed } from "../src/lib/utils/rss";

type BlogPostContent = { meta: BlogPostMeta; content: string };

const SHIKI_THEME = "github-light";
const FALLBACK_LANGUAGE = "text";

type CodeBlockMeta = {
	lang: string;
	title: string | null;
	caption: string | null;
	lineNumbersStart: number | null;
	highlightedLines: Set<number>;
};

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function parseLineRanges(input: string): Set<number> {
	const output = new Set<number>();
	const parts = input.split(",").map((part) => part.trim());

	for (const part of parts) {
		if (!part) continue;
		const range = part.split("-").map((value) => value.trim());
		if (range.length === 1) {
			const num = Number(range[0]);
			if (Number.isFinite(num)) output.add(num);
			continue;
		}
		const start = Number(range[0]);
		const end = Number(range[1]);
		if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
		const min = Math.min(start, end);
		const max = Math.max(start, end);
		for (let i = min; i <= max; i += 1) output.add(i);
	}

	return output;
}

function parseCodeMeta(infoString?: string): CodeBlockMeta {
	const raw = infoString?.trim() ?? "";
	const [langToken, ...metaParts] = raw.split(/\s+/);
	const lang =
		langToken && langToken.length > 0 ? langToken : FALLBACK_LANGUAGE;
	let meta = metaParts.join(" ");

	let title: string | null = null;
	let caption: string | null = null;
	const titleMatch = meta.match(/title="([^"]*)"/);
	if (titleMatch) {
		title = titleMatch[1] ?? null;
		meta = meta.replace(titleMatch[0], "");
	}
	const captionMatch = meta.match(/caption="([^"]*)"/);
	if (captionMatch) {
		caption = captionMatch[1] ?? null;
		meta = meta.replace(captionMatch[0], "");
	}

	let lineNumbersStart: number | null = null;
	const lineNumbersMatch = meta.match(/showLineNumbers(?:\{(\d+)\})?/);
	if (lineNumbersMatch) {
		const startValue = lineNumbersMatch[1];
		lineNumbersStart = startValue ? Number(startValue) : 1;
		meta = meta.replace(lineNumbersMatch[0], "");
	}

	const highlightedLines = new Set<number>();
	if (meta.includes("{")) {
		const rangeMatches = [...meta.matchAll(/\{([^}]+)\}/g)];
		for (const match of rangeMatches) {
			if (!match[1]) continue;
			const lines = parseLineRanges(match[1]);
			for (const line of lines) highlightedLines.add(line);
		}
	}

	return {
		lang,
		title,
		caption,
		lineNumbersStart,
		highlightedLines,
	};
}

function addLineNumbers(html: string, startAt: number | null): string {
	if (!startAt) return html;

	return html.replace(/<code([^>]*)>/, (_match, attrs) => {
		let updated = attrs;
		if (!/data-line-numbers/.test(updated)) {
			updated += ' data-line-numbers=""';
		}
		const startValue = Math.max(startAt - 1, 0);
		if (/style=/.test(updated)) {
			updated = updated.replace(
				/style="([^"]*)"/,
				(_styleMatch, styleValue) =>
					`style="${styleValue}; counter-set: line ${startValue};"`,
			);
		} else {
			updated += ` style="counter-set: line ${startValue};"`;
		}
		return `<code${updated}>`;
	});
}

function addHighlightedLines(html: string, highlighted: Set<number>): string {
	if (highlighted.size === 0) return html;
	let lineIndex = 0;
	return html.replace(/<span class="line">/g, (match) => {
		lineIndex += 1;
		if (highlighted.has(lineIndex)) {
			return '<span class="line" data-highlighted-line="">';
		}
		return match;
	});
}

function normalizeCodeBlockHtml(html: string): string {
	const normalized = html.replace(/<code([^>]*)>/, (_match, attrs) => {
		if (/style=/.test(attrs)) {
			const updated = attrs.replace(
				/style="([^"]*)"/,
				(_styleMatch, styleValue) => {
					const cleaned = styleValue
						.replace(/display\s*:\s*grid;?/gi, "")
						.replace(/;;+/g, ";")
						.trim();
					const nextStyle =
						cleaned.length > 0
							? `${cleaned}; display: block;`
							: "display: block;";
					return `style="${nextStyle}"`;
				},
			);
			return `<code${updated} data-pdf-code="">`;
		}

		return `<code${attrs} style="display: block;" data-pdf-code="">`;
	});
	return normalized
		.replace(/(<code[^>]*>)\s*\n\s*/g, "$1")
		.replace(/<\/span>\s*\n\s*(<span[^>]*>)/g, "</span>$1");
}

function wrapCodeBlock(
	html: string,
	meta: Pick<CodeBlockMeta, "title" | "caption">,
): string {
	const normalizedHtml = normalizeCodeBlockHtml(html);
	const title = meta.title ? escapeHtml(meta.title) : "";
	const caption = meta.caption ? escapeHtml(meta.caption) : "";
	const titleBlock = title
		? `<div data-rehype-pretty-code-title>${title}</div>`
		: "";
	const captionBlock = caption
		? `<figcaption data-rehype-pretty-code-caption>${caption}</figcaption>`
		: "";

	return `<figure data-rehype-pretty-code-figure>${titleBlock}${normalizedHtml}${captionBlock}</figure>`;
}

function createMarkdownParser(
	highlighter: Awaited<ReturnType<typeof createHighlighter>>,
) {
	const renderer = new marked.Renderer();

	renderer.code = (token) => {
		return typeof token.text === "string" ? token.text : "";
	};

	const parser = new Marked();
	parser.setOptions({
		gfm: true,
		breaks: true,
		async: true,
	});
	parser.use({
		renderer,
		walkTokens: async (token) => {
			if (token.type !== "code") return;
			const code = typeof token.text === "string" ? token.text : "";
			const meta = parseCodeMeta(token.lang);
			try {
				let html = await highlighter.codeToHtml(code, {
					lang: meta.lang,
					theme: SHIKI_THEME,
				});
				html = addLineNumbers(html, meta.lineNumbersStart);
				html = addHighlightedLines(html, meta.highlightedLines);
				token.text = wrapCodeBlock(html, meta);
			} catch {
				let html = await highlighter.codeToHtml(code, {
					lang: FALLBACK_LANGUAGE,
					theme: SHIKI_THEME,
				});
				html = addLineNumbers(html, meta.lineNumbersStart);
				html = addHighlightedLines(html, meta.highlightedLines);
				token.text = wrapCodeBlock(html, meta);
			}
		},
	});

	return parser;
}

async function createBlogPostHTML(
	post: BlogPostContent,
	parser: Marked,
): Promise<string> {
	const { meta } = post;

	const htmlContent = await parser.parse(post.content);

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
        figure[data-rehype-pretty-code-figure] { margin: 1.25rem 0; position: relative; border: 1px solid #e5e7eb; background: #ffffff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06); }
        figure[data-rehype-pretty-code-figure] > [data-rehype-pretty-code-title] { font-size: 0.8em; color: #6b7280; padding: 0.35rem 0.75rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb; letter-spacing: 0.03em; text-transform: uppercase; }
        figure[data-rehype-pretty-code-figure] figcaption { font-size: 0.75em; color: #6b7280; padding: 0.35rem 0.75rem; border-top: 1px solid #e5e7eb; background: #f9fafb; letter-spacing: 0.03em; text-transform: uppercase; }
        figure[data-rehype-pretty-code-figure] pre { margin: 0; border: 0; box-shadow: none; background: transparent; font-size: 0.9em; line-height: 1.6; padding: 0.75rem 1rem; }
        figure[data-rehype-pretty-code-figure] code { font-family: 'Iosevka', 'Monaco', 'Menlo', monospace; line-height: 1.6; }
        figure[data-rehype-pretty-code-figure] code[data-pdf-code] { display: block !important; line-height: 1.6; row-gap: 0 !important; column-gap: 0 !important; grid-auto-rows: auto !important; align-content: start; }
        figure[data-rehype-pretty-code-figure] code[data-line-numbers] { counter-reset: line; }
        figure[data-rehype-pretty-code-figure] [data-line], figure[data-rehype-pretty-code-figure] .line { display: block; padding: 0 0.25rem; border-left: 2px solid transparent; position: relative; counter-increment: line; }
        figure[data-rehype-pretty-code-figure] [data-line]:hover, figure[data-rehype-pretty-code-figure] .line:hover { border-left-color: #d1d5db; background: rgba(243, 244, 246, 0.8); }
        figure[data-rehype-pretty-code-figure] code[data-line-numbers] [data-line], figure[data-rehype-pretty-code-figure] code[data-line-numbers] .line { padding-left: 3rem; }
        figure[data-rehype-pretty-code-figure] code[data-line-numbers] [data-line]::before, figure[data-rehype-pretty-code-figure] code[data-line-numbers] .line::before { content: counter(line); position: absolute; left: 0; width: 2.25rem; text-align: right; color: #9ca3af; }
        figure[data-rehype-pretty-code-figure] [data-highlighted-line], figure[data-rehype-pretty-code-figure] .highlighted { background: rgba(254, 240, 138, 0.35); border-left-color: #f59e0b; }
        blockquote { border-left: 4px solid #cbd5e0; padding-left: 1em; margin: 1em 0; color: #4a5568; }
        a { color: #3182ce; text-decoration: none; }
        a:hover { text-decoration: underline; }
        ul, ol { margin-bottom: 1em; padding-left: 2em; }
        li { margin-bottom: 0.5em; }
        @media print { body { padding: 0; } pre, code { font-size: 8pt; } }
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

	const highlighter = await createHighlighter({
		themes: [SHIKI_THEME],
		langs: [
			"bash",
			"css",
			"html",
			"javascript",
			"json",
			"markdown",
			"mdx",
			"tsx",
			"typescript",
		],
	});
	const parser = createMarkdownParser(highlighter);

	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		for (const post of posts) {
			const page = await browser.newPage();
			const htmlContent = await createBlogPostHTML(post, parser);

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
