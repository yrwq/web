import { useParams } from "react-router-dom";
import { getDynamicRouteSeo } from "@/app/route-seo";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { Seo } from "@/components/seo/Seo";
import { getProjectBySlug } from "@/features/projects/api/projects";

export function ProjectDetailPage() {
	const { slug } = useParams();
	const project = slug ? getProjectBySlug(slug) : null;

	if (!project) return <NotFoundPage />;

	const { Component, meta } = project;

	return (
		<article className="editor-panel h-full overflow-y-auto border border-border bg-panel-deeper/20 p-4 pr-0 md:p-6 md:pr-4">
			<Seo {...getDynamicRouteSeo(`/projects/${meta.slug}`)} />
			<div className="mb-6 border-b border-border border-dashed pb-4">
				<h1 id="project-title" className="text-xl text-accent font-bold mb-3">
					{meta.title}
				</h1>
				{meta.description && (
					<p className="text-muted italic">{meta.description}</p>
				)}

				<div className="mt-3 flex flex-wrap gap-2">
					{meta.status && (
						<span className="text-xs px-2 py-1 border border-border text-accent">
							{meta.status}
						</span>
					)}
					{(meta.stack ?? []).map((item) => (
						<span
							key={item}
							className="text-xs px-2 py-1 border border-border text-foreground"
						>
							{item}
						</span>
					))}
				</div>

				{(meta.tags ?? []).length > 0 && (
					<div className="mt-4 flex flex-wrap gap-4 text-sm">
						{meta.tags?.map((tag) => (
							<span key={tag} className="text-accent">
								{tag}
							</span>
						))}
					</div>
				)}
			</div>

			<div className="prose-content">
				<Component />
			</div>
		</article>
	);
}
