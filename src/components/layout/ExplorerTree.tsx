import {
	IconChevronDown,
	IconChevronRight,
	IconFileCode,
	IconFileText,
	IconFolder,
	IconFolderOpen,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";
import { cn } from "@/lib/utils/cn";
import { useEditorUi } from "./editor-state";

function formatBlogLabel(slug: string) {
	const slugWithoutDate = slug.replace(/^\d{4}-\d{2}(?:-\d{2})?-/, "");
	return `${slugWithoutDate}.mdx`;
}

function TreeItem({
	to,
	label,
	icon,
	depth = 0,
}: {
	to: string;
	label: string;
	icon: "tsx" | "mdx";
	depth?: number;
}) {
	const { pathname } = useLocation();
	const isActive = pathname === to;

	return (
		<li>
			<Link
				to={to}
				className={cn(
					"tree-item flex items-center gap-1.5 rounded px-2 py-1 text-sm leading-tight",
					isActive
						? "text-foreground bg-selection"
						: "text-muted hover:text-foreground hover:bg-panel-deeper",
				)}
				style={{ paddingLeft: `${depth * 14 + 10}px` }}
			>
				<span className={isActive ? "text-foreground" : "text-accent"}>
					{icon === "tsx" ? (
						<IconFileCode className="shrink-0" size={18} stroke={1.75} />
					) : (
						<IconFileText className="ml-2 shrink-0" size={18} stroke={1.75} />
					)}
				</span>
				<span className="min-w-0 truncate">{label}</span>
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
				<TreeItem to="/" label="me.tsx" icon="tsx" />
				<li>
					<button
						type="button"
						onClick={() => toggleFolder("blog")}
						className="tree-folder flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-muted hover:text-foreground hover:bg-panel-deeper"
					>
						<span aria-hidden="true" className="text-muted">
							{collapsedFolders.blog ? (
								<IconChevronRight className="shrink-0" size={14} stroke={2} />
							) : (
								<IconChevronDown className="shrink-0" size={14} stroke={2} />
							)}
						</span>
						<span className="text-accent">
							{collapsedFolders.blog ? (
								<IconFolder className="shrink-0" size={18} stroke={1.75} />
							) : (
								<IconFolderOpen className="shrink-0" size={18} stroke={1.75} />
							)}
						</span>
						<span>blog</span>
					</button>
				</li>
				{!collapsedFolders.blog && (
					<>
						<TreeItem to="/blog" label="index.mdx" icon="mdx" depth={1} />
						{posts.map((post) => (
							<TreeItem
								key={post.slug}
								to={`/blog/${post.slug}`}
								label={formatBlogLabel(post.slug)}
								icon="mdx"
								depth={1}
							/>
						))}
					</>
				)}

				<li>
					<button
						type="button"
						onClick={() => toggleFolder("projects")}
						className="tree-folder flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-muted hover:text-foreground hover:bg-panel-deeper"
					>
						<span aria-hidden="true" className="text-muted">
							{collapsedFolders.projects ? (
								<IconChevronRight className="shrink-0" size={14} stroke={2} />
							) : (
								<IconChevronDown className="shrink-0" size={14} stroke={2} />
							)}
						</span>
						<span className="text-accent">
							{collapsedFolders.projects ? (
								<IconFolder className="shrink-0" size={18} stroke={1.75} />
							) : (
								<IconFolderOpen className="shrink-0" size={18} stroke={1.75} />
							)}
						</span>
						<span>projects</span>
					</button>
				</li>
				{!collapsedFolders.projects && (
					<>
						<TreeItem to="/projects" label="index.mdx" icon="mdx" depth={1} />
						{projects.map((project) => (
							<TreeItem
								key={project.slug}
								to={`/projects/${project.slug}`}
								label={`${project.slug}.mdx`}
								icon="mdx"
								depth={1}
							/>
						))}
					</>
				)}
			</ul>
		</nav>
	);
}
