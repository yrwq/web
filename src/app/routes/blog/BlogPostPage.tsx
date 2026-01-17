import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "@/features/blog/api/blogPost";
import { BlogLayout } from "@/features/blog/components/BlogLayout";
import type { BlogPost } from "@/features/blog/types/blog";

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
	if (!post) return <div>Post not found</div>;

	const { Component, meta } = post;

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
						<p className="mt-3 text-[var(--text-secondary)] italic">
							{meta.description}
						</p>
					)}

					{meta.tags && meta.tags.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{meta.tags.map((tag: string) => (
								<span
									key={tag}
									className="text-xs px-2 py-1 border border-[var(--border)] text-accent"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="prose-content flex-grow">
					<Component />
				</div>

				<div className="mt-auto pt-8 border-t border-[var(--border)] border-dashed text-right">
					<Link to="#" className="text-accent hover:underline text-sm">
						pdf
					</Link>
				</div>
			</article>
		</BlogLayout>
	);
}
