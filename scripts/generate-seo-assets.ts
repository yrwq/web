import path from "node:path";
import { MDXProvider } from "@mdx-js/react";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer, type ViteDevServer } from "vite";
import yaml from "js-yaml";
import RSS from "rss";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "../src/lib/seo";

type ContentEntry = {
	kind: "blog" | "project";
	slug: string;
	title: string;
	date: string;
	description: string;
	draft: boolean;
	html: string;
	path: string;
};

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");

function parseFrontmatter(source: string) {
	const normalized = source.replace(/^\uFEFF/, "");
	const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);

	if (!match) {
		return { data: {}, content: normalized.trim() };
	}

	try {
		return {
			data: (yaml.load(match[1]) as Record<string, unknown>) ?? {},
			content: normalized.slice(match[0].length).trim(),
		};
	} catch {
		return { data: {}, content: normalized.trim() };
	}
}

async function loadEntries(
	vite: ViteDevServer,
	contentDir: string,
	basePath: string,
	kind: "blog" | "project",
): Promise<ContentEntry[]> {
	const files = await Array.fromAsync(new Bun.Glob("*.mdx").scan(contentDir));
	const entries: ContentEntry[] = [];

	for (const file of files) {
		const source = await Bun.file(path.join(contentDir, file)).text();
		const { data, content } = parseFrontmatter(source);

		if (typeof data.title !== "string") continue;

		const slug = file.replace(/\.mdx$/, "");
		const date =
			typeof data.date === "string"
				? new Date(data.date).toISOString()
				: new Date().toISOString();
		const sourceDir = kind === "blog" ? "blog" : "projects";
		const modulePath = `/src/content/${sourceDir}/${slug}.mdx`;
		const mdxModule = (await vite.ssrLoadModule(modulePath)) as {
			default: ComponentType<Record<string, never>>;
		};
		const html = absolutizeSiteUrls(
			renderToStaticMarkup(
				createElement(
					MDXProvider,
					{ components: {} },
					createElement(mdxModule.default),
				),
			),
		);

		entries.push({
			kind,
			slug,
			title: data.title,
			date,
			description: typeof data.description === "string" ? data.description : "",
			draft: Boolean(data.draft),
			html,
			path: `${basePath}/${slug}`,
		});
	}

	return entries
		.filter((entry) => !entry.draft)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function buildUrl(routePath: string) {
	return new URL(routePath, SITE_URL).toString();
}

function absolutizeSiteUrls(html: string) {
	return html
		.replaceAll(/(href|src)="\/(?!\/)/g, (_match, attr) => {
			return `${attr}="${SITE_URL}/`;
		})
		.replaceAll("className=", "class=");
}

function buildFeedHtml(entry: ContentEntry) {
	const meta = `<p><strong>type:</strong> ${entry.kind}</p>`;

	return `${meta}\n${entry.html}`;
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

async function writeSitemap(
	blogEntries: ContentEntry[],
	projectEntries: ContentEntry[],
) {
	const staticRoutes = ["/", "/blog", "/projects"];
	const urls = [
		...staticRoutes.map((routePath) => ({ routePath, lastmod: null })),
		...blogEntries.map((entry) => ({ routePath: entry.path, lastmod: entry.date })),
		...projectEntries.map((entry) => ({
			routePath: entry.path,
			lastmod: entry.date,
		})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		({ routePath, lastmod }) => `  <url>
    <loc>${escapeXml(buildUrl(routePath))}</loc>${
			lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""
		}
  </url>`,
	)
	.join("\n")}
</urlset>
`;

	await Bun.write(path.join(DIST_DIR, "sitemap.xml"), xml);
}

async function writeRobots() {
	const content = `User-agent: *
Allow: /

Sitemap: ${buildUrl("/sitemap.xml")}
`;

	await Bun.write(path.join(DIST_DIR, "robots.txt"), content);
}

async function writeRss(entries: ContentEntry[]) {
	const feed = new RSS({
		title: `${SITE_NAME}`,
		description: DEFAULT_DESCRIPTION,
		site_url: SITE_URL,
		feed_url: buildUrl("/rss.xml"),
		language: "en",
		pubDate: entries[0]?.date ?? new Date().toISOString(),
	});

	for (const entry of entries) {
		const html = buildFeedHtml(entry);
		feed.item({
			title: entry.title,
			description: html,
			url: buildUrl(entry.path),
			guid: buildUrl(entry.path),
			date: entry.date,
			categories: [entry.kind],
			custom_elements: [{ "content:encoded": { _cdata: html } }],
		});
	}

	await Bun.write(path.join(DIST_DIR, "rss.xml"), feed.xml({ indent: true }));
}

async function main() {
	const vite = await createServer({
		root: ROOT,
		logLevel: "error",
		server: { middlewareMode: true, hmr: false },
		appType: "custom",
	});

	try {
		const blogEntries = await loadEntries(
			vite,
			path.join(ROOT, "src/content/blog"),
			"/blog",
			"blog",
		);
		const projectEntries = await loadEntries(
			vite,
			path.join(ROOT, "src/content/projects"),
			"/projects",
			"project",
		);
		const feedEntries = [...blogEntries, ...projectEntries].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);

		await Promise.all([
			writeSitemap(blogEntries, projectEntries),
			writeRobots(),
			writeRss(feedEntries),
		]);
	} finally {
		await vite.close();
	}
}

await main();
