import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { Seo } from "@/components/seo/Seo";
import { getPostBySlug } from "@/features/blog/api/blogPost";
import { BlogLayout } from "@/features/blog/components/BlogLayout";

export function BlogPostPage() {
	const { slug } = useParams();
	const articleRef = useRef<HTMLElement | null>(null);
	const post = slug ? getPostBySlug(slug) : null;

	useEffect(() => {
		if (articleRef.current) {
			articleRef.current.scrollTop = 0;
		}
	}, [slug]);

	useEffect(() => {
		const html = document.documentElement;
		const body = document.body;
		const root = document.getElementById("root");
		const media = window.matchMedia("(min-width: 768px)");

		const prevHtmlOverflow = html.style.overflow;
		const prevBodyOverflow = body.style.overflow;
		const prevRootOverflow = root?.style.overflow ?? "";

		const applyLock = () => {
			const shouldLock = media.matches;
			html.style.overflow = shouldLock ? "hidden" : prevHtmlOverflow;
			body.style.overflow = shouldLock ? "hidden" : prevBodyOverflow;
			if (root) {
				root.style.overflow = shouldLock ? "hidden" : prevRootOverflow;
			}
		};

		applyLock();
		media.addEventListener("change", applyLock);

		return () => {
			media.removeEventListener("change", applyLock);
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

	if (!post) return <NotFoundPage />;

	const { Component, meta } = post;

	return (
		<BlogLayout
			className="md:h-[calc(100vh-(var(--page-padding)*2))] md:overflow-hidden md:pb-10"
			contentClassName="md:h-full md:min-h-0 md:flex md:flex-col"
		>
			<Seo
				title={meta.title}
				description={meta.description}
				path={`/blog/${meta.slug}`}
				type="article"
				image={`/og/blog/${meta.slug}.png`}
			/>
			<article
				ref={articleRef}
				className="blog-post-scroll-container md:flex-1 md:min-h-0 md:overflow-y-auto pr-0 md:pr-4"
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

			</article>
		</BlogLayout>
	);
}
