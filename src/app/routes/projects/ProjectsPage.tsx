import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";

export function ProjectsPage() {
	return (
		<section className="editor-panel h-full border border-border bg-panel-deeper/20 p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/projects")} />
			<div className="mb-6 border-b border-border border-dashed pb-2">
				<h1 id="projects-index" className="text-xl text-accent font-semibold">
					projects
				</h1>
			</div>

			<div className="prose-content">
				<p className="text-muted">pick a project from the explorer.</p>
			</div>
		</section>
	);
}
