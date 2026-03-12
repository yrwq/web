import { Link, useLocation } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";
import { cn } from "@/lib/utils/cn";
import { useEditorUi } from "./editor-state";

function TreeItem({
	to,
	label,
	depth = 0,
}: {
	to: string;
	label: string;
	depth?: number;
}) {
	const { pathname } = useLocation();
	const isActive = pathname === to;

	return (
		<li>
			<Link
				to={to}
				className={cn(
					"tree-item block rounded px-2 py-1 text-sm leading-tight",
					isActive
						? "text-foreground bg-[#2f3b52]"
						: "text-muted hover:text-foreground hover:bg-panel-deeper",
				)}
				style={{ paddingLeft: `${depth * 14 + 10}px` }}
			>
				{label}
			</Link>
		</li>
	);
}

export function ExplorerTree() {
	const posts = getAllPosts();
	const projects = getAllProjects();
	const { collapsedFolders, toggleFolder } = useEditorUi();

	return (
		<nav className="h-full overflow-y-auto p-2" aria-label="Explorer">
			<div className="mb-2 px-2 text-[11px] uppercase tracking-wide text-muted">
				explorer
			</div>
			<ul className="space-y-0.5">
				<TreeItem to="/" label="me.tsx" />
				<li>
					<button
						type="button"
						onClick={() => toggleFolder("blog")}
						className="tree-folder w-full rounded px-2 py-1 text-left text-sm text-muted hover:text-foreground hover:bg-panel-deeper"
					>
						{collapsedFolders.blog ? "▸" : "▾"} blog
					</button>
				</li>
				{!collapsedFolders.blog && (
					<>
						<TreeItem to="/blog" label="index.mdx" depth={1} />
						{posts.map((post) => (
							<TreeItem
								key={post.slug}
								to={`/blog/${post.slug}`}
								label={`${post.slug}.mdx`}
								depth={1}
							/>
						))}
					</>
				)}

				<li>
					<button
						type="button"
						onClick={() => toggleFolder("projects")}
						className="tree-folder w-full rounded px-2 py-1 text-left text-sm text-muted hover:text-foreground hover:bg-panel-deeper"
					>
						{collapsedFolders.projects ? "▸" : "▾"} projects
					</button>
				</li>
				{!collapsedFolders.projects && (
					<>
						<TreeItem to="/projects" label="index.mdx" depth={1} />
						{projects.map((project) => (
							<TreeItem
								key={project.slug}
								to={`/projects/${project.slug}`}
								label={`${project.slug}.mdx`}
								depth={1}
							/>
						))}
					</>
				)}
			</ul>
		</nav>
	);
}
