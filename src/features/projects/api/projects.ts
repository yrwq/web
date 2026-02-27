import { projects } from "virtual:projects-content";
import type { Project, ProjectMeta } from "../types/project";

const projectModules = import.meta.glob("/src/content/projects/*.mdx");

export async function getAllProjects(): Promise<ProjectMeta[]> {
	return projects
		.filter((project: ProjectMeta) => import.meta.env.DEV || !project.draft)
		.sort(
			(a: ProjectMeta, b: ProjectMeta) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
	const cleanSlug = slug.replace(/\.mdx$/, "");
	const meta = projects.find((project) => project.slug === cleanSlug);
	if (!meta) {
		return null;
	}
	if (meta.draft && !import.meta.env.DEV) {
		return null;
	}

	try {
		const modulePath = `/src/content/projects/${cleanSlug}.mdx`;
		let loader: (() => Promise<unknown>) | undefined = projectModules[modulePath];
		if (!loader) {
			const match = Object.entries(projectModules).find(([path]) =>
				path.endsWith(`${cleanSlug}.mdx`),
			);
			loader = match?.[1];
		}
		if (!loader) {
			return null;
		}
		const mdxModule = (await loader()) as {
			default: React.ComponentType<Record<string, never>>;
		};

		return {
			meta,
			Component: mdxModule.default,
		};
	} catch (_e) {
		return null;
	}
}
