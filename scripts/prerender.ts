import path from "node:path";
import { createServer } from "vite";
import { buildCanonicalUrl, SITE_NAME } from "../src/lib/seo";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

type Head = {
	title: string;
	description: string;
	path: string;
	type: "website" | "article";
	image: string;
};

async function ensureDir(dir: string) {
	const proc = Bun.spawn(["mkdir", "-p", dir], {
		stdout: "ignore",
		stderr: "pipe",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(stderr || `mkdir exited with ${exitCode}`);
	}
}

function buildHeadTags(head: Head) {
	const canonical = buildCanonicalUrl(head.path);

	return [
		`<title>${head.title}</title>`,
		`<meta name="description" content="${head.description}" />`,
		`<meta name="robots" content="index,follow" />`,
		`<link rel="canonical" href="${canonical}" />`,
		`<meta property="og:site_name" content="${SITE_NAME}" />`,
		`<meta property="og:title" content="${head.title}" />`,
		`<meta property="og:description" content="${head.description}" />`,
		`<meta property="og:type" content="${head.type}" />`,
		`<meta property="og:url" content="${canonical}" />`,
		`<meta property="og:image" content="${head.image}" />`,
		`<meta name="twitter:card" content="summary_large_image" />`,
		`<meta name="twitter:title" content="${head.title}" />`,
		`<meta name="twitter:description" content="${head.description}" />`,
		`<meta name="twitter:image" content="${head.image}" />`,
	].join("\n    ");
}

function applyTemplate(template: string, appHtml: string, head: Head) {
	// :D
	const managedPatterns = [
		/<title>[\s\S]*?<\/title>/,
		/<meta\s+name="description"[\s\S]*?\/>\s*/g,
		/<meta\s+name="robots"[\s\S]*?\/>\s*/g,
		/<link\s+rel="canonical"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:site_name"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:title"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:description"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:type"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:url"[\s\S]*?\/>\s*/g,
		/<meta\s+property="og:image"[\s\S]*?\/>\s*/g,
		/<meta\s+name="twitter:card"[\s\S]*?\/>\s*/g,
		/<meta\s+name="twitter:title"[\s\S]*?\/>\s*/g,
		/<meta\s+name="twitter:description"[\s\S]*?\/>\s*/g,
		/<meta\s+name="twitter:image"[\s\S]*?\/>\s*/g,
	];

	const cleaned = managedPatterns.reduce(
		(html, pattern) => html.replace(pattern, ""),
		template,
	);

	return cleaned
		.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
		.replace("</head>", `    ${buildHeadTags(head)}\n  </head>`);
}

function getOutputPath(routePath: string) {
	const relative = routePath.replace(/^\//, "");
	return path.join(DIST_DIR, relative, "index.html");
}

async function main() {
	const vite = await createServer({
		root: ROOT,
		logLevel: "error",
		server: { middlewareMode: true, hmr: false },
		appType: "custom",
	});

	try {
		const template = await Bun.file(TEMPLATE_PATH).text();
		const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
		const paths = mod.getPrerenderPaths() as string[];

		for (const routePath of paths) {
			const appHtml = mod.render(routePath) as string;
			const head = mod.getPrerenderHead(routePath) as Head;
			const html = applyTemplate(template, appHtml, head);
			const outputPath = getOutputPath(routePath);
			await ensureDir(path.dirname(outputPath));
			await Bun.write(outputPath, html);
		}
	} finally {
		await vite.close();
	}
}

await main();
