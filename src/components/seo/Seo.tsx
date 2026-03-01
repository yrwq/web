import { useEffect } from "react";
import { buildCanonicalUrl, SITE_NAME } from "@/lib/seo";
import type { RouteSeo } from "@/app/route-seo";

function upsertMeta(
	selector: string,
	attributes: Record<string, string>,
	content: string,
) {
	let element = document.head.querySelector<HTMLMetaElement>(selector);
	if (!element) {
		element = document.createElement("meta");
		for (const [key, value] of Object.entries(attributes)) {
			element.setAttribute(key, value);
		}
		document.head.appendChild(element);
	}
	element.setAttribute("content", content);
}

function upsertLink(
	selector: string,
	attributes: Record<string, string>,
	href: string,
) {
	let element = document.head.querySelector<HTMLLinkElement>(selector);
	if (!element) {
		element = document.createElement("link");
		for (const [key, value] of Object.entries(attributes)) {
			element.setAttribute(key, value);
		}
		document.head.appendChild(element);
	}
	element.setAttribute("href", href);
}

export function Seo({
	title,
	description,
	path,
	type,
	image,
	robots = "index,follow",
}: RouteSeo & { robots?: string }) {
	useEffect(() => {
		const canonicalUrl = buildCanonicalUrl(path);

		document.title = title;

		upsertMeta('meta[name="description"]', { name: "description" }, description);
		upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
		upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
		upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
		upsertMeta(
			'meta[property="og:description"]',
			{ property: "og:description" },
			description,
		);
		upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
		upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
		upsertMeta('meta[property="og:image"]', { property: "og:image" }, image);
		upsertMeta(
			'meta[name="twitter:card"]',
			{ name: "twitter:card" },
			"summary_large_image",
		);
		upsertMeta(
			'meta[name="twitter:title"]',
			{ name: "twitter:title" },
			title,
		);
		upsertMeta(
			'meta[name="twitter:description"]',
			{ name: "twitter:description" },
			description,
		);
		upsertMeta(
			'meta[name="twitter:image"]',
			{ name: "twitter:image" },
			image,
		);
		upsertLink("link[rel=\"canonical\"]", { rel: "canonical" }, canonicalUrl);
	}, [description, image, path, robots, title, type]);

	return null;
}
