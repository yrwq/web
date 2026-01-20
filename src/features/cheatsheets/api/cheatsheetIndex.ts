import type { CheatsheetMeta } from "../types/cheatsheets";

const cheatsheetModules = import.meta.glob("/src/content/cheatsheets/*.mdx");

const labelFromSlug = (value: string) => value.replace(/-/g, " ");

export function getCheatsheetIndex(): CheatsheetMeta[] {
	const cheatsheets: CheatsheetMeta[] = [];

	for (const modulePath of Object.keys(cheatsheetModules)) {
		const parts = modulePath.split("/");
		const fileName = parts[parts.length - 1];

		if (!fileName || !fileName.endsWith(".mdx")) {
			continue;
		}

		const slug = fileName.replace(/\.mdx$/, "");
		cheatsheets.push({
			slug,
			title: labelFromSlug(slug),
		});
	}

	return cheatsheets.sort((a, b) => a.title.localeCompare(b.title));
}
