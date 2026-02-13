import { BlogLayout } from "@/features/blog/components/BlogLayout";

export function BlogIndexPage() {
	return (
		<BlogLayout>
			<div className="h-full flex flex-col">
				<div className="mb-6 border-b border-border border-dashed pb-2">
					<h1 className="text-xl text-accent font-bold">blog</h1>
				</div>

				<div className="prose-content grow">
					<p>pick a post on the left to read it.</p>
					<p>
						you can download the whole post in either pdf or markdown format at
						the bottom of each post.
					</p>
					<p>
						<span className="text-red">disclaimer: </span>
						everything here is my personal opinion.
					</p>
				</div>

				<div className="mt-auto pt-8 border-t border-border border-dashed text-right text-xs text-muted">
					Updated whenever a new post ships.
				</div>
			</div>
		</BlogLayout>
	);
}
