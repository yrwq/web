import type { ReactNode } from "react";
import { BlogLayout } from "@/features/blog/components/BlogLayout";
import { ProjectList } from "./ProjectList";

export function ProjectsLayout({ children }: { children: ReactNode }) {
	return (
		<BlogLayout
			asideContent={<ProjectList />}
			storageKey="projects-list-width"
			className="md:h-[calc(100vh-(var(--page-padding)*2))] md:overflow-hidden md:pb-10"
			contentClassName="md:h-full md:min-h-0 md:flex md:flex-col"
		>
			{children}
		</BlogLayout>
	);
}
