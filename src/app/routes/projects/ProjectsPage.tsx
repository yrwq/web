import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";
import { getAllProjects } from "@/features/projects/api/projects";
import { Link } from "react-router-dom";

export function ProjectsPage() {
	const projects = getAllProjects();

	return (
		<div className="p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/projects")} />

			<div className="border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-yellow/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-green/80" />
					</div>
					<span className="text-xs text-muted ml-2">
						yrwq@site:~/projects<span className="text-accent">$</span> ls -la
					</span>
				</div>

				<div className="p-4">
					{projects.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm font-mono">
								<thead>
									<tr className="text-muted/60 border-b border-border/50">
										<th className="text-left py-1 pr-4 font-normal hidden lg:table-cell text-xs">permissions</th>
										<th className="text-left py-1 pr-4 font-normal">name</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">status</th>
										<th className="text-left py-1 pr-4 font-normal hidden md:table-cell">stack</th>
										<th className="text-left py-1 font-normal hidden md:table-cell">tags</th>
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
											<td className="py-1.5 pr-4 text-muted/70 hidden md:table-cell">
												{project.status ?? "-"}
											</td>
											<td className="py-1.5 pr-4 text-muted/70 hidden md:table-cell">
												{(project.stack ?? []).slice(0, 3).join(", ")}
											</td>
											<td className="py-1.5 text-muted/70 hidden md:table-cell">
												{(project.tags ?? []).slice(0, 3).join(", ")}
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
