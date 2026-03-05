import { renderToString } from "react-dom/server";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { getDynamicRouteSeo, getStaticRouteSeo } from "@/app/route-seo";
import { routes } from "@/app/routes";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";

export function getPrerenderPaths() {
	return [
		"/",
		"/blog",
		"/projects",
		...getAllPosts().map((post) => `/blog/${post.slug}`),
		...getAllProjects().map((project) => `/projects/${project.slug}`),
	];
}

export function getPrerenderHead(url: string) {
	if (url === "/" || url === "/me" || url === "/blog" || url === "/projects") {
		return getStaticRouteSeo(url);
	}

	return getDynamicRouteSeo(url);
}

export function render(url: string) {
	const router = createMemoryRouter(routes, {
		initialEntries: [url],
	});

	return renderToString(<RouterProvider router={router} />);
}
