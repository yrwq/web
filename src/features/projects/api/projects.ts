import { projects } from "virtual:projects-content";
import type { Project, ProjectMeta } from "../types/project";

const projectModules = import.meta.glob("/src/content/projects/*.mdx", {
	eager: true,
});

export function getAllProjects(): ProjectMeta[] {
	return projects
		.filter((project: ProjectMeta) => import.meta.env.DEV || !project.draft)
		.sort(
			(a: ProjectMeta, b: ProjectMeta) =>
				new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
}

export function getProjectBySlug(slug: string): Project | null {
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
		const mdxModule = projectModules[modulePath] as
			| { default: React.ComponentType<Record<string, never>> }
			| undefined;
		if (!mdxModule) {
			return null;
		}

		return {
			meta,
			Component: mdxModule.default,
		};
	} catch (_e) {
		return null;
	}
}
