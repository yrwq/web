import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { getPostBySlug } from "@/features/blog/api/blogPost";
import { BlogLayout } from "@/features/blog/components/BlogLayout";
import type { BlogPost } from "@/features/blog/types/blog";
import { downloadBlogPostMarkdown } from "@/lib/utils/markdown-download";

export function BlogPostPage() {
	const { slug } = useParams();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [loading, setLoading] = useState(true);
	const articleRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (slug) {
			getPostBySlug(slug).then((fetchedPost) => {
				setPost(fetchedPost);
				setLoading(false);
			});
		}
		if (articleRef.current) {
			articleRef.current.scrollTop = 0;
		}
	}, [slug]);

	useEffect(() => {
		const html = document.documentElement;
		const body = document.body;
		const root = document.getElementById("root");

		const prevHtmlOverflow = html.style.overflow;
		const prevBodyOverflow = body.style.overflow;
		const prevRootOverflow = root?.style.overflow ?? "";

		html.style.overflow = "hidden";
		body.style.overflow = "hidden";
		if (root) root.style.overflow = "hidden";

		return () => {
			html.style.overflow = prevHtmlOverflow;
			body.style.overflow = prevBodyOverflow;
			if (root) root.style.overflow = prevRootOverflow;
		};
	}, []);

	useEffect(() => {
		if (!post) return;
		const figures = document.querySelectorAll(
			"figure[data-rehype-pretty-code-figure]",
		);

		for (const figure of figures) {
			if (figure.querySelector(".code-copy")) continue;
			const code = figure.querySelector("code");
			if (!code) continue;

			const button = document.createElement("button");
			button.type = "button";
			button.className = "code-copy";
			button.textContent = "copy";

			button.addEventListener("click", async () => {
				const text = code.textContent ?? "";
				try {
					await navigator.clipboard.writeText(text);
					button.textContent = "copied";
				} catch {
					button.textContent = "failed";
				}
				setTimeout(() => {
					button.textContent = "copy";
				}, 1200);
			});

			figure.appendChild(button);
		}
	}, [post]);

	if (loading) return <div>Loading...</div>;
	if (!post) return <NotFoundPage />;

	const { Component, meta } = post;

	const handleMarkdownDownload = async () => {
		await downloadBlogPostMarkdown(meta.slug);
	};

	return (
		<BlogLayout className="h-[calc(100vh-40px)] overflow-hidden">
			<article
				ref={articleRef}
				className="h-full min-h-0 flex flex-col overflow-y-auto overscroll-contain pr-4"
			>
				<div className="mb-6 border-b border-border border-dashed pb-4">
					<h1 className="text-xl text-accent font-bold mb-3">{meta.title}</h1>

					<div className="flex flex-wrap gap-4 text-sm text-secondary">
						{meta.date && (
							<div>
								<span className="text-accent">date:</span>{" "}
								{new Date(meta.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</div>
						)}

						{meta.readingTime && (
							<div>
								<span className="text-accent">reading time:</span>{" "}
								{meta.readingTime}
							</div>
						)}
					</div>

					{meta.description && (
						<p className="mt-3 text-secondary italic">{meta.description}</p>
					)}

					{meta.tags && meta.tags.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{meta.tags.map((tag: string) => (
								<span
									key={tag}
									className="text-xs px-2 py-1 border border-border text-accent"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="prose-content blog-post-scroll">
					<Component />
				</div>

				<div className="mt-6 pt-8 border-t border-border border-dashed text-right">
					<a
						href={`/pdf/${meta.slug}.pdf`}
						download
						className="text-accent hover:underline text-sm cursor-pointer mr-4"
					>
						pdf
					</a>
					<button
						type="button"
						onClick={handleMarkdownDownload}
						className="text-accent hover:underline text-sm cursor-pointer"
					>
						md
					</button>
				</div>
			</article>
		</BlogLayout>
	);
}
