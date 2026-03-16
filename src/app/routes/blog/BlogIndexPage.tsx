import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { Link } from "react-router-dom";

export function BlogIndexPage() {
	const posts = getAllPosts();

	return (
		<section className="editor-panel h-full border border-border bg-panel-deeper/20 p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/blog")} />
			<div className="mb-6 border-b border-border border-dashed pb-2">
				<h1 id="blog-index" className="text-xl text-accent font-semibold">
					blog
				</h1>
			</div>

			<div className="prose-content">
				<p>
					<span className="text-red">disclaimer: </span>
					everything here is my personal opinion.
				</p>
			</div>

			<div className="mt-5 grid gap-3">
				{posts.length > 0 ? (
					posts.map((post) => (
						<article key={post.slug} className="border border-border p-3">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h2 className="text-base text-foreground">
									<Link to={`/blog/${post.slug}`}>{post.title}</Link>
								</h2>
								<div className="text-xs text-muted">
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</div>
							</div>

							{post.description && (
								<p className="mt-2 text-sm text-muted">{post.description}</p>
							)}

							<div className="mt-2 flex flex-wrap gap-2">
								{(post.tags ?? []).map((tag) => (
									<span
										key={tag}
										className="text-xs px-2 py-1 border border-border text-accent"
									>
										{tag}
									</span>
								))}
								{post.readingTime && (
									<span className="text-xs px-2 py-1 border border-border text-muted">
										{post.readingTime}
									</span>
								)}
							</div>
						</article>
					))
				) : (
					<p className="text-sm text-muted">no published posts yet.</p>
				)}
			</div>
		</section>
	);
}
