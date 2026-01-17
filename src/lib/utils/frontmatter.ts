import yaml from "js-yaml";

export interface FrontmatterResult<T = Record<string, any>> {
	data: T;
	content: string;
}

export function parseFrontmatter<T = Record<string, any>>(
	text: string,
): FrontmatterResult<T> {
	if (typeof text !== "string") {
		console.error("parseFrontmatter expected string, got:", typeof text, text);
		return { data: {} as T, content: "" };
	}

	const normalized = text.replace(/^\uFEFF/, "");
	const lines = normalized.split(/\r?\n/);
	if (lines.length === 0 || lines[0].trim() !== "---") {
		return { data: {} as T, content: normalized };
	}

	const endIndex = lines.findIndex(
		(line, idx) => idx > 0 && line.trim() === "---",
	);
	if (endIndex === -1) {
		return { data: {} as T, content: normalized };
	}

	const yamlBlock = lines.slice(1, endIndex).join("\n");
	const content = lines.slice(endIndex + 1).join("\n");

	try {
		const data = (yaml.load(yamlBlock) || {}) as T;
		return { data, content: content.trim() };
	} catch (e) {
		console.error("Failed to parse frontmatter", e);
		return { data: {} as T, content: normalized };
	}
}
