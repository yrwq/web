import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";
import { getAllProjects } from "@/features/projects/api/projects";
import { Link } from "react-router-dom";

export function ProjectsPage() {
	const projects = getAllProjects();

	return (
		<section className="editor-panel h-full border border-border bg-panel-deeper/20 p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/projects")} />
			<div className="mb-6 border-b border-border border-dashed pb-2">
				<h1 id="projects-index" className="text-xl text-accent font-semibold">
					projects
				</h1>
			</div>

			<div className="mt-5 grid gap-3">
				{projects.length > 0 ? (
					projects.map((project) => (
						<article key={project.slug} className="border border-border p-3">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h2 className="text-base text-foreground">
									<Link to={`/projects/${project.slug}`}>{project.title}</Link>
								</h2>
								{project.status && (
									<span className="text-xs px-2 py-1 border border-border text-accent">
										{project.status}
									</span>
								)}
							</div>

							{project.description && (
								<p className="mt-2 text-sm text-muted">{project.description}</p>
							)}

							<div className="mt-2 flex flex-wrap gap-2">
								{(project.stack ?? []).map((item) => (
									<span
										key={item}
										className="text-xs px-2 py-1 border border-border text-foreground"
									>
										{item}
									</span>
								))}
								{(project.tags ?? []).map((tag) => (
									<span
										key={tag}
										className="text-xs px-2 py-1 border border-border text-accent"
									>
										{tag}
									</span>
								))}
							</div>
						</article>
					))
				) : (
					<p className="text-sm text-muted">no published projects yet.</p>
				)}
			</div>
		</section>
	);
}
