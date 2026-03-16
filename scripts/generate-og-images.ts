import { tmpdir } from "node:os";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");
const OG_DIR = path.join(DIST_DIR, "og");
const FONT_PATH = path.join(ROOT, "public", "iosevka.ttf");

const COLORS = {
	background: "#121212",
	panel: "#1e1e1e",
	panelDeeper: "#2a2a2a",
	foreground: "#f0f0f0",
	muted: "#9a9a9a",
	accent: "#c084fc",
	border: "#2a2a2a",
	green: "#4ade80",
	yellow: "#ffd56e",
};

type OgEntry = {
	title: string;
	description: string;
	output: string;
};

async function ensureDir(dir: string) {
	const proc = Bun.spawn(["mkdir", "-p", dir], {
		stdout: "ignore",
		stderr: "pipe",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(stderr || `mkdir exited with code ${exitCode}`);
	}
}

function truncate(text: string, length: number) {
	if (text.length <= length) return text;
	return `${text.slice(0, length - 1).trimEnd()}...`;
}

function escapeHtml(text: string) {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function wrapText(text: string, maxCharsPerLine: number, maxLines: number) {
	const words = text.trim().split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		const nextLine = currentLine ? `${currentLine} ${word}` : word;
		if (nextLine.length <= maxCharsPerLine) {
			currentLine = nextLine;
			continue;
		}

		if (currentLine) {
			lines.push(currentLine);
			if (lines.length === maxLines) break;
			currentLine = word;
			continue;
		}

		lines.push(word.slice(0, maxCharsPerLine));
		if (lines.length === maxLines) break;
		currentLine = word.slice(maxCharsPerLine);
	}

	if (lines.length < maxLines && currentLine) {
		lines.push(currentLine);
	}

	if (lines.length > maxLines) {
		lines.length = maxLines;
	}

	if (
		lines.length === maxLines &&
		words.join(" ").length > lines.join(" ").length
	) {
		lines[maxLines - 1] = truncate(lines[maxLines - 1], maxCharsPerLine);
	}

	return lines.map(escapeHtml);
}

function getTitleLayout(title: string) {
	const compactTitle = title.trim();

	if (compactTitle.length > 28) {
		return {
			fontSize: 58,
			lineHeight: 66,
			maxCharsPerLine: 18,
			maxLines: 4,
			startY: 188,
		};
	}

	if (compactTitle.length > 18) {
		return {
			fontSize: 66,
			lineHeight: 74,
			maxCharsPerLine: 20,
			maxLines: 3,
			startY: 204,
		};
	}

	return {
		fontSize: 74,
		lineHeight: 84,
		maxCharsPerLine: 22,
		maxLines: 3,
		startY: 220,
	};
}

function parseFrontmatter(source: string) {
	const normalized = source.replace(/^\uFEFF/, "");
	const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};

	try {
		return (yaml.load(match[1]) as Record<string, unknown>) ?? {};
	} catch {
		return {};
	}
}

async function readContentEntries(
	dir: string,
	outputPrefix: string,
): Promise<OgEntry[]> {
	const files = await Array.fromAsync(new Bun.Glob("*.mdx").scan(dir));
	const entries: OgEntry[] = [];

	for (const file of files) {
		const source = await Bun.file(path.join(dir, file)).text();
		const data = parseFrontmatter(source);

		if (data.draft) continue;
		if (typeof data.title !== "string") continue;

		entries.push({
			title: data.title,
			description:
				typeof data.description === "string" ? data.description : outputPrefix,
			output: path.join(
				OG_DIR,
				outputPrefix,
				`${file.replace(/\.mdx$/, "")}.png`,
			),
		});
	}

	return entries;
}

async function renderSvg(entry: OgEntry) {
	const titleLayout = getTitleLayout(entry.title);
	const titleLines = wrapText(
		entry.title,
		titleLayout.maxCharsPerLine,
		titleLayout.maxLines,
	);
	const descriptionLines = wrapText(entry.description, 52, 3);
	const descriptionStartY =
		titleLayout.startY + (titleLines.length - 1) * titleLayout.lineHeight + 92;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .frame {
        fill: ${COLORS.panel};
        stroke: ${COLORS.border};
        stroke-width: 3;
      }

      .topline {
        font-size: 20px;
        fill: ${COLORS.muted};
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: "Iosevka", monospace;
      }

      .title {
        font-size: ${titleLayout.fontSize}px;
        font-weight: 400;
        fill: ${COLORS.accent};
        font-family: monospace;
      }

      .description {
        font-size: 28px;
        fill: ${COLORS.foreground};
        font-family: monospace;
      }

      .footer {
        font-size: 18px;
        fill: ${COLORS.muted};
        font-family: monospace;
      }

      .site {
        fill: ${COLORS.yellow};
        font-family: monospace;
        font-size: 18px;
      }
    </style>
    <radialGradient id="glowA" cx="0.15" cy="0.08" r="0.55">
      <stop offset="0%" stop-color="${COLORS.accent}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${COLORS.accent}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowB" cx="0.85" cy="0.92" r="0.45">
      <stop offset="0%" stop-color="${COLORS.green}" stop-opacity="0.14" />
      <stop offset="100%" stop-color="${COLORS.green}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${COLORS.background}" />
  <rect width="1200" height="630" fill="url(#glowA)" />
  <rect width="1200" height="630" fill="url(#glowB)" />

  <rect x="40" y="40" width="1120" height="550" rx="0" class="frame" />
  <rect
    x="56"
    y="56"
    width="1088"
    height="518"
    fill="none"
    stroke="rgba(146, 131, 116, 0.35)"
    stroke-dasharray="6 8"
  />

  <text x="88" y="96" class="topline">yrwq</text>
  <circle cx="1054" cy="88" r="5" fill="${COLORS.accent}" />
  <circle cx="1074" cy="88" r="5" fill="${COLORS.panelDeeper}" />
  <circle cx="1094" cy="88" r="5" fill="${COLORS.panelDeeper}" />

  <text x="120" y="${titleLayout.startY}" class="title">
    ${titleLines
			.map(
				(line, index) =>
					`<tspan x="120" dy="${index === 0 ? 0 : titleLayout.lineHeight}">${line}</tspan>`,
			)
			.join("")}
  </text>
  <text x="120" y="${descriptionStartY}" class="description">
    ${descriptionLines
			.map(
				(line, index) =>
					`<tspan x="120" dy="${index === 0 ? 0 : 42}">${line}</tspan>`,
			)
			.join("")}
  </text>

  <text x="88" y="548" class="site">yrwq.github.io</text>
  <text x="1088" y="548" text-anchor="end" class="footer">yrwq / web</text>
</svg>`;
}

async function writeImage(entry: OgEntry) {
	await ensureDir(path.dirname(entry.output));

	const svg = await renderSvg(entry);
	const tempSvgPath = path.join(
		tmpdir(),
		`og-${path.basename(entry.output, ".png")}-${Date.now()}.svg`,
	);

	await Bun.write(tempSvgPath, svg);

	try {
		const proc = Bun.spawn(
			["magick", "-font", FONT_PATH, tempSvgPath, entry.output],
			{
				stdout: "ignore",
				stderr: "pipe",
			},
		);
		const exitCode = await proc.exited;
		if (exitCode !== 0) {
			const stderr = await new Response(proc.stderr).text();
			throw new Error(stderr || `magick exited with code ${exitCode}`);
		}
	} finally {
		await Bun.file(tempSvgPath).delete();
	}
}

async function main() {
	await ensureDir(OG_DIR);

	const entries: OgEntry[] = [
		{
			title: "yrwq",
			description: "personal website, blog, and project archive for yrwq.",
			output: path.join(OG_DIR, "site.png"),
		},
		{
			title: "me",
			description:
				"about me, the work i do, and the projects i enjoy building.",
			output: path.join(OG_DIR, "me.png"),
		},
		{
			title: "blog",
			description: "technical writing, notes, and opinions.",
			output: path.join(OG_DIR, "blog.png"),
		},
		{
			title: "projects",
			description: "projects, write-ups, and build notes.",
			output: path.join(OG_DIR, "projects.png"),
		},
		...(await readContentEntries(
			path.join(ROOT, "src", "content", "blog"),
			"blog",
		)),
		...(await readContentEntries(
			path.join(ROOT, "src", "content", "projects"),
			"projects",
		)),
	];

	for (const entry of entries) {
		await writeImage(entry);
	}
}

await main();
