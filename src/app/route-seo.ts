import { getPostBySlug } from "@/features/blog/api/blogPost";
import { getProjectBySlug } from "@/features/projects/api/projects";
import { buildOgImageUrl, buildTitle, DEFAULT_DESCRIPTION } from "@/lib/seo";

export type RouteSeo = {
	title: string;
	description: string;
	path: string;
	type: "website" | "article";
	image: string;
};

export function getStaticRouteSeo(path: "/" | "/me" | "/blog" | "/projects"): RouteSeo {
	switch (path) {
		case "/":
			return {
				title: buildTitle(),
				description: "about me, the work i do, and the projects i enjoy building.",
				path,
				type: "website",
				image: buildOgImageUrl("/og/me.png"),
			};
		case "/me":
			return {
				title: buildTitle("me"),
				description: "about me, the work i do, and the projects i enjoy building.",
				path,
				type: "website",
				image: buildOgImageUrl("/og/me.png"),
			};
		case "/blog":
			return {
				title: buildTitle("blog"),
				description: "technical writing, notes, and opinions.",
				path,
				type: "website",
				image: buildOgImageUrl("/og/blog.png"),
			};
		case "/projects":
			return {
				title: buildTitle("projects"),
				description: "projects, write-ups, and build notes.",
				path,
				type: "website",
				image: buildOgImageUrl("/og/projects.png"),
			};
	}
}

export function getDynamicRouteSeo(url: string): RouteSeo {
	if (url.startsWith("/blog/")) {
		const slug = url.slice("/blog/".length);
		const post = getPostBySlug(slug);
		if (post) {
			return {
				title: buildTitle(post.meta.title),
				description: post.meta.description || DEFAULT_DESCRIPTION,
				path: url,
				type: "article",
				image: buildOgImageUrl(`/og/blog/${post.meta.slug}.png`),
			};
		}
	}

	if (url.startsWith("/projects/")) {
		const slug = url.slice("/projects/".length);
		const project = getProjectBySlug(slug);
		if (project) {
			return {
				title: buildTitle(project.meta.title),
				description: project.meta.description || DEFAULT_DESCRIPTION,
				path: url,
				type: "website",
				image: buildOgImageUrl(`/og/projects/${project.meta.slug}.png`),
			};
		}
	}

	return {
		title: buildTitle(),
		description: DEFAULT_DESCRIPTION,
		path: url,
		type: "website",
		image: buildOgImageUrl(),
	};
}
