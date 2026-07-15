import { useParams } from "react-router-dom";
import { getDynamicRouteSeo } from "@/app/route-seo";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug } from "@/features/projects/api/projects";
import { buildCanonicalUrl, SITE_URL } from "@/lib/seo";

export function ProjectDetailPage() {
	const { slug } = useParams();
	const project = slug ? getProjectBySlug(slug) : null;

	if (!project) return <NotFoundPage />;

	const { Component, meta } = project;

	return (
		<div className="h-full overflow-y-auto">
			<div className="p-4 md:p-6">
				<Seo {...getDynamicRouteSeo(`/projects/${meta.slug}`)} />
				<JsonLd
					schema={{
						"@context": "https://schema.org",
						"@type": "Article",
						headline: meta.title,
						description: meta.description,
						datePublished: meta.date,
						author: {
							"@type": "Person",
							name: "yrwq",
							url: SITE_URL,
						},
						url: buildCanonicalUrl(`/projects/${meta.slug}`),
					}}
				/>
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
								name: "Projects",
								item: buildCanonicalUrl("/projects"),
							},
							{
								"@type": "ListItem",
								position: 3,
								name: meta.title,
							},
						],
					}}
				/>

				<div className="border border-border overflow-hidden">
					<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
						<span className="text-xs text-muted">
							yrwq@site:~/projects<span className="text-accent">$</span> cat{" "}
							{meta.slug}.mdx
						</span>
					</div>

					<div className="p-4 md:p-6">
						<h1
							id="project-title"
							className="text-xl text-accent font-bold mb-4"
						>
							{meta.title}
						</h1>

						{meta.description && (
							<p className="text-muted italic mb-4 text-sm">
								{meta.description}
							</p>
						)}

						<div className="flex flex-wrap gap-2 mb-4">
							{meta.status && <Badge variant="default">{meta.status}</Badge>}
							{(meta.stack ?? []).map((item: string) => (
								<Badge key={item} variant="outline">
									{item}
								</Badge>
							))}
						</div>

						{meta.tags && meta.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-4 text-sm text-muted">
								{meta.tags.map((tag: string) => (
									<span key={tag} className="text-accent">
										#{tag}
									</span>
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
