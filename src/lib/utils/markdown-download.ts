import { posts } from "virtual:blog-content";

export async function downloadBlogPostMarkdown(slug: string): Promise<void> {
	const loadingMessage = document.createElement("div");
	loadingMessage.textContent = "Preparing MD...";
	loadingMessage.style.cssText =
		"position: fixed; top: 20px; right: 20px; background: #1a202c; color: white; padding: 12px 20px; border-radius: 8px; z-index: 1000; font-family: system-ui, -apple-system, sans-serif;";
	document.body.appendChild(loadingMessage);

	try {
		const cleanSlug = slug.replace(/\.mdx$/, "");
		const post = posts.find((entry) => entry.slug === cleanSlug);

		if (!post) {
			throw new Error(`Blog post not found: ${cleanSlug}`);
		}

		const markdownContent = post.content || "";

		const blob = new Blob([markdownContent], {
			type: "text/markdown;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${slug}.md`;
		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} finally {
		if (loadingMessage.parentNode) {
			document.body.removeChild(loadingMessage);
		}
	}
}
