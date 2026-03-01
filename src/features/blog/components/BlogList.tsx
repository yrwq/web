import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import type { BlogPostMeta } from "@/features/blog/types/blog";
import { cn } from "@/lib/utils/cn";

export function BlogList({ className }: { className?: string }) {
	const { slug } = useParams();
	const [posts] = useState<BlogPostMeta[]>(() => getAllPosts());
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

	const availableTags = useMemo(() => {
		const tagSet = new Set<string>();
		for (const post of posts) {
			for (const tag of post.tags ?? []) {
				tagSet.add(tag);
			}
		}
		return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
	}, [posts]);

	const filteredPosts = useMemo(() => {
		if (selectedTags.size === 0) return posts;
		return posts.filter((post) =>
			(post.tags ?? []).some((tag) => selectedTags.has(tag)),
		);
	}, [posts, selectedTags]);

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => {
			const next = new Set(prev);
			if (next.has(tag)) {
				next.delete(tag);
			} else {
				next.add(tag);
			}
			return next;
		});
	};

	return (
		<div className={cn("flex flex-col gap-4 w-full md:w-max max-w-full", className)}>
			{availableTags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{availableTags.map((tag) => {
						const isActive = selectedTags.has(tag);
						return (
							<button
								key={tag}
								type="button"
								onClick={() => toggleTag(tag)}
								className={cn(
									"transition",
									isActive ? "text-accent" : "text-muted",
									"hover:text-accent hover:cursor-pointer",
								)}
								aria-pressed={isActive}
							>
								{tag}
							</button>
						);
					})}
				</div>
			)}
			<ul className="flex flex-col gap-1 list-none">
				{filteredPosts.map((post) => (
					<li key={post.slug} className="flex gap-4 items-baseline text-md">
						<Link
							to={`/blog/${post.slug}`}
							className={cn(
								"hover:text-accent underline-offset-4 my-0.5 decoration-dotted truncate block leading-tight",
								slug === post.slug ? "text-accent" : "text-accent-dark",
							)}
						>
							{post.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
