import type { ComponentType } from "react";

export interface CheatsheetMeta {
	slug: string;
	title: string;
}

export interface CheatsheetDoc {
	meta: CheatsheetMeta;
	Component: ComponentType<Record<string, never>>;
}
