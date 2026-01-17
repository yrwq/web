import { BlogLayout } from "@/features/blog/components/BlogLayout";

export function BlogIndexPage() {
	return (
		<BlogLayout>
			<div className="h-full flex flex-col">
				<div className="mb-6 border-b border-border border-dashed pb-2">
					<h1 className="text-xl text-accent font-bold">Reading log</h1>
				</div>

				<div className="prose-content grow">
					<p>Pick a post on the left to read the full note.</p>
					<p>New entries land here once they are ready.</p>
				</div>

				<div className="mt-auto pt-8 border-t border-border border-dashed text-right text-xs text-muted">
					Updated whenever a new post ships.
				</div>
			</div>
		</BlogLayout>
	);
}
