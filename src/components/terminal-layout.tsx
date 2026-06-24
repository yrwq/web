"use client";

import {
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	Children,
	cloneElement,
	isValidElement,
	useRef,
	useEffect,
	useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { File, Folder } from "lucide-react";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	CommandPaletteTrigger,
	CommandPalette,
} from "@/components/command-palette";

function formatBlogLabel(slug: string) {
	const slugWithoutDate = slug.replace(/^\d{4}-\d{2}(?:-\d{2})?-/, "");
	return `${slugWithoutDate}.mdx`;
}


export function TerminalLayout({ children }: { children: ReactNode }) {
	const { pathname } = useLocation();
	const [explorerOpen, setExplorerOpen] = useState(true);
	const [explorerWidth, setExplorerWidth] = useState(260);
	const resizeStartRef = useRef<{ x: number; width: number } | null>(null);
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

	const posts = getAllPosts();
	const projects = getAllProjects();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandPaletteOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		event.preventDefault();
		resizeStartRef.current = { x: event.clientX, width: explorerWidth };

		const onMove = (moveEvent: PointerEvent) => {
			const start = resizeStartRef.current;
			if (!start) return;
			const nextWidth = start.width + moveEvent.clientX - start.x;
			setExplorerWidth(Math.min(Math.max(nextWidth, 180), 500));
		};

		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			resizeStartRef.current = null;
		};

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	const currentFile =
		pathname === "/"
			? "me.tsx"
			: pathname === "/blog"
				? "blog/"
				: pathname === "/projects"
					? "projects/"
					: pathname === "/uses"
						? "uses.tsx"
						: pathname.startsWith("/blog/")
						? `${pathname.slice(6)}.mdx`
						: pathname.startsWith("/projects/")
							? `${pathname.slice(10)}.mdx`
							: pathname.slice(1);

	return (
		<div className="mx-auto h-dvh max-h-dvh min-h-0 flex flex-col bg-background text-foreground font-mono text-sm border border-border overflow-hidden">
			<CommandPalette
				open={commandPaletteOpen}
				onOpenChange={setCommandPaletteOpen}
			/>

			{/* Title bar */}
			<div className="flex items-center justify-between bg-panel border-b border-border px-3 py-1.5 shrink-0">
				<div className="flex items-center gap-2">
					<div className="flex gap-1.5">
						<div className="w-3 h-3 rounded-full bg-red" />
						<div className="w-3 h-3 rounded-full bg-yellow" />
						<div className="w-3 h-3 rounded-full bg-green" />
					</div>
					<span className="text-xs ml-2 flex items-center text-muted">
						yrwq@site:~/{currentFile}
						<span className="cursor-blink ml-px inline-block w-[7px] h-[13px] bg-muted/60 translate-y-px" />
					</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setExplorerOpen((o) => !o)}
						className="text-xs text-muted hover:text-foreground px-2 py-0.5 border border-border rounded-sm"
					>
						{explorerOpen ? "hide explorer" : "show explorer"}
					</button>
					<CommandPaletteTrigger />
				</div>
			</div>

			{/* Main area */}
			<div className="flex flex-1 min-h-0">
				{/* Explorer sidebar */}
				{explorerOpen && (
					<aside
						className="hidden md:flex flex-col shrink-0 border-r border-border bg-panel/30 relative"
						style={{ width: `${explorerWidth}px` }}
					>
						<div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted bg-panel-deeper/20 border-b border-border shrink-0">
							explorer
						</div>
						<ScrollArea className="flex-1">
							<div className="p-2 space-y-0.5">
								<ExplorerItem
									to="/"
									label="me.tsx"
									depth={0}
									currentPath={pathname}
								/>
								<ExplorerItem
									to="/uses"
									label="uses.tsx"
									depth={0}
									currentPath={pathname}
								/>
								<FolderSection
									label="blog"
									to="/blog"
									currentPath={pathname}
								>
									<ExplorerItem
										to="/blog"
										label="index.mdx"
										depth={1}
										currentPath={pathname}
									/>
									{posts.map((post) => (
										<ExplorerItem
											key={post.slug}
											to={`/blog/${post.slug}`}
											label={formatBlogLabel(post.slug)}
											depth={1}
											currentPath={pathname}
										/>
									))}
								</FolderSection>
								<FolderSection
									label="projects"
									to="/projects"
									currentPath={pathname}
								>
									<ExplorerItem
										to="/projects"
										label="index.mdx"
										depth={1}
										currentPath={pathname}
									/>
									{projects.map((project) => (
										<ExplorerItem
											key={project.slug}
											to={`/projects/${project.slug}`}
											label={`${project.slug}.mdx`}
											depth={1}
											currentPath={pathname}
										/>
									))}
								</FolderSection>
							</div>
						</ScrollArea>
						<div
							className="absolute top-0 right-0 w-3 h-full cursor-col-resize shrink-0 group"
							onPointerDown={handlePointerDown}
						>
							<div className="w-px h-full bg-border mx-auto group-hover:bg-accent/50 transition-colors" />
						</div>
					</aside>
				)}

				{/* Mobile explorer toggle */}
				{explorerOpen && (
					<aside className="md:hidden w-full max-h-48 border-b border-border overflow-y-auto bg-panel/30 shrink-0">
						<div className="p-2 space-y-0.5 text-sm">
							<ExplorerItem
								to="/"
								label="me.tsx"
								depth={0}
								currentPath={pathname}
							/>
							<ExplorerItem
								to="/uses"
								label="uses.tsx"
								depth={0}
								currentPath={pathname}
							/>
							<FolderSection
								label="blog"
								to="/blog"
								currentPath={pathname}
							>
								<ExplorerItem
									to="/blog"
									label="index.mdx"
									depth={1}
									currentPath={pathname}
								/>
								{posts.map((post) => (
									<ExplorerItem
										key={post.slug}
										to={`/blog/${post.slug}`}
										label={formatBlogLabel(post.slug)}
										depth={1}
										currentPath={pathname}
									/>
								))}
							</FolderSection>
							<FolderSection
								label="projects"
								to="/projects"
								currentPath={pathname}
							>
								<ExplorerItem
									to="/projects"
									label="index.mdx"
									depth={1}
									currentPath={pathname}
								/>
								{projects.map((project) => (
									<ExplorerItem
										key={project.slug}
										to={`/projects/${project.slug}`}
										label={`${project.slug}.mdx`}
										depth={1}
										currentPath={pathname}
									/>
								))}
							</FolderSection>
						</div>
					</aside>
				)}

				{/* Content */}
				<main className="flex-1 min-w-0 overflow-y-auto bg-background">
					<div key={pathname} className="page-in h-full">
						{children}
					</div>
				</main>
			</div>

			{/* Status bar */}
			<div className="flex items-center justify-between bg-panel border-t border-border px-0 py-0 shrink-0 text-xs text-muted h-[22px]">
				<div className="flex items-center h-full">
					<span className="bg-accent text-background px-2 h-full flex items-center font-semibold tracking-widest text-[10px]">
						NORMAL
					</span>
					<span className="px-3 border-r border-border h-full flex items-center">
						<span className="text-green/80 mr-1">⎇</span> main
					</span>
					<span className="px-3">UTF-8 LF</span>
				</div>
				<span className="flex items-center gap-2 px-3">
					<span className="text-green">●</span>
					{posts.length} posts · {projects.length} projects
				</span>
			</div>
		</div>
	);
}

function ExplorerItem({
	to,
	label,
	depth,
	currentPath,
	isLast = false,
}: {
	to: string;
	label: string;
	depth: number;
	currentPath: string;
	isLast?: boolean;
}) {
	const isActive = currentPath === to;
	return (
		<Link
			to={to}
			className={cn(
				"group relative flex items-center gap-1 rounded-sm py-0.5 text-sm leading-tight truncate transition-colors pl-2 pr-2",
				isActive
					? "bg-accent/15 text-foreground"
					: "text-muted hover:text-foreground hover:bg-panel-deeper/20",
			)}
		>
			{isActive && (
				<span className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-r bg-accent" />
			)}
			{depth > 0 && (
				<span className="text-border select-none shrink-0 font-mono text-[11px] leading-none">
					{isLast ? "└─" : "├─"}
				</span>
			)}
			<File size={12} className="shrink-0 text-muted/50" />
			<span className="truncate">{label}</span>
		</Link>
	);
}

function FolderSection({
	label,
	to,
	currentPath,
	children,
	defaultOpen,
}: {
	label: string;
	to: string;
	currentPath: string;
	children: ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen ?? true);
	const isActive = currentPath === to || currentPath.startsWith(`${to}/`);

	useEffect(() => {
		if (isActive) setOpen(true);
	}, [isActive]);

	const childArray = Children.toArray(children);
	const childrenWithLast = childArray.map((child, i) => {
		if (!isValidElement(child)) return child;
		return cloneElement(child as React.ReactElement<{ isLast?: boolean }>, {
			isLast: i === childArray.length - 1,
		});
	});

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className={cn(
					"group relative flex items-center gap-1 w-full rounded-sm px-2 py-0.5 text-sm leading-tight text-left truncate transition-colors",
					isActive
						? "bg-accent/15 text-foreground"
						: "text-muted hover:text-foreground hover:bg-panel-deeper/20",
				)}
			>
				{isActive && (
					<span className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-r bg-accent" />
				)}
				<svg
					width="9"
					height="9"
					viewBox="0 0 10 10"
					aria-hidden="true"
					className={cn(
						"shrink-0 transition-transform duration-150 text-muted/50",
						open ? "rotate-90" : "",
					)}
				>
					<path
						d="M3 1.5l4 3.5-4 3.5"
						stroke="currentColor"
						fill="none"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<Folder size={12} className="shrink-0 text-muted/50" />
				<span className="truncate">{label}</span>
			</button>
			{open && (
				<div className="ml-[18px] border-l border-border/40 pl-0">
					{childrenWithLast}
				</div>
			)}
		</div>
	);
}
