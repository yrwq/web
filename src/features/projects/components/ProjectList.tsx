import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllProjects } from "@/features/projects/api/projects";
import type { ProjectMeta } from "@/features/projects/types/project";
import { cn } from "@/lib/utils/cn";

export function ProjectList() {
	const { slug } = useParams();
	const [projects] = useState<ProjectMeta[]>(() => getAllProjects());

	return (
		<ul className="flex flex-col gap-2 w-full md:w-[28rem] max-w-full list-none">
			{projects.map((project) => {
				const isActive = slug === project.slug;
				return (
					<li key={project.slug}>
						<Link
							to={`/projects/${project.slug}`}
							className={cn(
								"block border px-3 py-2 transition-colors",
								isActive
									? "border-accent text-accent bg-panel-deeper/60"
									: "border-border text-accent-dark hover:text-accent hover:border-accent/70",
							)}
						>
							<p className="text-sm leading-tight">{project.title}</p>
							<p className="mt-1 text-xs text-muted leading-tight">
								{project.description}
							</p>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
