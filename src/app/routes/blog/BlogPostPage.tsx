import { useEffect, useState } from "react";
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

	useEffect(() => {
		if (slug) {
			getPostBySlug(slug).then((fetchedPost) => {
				setPost(fetchedPost);
				setLoading(false);
			});
		}
	}, [slug]);

	if (loading) return <div>Loading...</div>;
	if (!post) return <NotFoundPage />;

	const { Component, meta } = post;

	const handleMarkdownDownload = async () => {
		await downloadBlogPostMarkdown(meta.slug);
	};

	return (
		<BlogLayout>
			<article className="h-full flex flex-col">
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

				<div className="prose-content grow">
					<Component />
				</div>

				<div className="mt-auto pt-8 border-t border-border border-dashed text-right">
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
