import { ProjectsLayout } from "@/features/projects/components/ProjectsLayout";
export function ProjectsPage() {
	return (
		<ProjectsLayout>
			<div className="h-full flex flex-col">
				<div className="mb-6 border-b border-border border-dashed pb-2">
					<h1 className="text-xl text-accent font-bold">projects</h1>
				</div>

				<div className="prose-content">
					<p className="text-muted">pick a project from the sidebar.</p>
				</div>

				<div className="mt-auto pt-8 border-t border-border border-dashed text-right text-xs text-muted">
					updated whenever a project changes.
				</div>
			</div>
		</ProjectsLayout>
	);
}
