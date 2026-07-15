import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDynamicRouteSeo } from "@/app/route-seo";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { Seo } from "@/components/seo/Seo";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug } from "@/features/blog/api/blogPost";

export function BlogPostPage() {
	const { slug } = useParams();
	const post = slug ? getPostBySlug(slug) : null;

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
		<div className="h-full overflow-y-auto">
			<div className="p-4 md:p-6">
				<Seo {...getDynamicRouteSeo(`/blog/${meta.slug}`)} />

				<div className="border border-border overflow-hidden">
					<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
						<span className="text-xs text-muted">
							yrwq@site:~/blog<span className="text-accent">$</span> cat{" "}
							{meta.slug}.mdx
						</span>
					</div>

					<div className="p-4 md:p-6">
						<h1 id="post-title" className="text-xl text-accent font-bold mb-4">
							{meta.title}
						</h1>

						<div className="flex flex-wrap gap-3 mb-4 text-sm text-muted">
							{meta.date && (
								<span>
									<span className="text-accent">date:</span>{" "}
									{new Date(meta.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</span>
							)}
							{meta.readingTime && (
								<span>
									<span className="text-accent">reading:</span>{" "}
									{meta.readingTime}
								</span>
							)}
						</div>

						{meta.description && (
							<p className="text-muted italic mb-4 text-sm">
								{meta.description}
							</p>
						)}

						{meta.tags && meta.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-4">
								{meta.tags.map((tag: string) => (
									<Badge key={tag} variant="default">
										{tag}
									</Badge>
								))}
							</div>
						)}

						<hr className="border-border border-dashed mb-6" />

						<div className="prose-content">
							<Component />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
