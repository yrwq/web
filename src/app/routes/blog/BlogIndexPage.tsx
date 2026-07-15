import { Link } from "react-router-dom";
import { getStaticRouteSeo } from "@/app/route-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { buildCanonicalUrl, SITE_URL } from "@/lib/seo";

export function BlogIndexPage() {
	const posts = getAllPosts();

	return (
		<div className="p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/blog")} />
			<JsonLd
				schema={{
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: SITE_URL,
						},
						{
							"@type": "ListItem",
							position: 2,
							name: "Blog",
							item: buildCanonicalUrl("/blog"),
						},
					],
				}}
			/>

			<div className="border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<span className="text-xs text-muted">
						yrwq@site:~/blog<span className="text-accent">$</span> ls -la
					</span>
				</div>

				<div className="p-4">
					<p className="text-xs text-muted/70 mb-3">
						<span className="text-red/80">disclaimer:</span> everything here is
						my personal opinion.
					</p>

					{posts.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm font-mono">
								<thead>
									<tr className="text-muted/60 border-b border-border/50">
										<th className="text-left py-1 pr-4 font-normal hidden lg:table-cell text-xs">
											permissions
										</th>
										<th className="text-left py-1 pr-4 font-normal">name</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">
											date
										</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">
											tags
										</th>
										<th className="text-right py-1 font-normal hidden md:table-cell">
											reading
										</th>
									</tr>
								</thead>
								<tbody>
									{posts.map((post) => {
										const displayName = `${post.slug.replace(/^\d{4}-\d{2}(?:-\d{2})?-/, "")}.mdx`;
										return (
											<tr
												key={post.slug}
												className="border-b border-border/30 hover:bg-panel/40 group"
											>
												<td className="py-1.5 pr-4 text-muted/40 text-xs hidden lg:table-cell whitespace-nowrap select-none">
													-rw-r--r--
												</td>
												<td className="py-1.5 pr-4">
													<Link
														to={`/blog/${post.slug}`}
														className="text-foreground hover:text-accent"
													>
														{displayName}
													</Link>
												</td>
												<td className="py-1.5 pr-4 text-muted/70 whitespace-nowrap hidden md:table-cell">
													{new Date(post.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})}
												</td>
												<td className="py-1.5 pr-4 text-muted/70 hidden md:table-cell">
													{(post.tags ?? []).slice(0, 3).join(", ")}
												</td>
												<td className="py-1.5 text-right text-muted/70 hidden md:table-cell whitespace-nowrap">
													{post.readingTime ?? "-"}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-sm text-muted">no published posts yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
