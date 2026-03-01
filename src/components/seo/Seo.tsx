import { useEffect } from "react";
import {
	buildCanonicalUrl,
	buildOgImageUrl,
	buildTitle,
	DEFAULT_DESCRIPTION,
	SITE_NAME,
} from "@/lib/seo";

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
	description = DEFAULT_DESCRIPTION,
	path = "/",
	type = "website",
	image,
	robots = "index,follow",
}: {
	title?: string;
	description?: string;
	path?: string;
	type?: "website" | "article";
	image?: string;
	robots?: string;
}) {
	useEffect(() => {
		const fullTitle = buildTitle(title);
		const canonicalUrl = buildCanonicalUrl(path);
		const ogImageUrl = buildOgImageUrl(image);

		document.title = fullTitle;

		upsertMeta('meta[name="description"]', { name: "description" }, description);
		upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
		upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
		upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
		upsertMeta(
			'meta[property="og:description"]',
			{ property: "og:description" },
			description,
		);
		upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
		upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
		upsertMeta('meta[property="og:image"]', { property: "og:image" }, ogImageUrl);
		upsertMeta(
			'meta[name="twitter:card"]',
			{ name: "twitter:card" },
			"summary_large_image",
		);
		upsertMeta(
			'meta[name="twitter:title"]',
			{ name: "twitter:title" },
			fullTitle,
		);
		upsertMeta(
			'meta[name="twitter:description"]',
			{ name: "twitter:description" },
			description,
		);
		upsertMeta(
			'meta[name="twitter:image"]',
			{ name: "twitter:image" },
			ogImageUrl,
		);
		upsertLink('link[rel="canonical"]', { rel: "canonical" }, canonicalUrl);
	}, [description, image, path, robots, title, type]);

	return null;
}
