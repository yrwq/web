import type { ComponentType } from "react";

export interface BlogPostMeta {
	slug: string;
	title: string;
	date: string;
	description?: string;
	tags?: string[];
	draft?: boolean;
	readingTime?: string;
	content?: string;
	[key: string]: unknown;
}

export interface BlogPost {
	meta: BlogPostMeta;
	Component: ComponentType<Record<string, never>>;
}
