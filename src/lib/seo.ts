const SITE_NAME = "yrwq";
const SITE_URL = "https://yrwq.github.io";
const DEFAULT_DESCRIPTION =
	"Personal website, blog, and project archive for yrwq.";
const DEFAULT_OG_IMAGE = "/og/site.png";

export function buildTitle(title?: string) {
	if (!title) return SITE_NAME;
	return `${SITE_NAME} | ${title}`;
}

export function buildCanonicalUrl(path = "/") {
	return new URL(path, SITE_URL).toString();
}

export function buildOgImageUrl(path = DEFAULT_OG_IMAGE) {
	return new URL(path, SITE_URL).toString();
}

export { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL };
