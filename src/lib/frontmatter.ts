import yaml from "js-yaml";

export function parseFrontmatter(source: string) {
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
