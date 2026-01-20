import type { ComponentType } from "react";
import type { CheatsheetDoc } from "../types/cheatsheets";

const cheatsheetModules = import.meta.glob("/src/content/cheatsheets/*.mdx");

const labelFromSlug = (value: string) => value.replace(/-/g, " ");

export async function getCheatsheetBySlug(
	slug: string,
): Promise<CheatsheetDoc | null> {
	const cleanSlug = slug.replace(/\.mdx$/, "");
	const modulePath = `/src/content/cheatsheets/${cleanSlug}.mdx`;

	let loader: (() => Promise<unknown>) | undefined =
		cheatsheetModules[modulePath];

	if (!loader) {
		const match = Object.entries(cheatsheetModules).find(([path]) =>
			path.endsWith(`/${cleanSlug}.mdx`),
		);
		loader = match?.[1];
	}

	if (!loader) {
		return null;
	}

	try {
		const mdxModule = (await loader()) as {
			default: ComponentType<Record<string, never>>;
		};

		return {
			meta: {
				slug: cleanSlug,
				title: labelFromSlug(cleanSlug),
			},
			Component: mdxModule.default,
		};
	} catch (_error) {
		return null;
	}
}
