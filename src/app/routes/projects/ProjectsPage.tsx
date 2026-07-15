import { Link } from "react-router-dom";
import { getStaticRouteSeo } from "@/app/route-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { getAllProjects } from "@/features/projects/api/projects";
import { buildCanonicalUrl, SITE_URL } from "@/lib/seo";

export function ProjectsPage() {
	const projects = getAllProjects();

	return (
		<div className="p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/projects")} />
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
					],
				}}
			/>

			<div className="border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<span className="text-xs text-muted">
						yrwq@site:~/projects<span className="text-accent">$</span> ls -la
					</span>
				</div>

				<div className="p-4">
					{projects.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm font-mono">
								<thead>
									<tr className="text-muted/60 border-b border-border/50">
										<th className="text-left py-1 pr-4 font-normal hidden lg:table-cell text-xs">
											permissions
										</th>
										<th className="text-left py-1 pr-4 font-normal">name</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">
											description
										</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">
											stack
										</th>
									</tr>
								</thead>
								<tbody>
									{projects.map((project) => (
										<tr
											key={project.slug}
											className="border-b border-border/30 hover:bg-panel/40 group"
										>
											<td className="py-1.5 pr-4 text-muted/40 text-xs hidden lg:table-cell whitespace-nowrap select-none">
												-rw-r--r--
											</td>
											<td className="py-1.5 pr-4">
												<Link
													to={`/projects/${project.slug}`}
													className="text-foreground hover:text-accent"
												>
													{project.slug}.mdx
												</Link>
											</td>
											<td className="py-1.5 pr-4 text-muted/70 text-xs hidden md:table-cell max-w-xs truncate">
												{project.description ?? "-"}
											</td>
											<td className="py-1.5 pr-4 text-muted/70 hidden md:table-cell">
												{(project.stack ?? []).slice(0, 3).join(", ")}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-sm text-muted">no published projects yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
