import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import type { BlogPostMeta } from "@/features/blog/types/blog";
import { cn } from "@/lib/utils/cn";

export function BlogList() {
	const { slug } = useParams();
	const [posts, setPosts] = useState<BlogPostMeta[]>([]);
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

	useEffect(() => {
		getAllPosts().then((fetchedPosts) => {
			const sortedPosts = [...fetchedPosts].sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
			);
			setPosts(sortedPosts);
		});
	}, []);

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
		<div className="flex flex-col gap-4">
			<h2 className="text-accent text-xs uppercase tracking-[0.25em]">Posts</h2>
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
									"text-[11px] px-2 py-1 border border-border rounded-xs uppercase tracking-[0.2em] transition",
									isActive ? "text-accent" : "text-foreground",
									isActive ? "bg-panel-deeper" : "bg-transparent",
									"hover:text-accent",
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
					<li key={post.slug} className="flex gap-2 items-baseline text-[13px]">
						<Link
							to={`/blog/${post.slug}`}
							className={cn(
								"hover:text-accent hover:underline underline-offset-4 decoration-dotted truncate block leading-tight",
								slug === post.slug ? "text-accent" : "text-foreground",
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
