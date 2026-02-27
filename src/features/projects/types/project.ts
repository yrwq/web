import type { ComponentType } from "react";

export interface ProjectMeta {
	slug: string;
	title: string;
	date: string;
	description?: string;
	tags?: string[];
	stack: string[];
	status: string;
	draft?: boolean;
	readingTime?: string;
	content?: string;
	[key: string]: unknown;
}

export interface Project {
	meta: ProjectMeta;
	Component: ComponentType<Record<string, never>>;
}
