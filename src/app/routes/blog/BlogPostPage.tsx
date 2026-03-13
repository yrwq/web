import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDynamicRouteSeo } from "@/app/route-seo";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { Seo } from "@/components/seo/Seo";
import { getPostBySlug } from "@/features/blog/api/blogPost";

export function BlogPostPage() {
	const { slug } = useParams();
	const articleRef = useRef<HTMLElement | null>(null);
	const post = slug ? getPostBySlug(slug) : null;

	useEffect(() => {
		if (slug && articleRef.current) {
			articleRef.current.scrollTop = 0;
		}
	}, [slug]);

	useEffect(() => {
		if (!post) return;
		const figures = document.querySelectorAll(
			"figure[data-rehype-pretty-code-figure]",
		);

		for (const figure of figures) {
			const code = figure.querySelector("code");
			const pre = figure.querySelector("pre");
			if (!code || !pre) continue;

			const existingButton =
				figure.querySelector<HTMLButtonElement>(".code-copy");
			if (existingButton) {
				if (existingButton.parentElement !== figure) {
					figure.appendChild(existingButton);
				}
				continue;
			}

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
		<article
			ref={articleRef}
			className="editor-panel h-full overflow-y-auto border border-border bg-panel-deeper/20 p-4 pr-0 md:p-6 md:pr-4"
		>
			<Seo {...getDynamicRouteSeo(`/blog/${meta.slug}`)} />
			<div className="mb-6 border-b border-border border-dashed pb-4">
				<h1 id="post-title" className="mb-3 text-xl text-accent font-bold">
					{meta.title}
				</h1>

				<div className="flex flex-wrap gap-4 text-sm text-muted">
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
					<p className="mt-3 text-muted italic">{meta.description}</p>
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
	);
}
