import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";
import { cn } from "@/lib/utils/cn";

interface HeadingItem {
	id: string;
	level: number;
	text: string;
}

interface RecentItem {
	path: string;
	title: string;
	visitedAt: string;
}

interface SearchItem {
	path: string;
	title: string;
	kind: "page" | "post" | "project";
	keywords: string;
}

const RECENT_KEY = "editor-recent-opened";
const RECENT_LIMIT = 10;

function getRouteTitle(pathname: string): string {
	if (pathname === "/" || pathname === "/me") return "me.tsx";
	if (pathname === "/blog") return "blog/index.mdx";
	if (pathname === "/projects") return "projects/index.mdx";

	if (pathname.startsWith("/blog/")) {
		const slug = pathname.replace("/blog/", "");
		return `${slug}.mdx`;
	}

	if (pathname.startsWith("/projects/")) {
		const slug = pathname.replace("/projects/", "");
		return `${slug}.mdx`;
	}

	return pathname.slice(1) || "index";
}

function getStaticSections(pathname: string): HeadingItem[] {
	if (pathname === "/" || pathname === "/me") {
		return [
			{ id: "selected-work", text: "selected work", level: 2 },
			{ id: "recent-writing", text: "recent writing", level: 2 },
		];
	}
	if (pathname === "/blog") {
		return [{ id: "blog-index", text: "blog", level: 1 }];
	}
	if (pathname === "/projects") {
		return [{ id: "projects-index", text: "projects", level: 1 }];
	}

	return [];
}

function readRecentItems(): RecentItem[] {
	if (typeof window === "undefined") return [];

	try {
		const parsed = JSON.parse(
			window.localStorage.getItem(RECENT_KEY) ?? "[]",
		) as RecentItem[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeRecentItems(items: RecentItem[]) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
}

function getFileInfo(
	pathname: string,
): Array<{ label: string; value: string }> {
	if (pathname === "/" || pathname === "/me") {
		return [
			{ label: "file", value: "me.tsx" },
			{ label: "type", value: "profile page" },
		];
	}

	if (pathname.startsWith("/blog/")) {
		const slug = pathname.replace("/blog/", "");
		const post = getAllPosts().find((item) => item.slug === slug);
		if (!post) return [{ label: "file", value: `${slug}.mdx` }];

		return [
			{ label: "file", value: `${post.slug}.mdx` },
			{ label: "date", value: post.date },
			{ label: "reading", value: post.readingTime ?? "n/a" },
			{ label: "tags", value: post.tags?.join(", ") || "none" },
		];
	}

	if (pathname.startsWith("/projects/")) {
		const slug = pathname.replace("/projects/", "");
		const project = getAllProjects().find((item) => item.slug === slug);
		if (!project) return [{ label: "file", value: `${slug}.mdx` }];

		return [
			{ label: "file", value: `${project.slug}.mdx` },
			{ label: "status", value: project.status || "n/a" },
			{ label: "stack", value: project.stack?.join(", ") || "n/a" },
			{ label: "tags", value: project.tags?.join(", ") || "none" },
		];
	}

	if (pathname === "/blog") {
		return [
			{ label: "folder", value: "blog" },
			{ label: "entries", value: String(getAllPosts().length) },
		];
	}

	if (pathname === "/projects") {
		return [
			{ label: "folder", value: "projects" },
			{ label: "entries", value: String(getAllProjects().length) },
		];
	}

	return [{ label: "path", value: pathname }];
}

function InspectorSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded border border-border bg-panel-deeper/20 p-2.5">
			<h3 className="mb-2 text-[11px] uppercase tracking-wide text-muted">
				{title}
			</h3>
			{children}
		</section>
	);
}

export function InspectorPanel() {
	const { pathname } = useLocation();
	const [query, setQuery] = useState("");
	const [headings, setHeadings] = useState<HeadingItem[]>([]);
	const [activeHeading, setActiveHeading] = useState<string | null>(null);
	const [recent, setRecent] = useState<RecentItem[]>(() => readRecentItems());

	const staticSections = useMemo(() => getStaticSections(pathname), [pathname]);
	const fileInfo = useMemo(() => getFileInfo(pathname), [pathname]);

	const searchIndex = useMemo<SearchItem[]>(() => {
		const pages: SearchItem[] = [
			{ path: "/", title: "me", kind: "page", keywords: "profile about" },
			{ path: "/blog", title: "blog", kind: "page", keywords: "writing posts" },
			{
				path: "/projects",
				title: "projects",
				kind: "page",
				keywords: "work portfolio",
			},
		];

		const posts = getAllPosts().map<SearchItem>((post) => ({
			path: `/blog/${post.slug}`,
			title: post.title,
			kind: "post",
			keywords: [post.slug, ...(post.tags ?? []), post.description ?? ""].join(
				" ",
			),
		}));

		const projects = getAllProjects().map<SearchItem>((project) => ({
			path: `/projects/${project.slug}`,
			title: project.title,
			kind: "project",
			keywords: [
				project.slug,
				...(project.tags ?? []),
				...(project.stack ?? []),
				project.description ?? "",
			].join(" "),
		}));

		return [...pages, ...posts, ...projects];
	}, []);

	const filteredResults = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return [];

		return searchIndex
			.filter((item) => {
				const haystack = `${item.title} ${item.keywords}`.toLowerCase();
				return haystack.includes(normalizedQuery);
			})
			.slice(0, 8);
	}, [query, searchIndex]);

	useEffect(() => {
		const headingRoot = document.querySelector(
			"main[data-editor-content='true']",
		) as HTMLElement | null;
		if (!headingRoot) {
			setHeadings(staticSections);
			return;
		}

		const collectHeadings = () => {
			const nodes = Array.from(
				headingRoot.querySelectorAll<HTMLElement>(
					"article h1[id], article h2[id], article h3[id], section h1[id], section h2[id], section h3[id], .prose-content h1[id], .prose-content h2[id], .prose-content h3[id]",
				),
			);
			const nextHeadings = nodes
				.map<HeadingItem | null>((element) => {
					const id = element.id;
					if (!id) return null;
					const level = Number.parseInt(element.tagName.slice(1), 10);
					return {
						id,
						level: Number.isNaN(level) ? 2 : level,
						text: element.textContent?.trim() ?? id,
					};
				})
				.filter((item): item is HeadingItem => Boolean(item));

			if (nextHeadings.length > 0) {
				const deduped = nextHeadings.filter(
					(item, index, array) =>
						array.findIndex((target) => target.id === item.id) === index,
				);
				setHeadings(deduped);
			} else {
				setHeadings(staticSections);
			}
		};

		collectHeadings();
		const observer = new MutationObserver(collectHeadings);
		observer.observe(headingRoot, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
		};
	}, [staticSections]);

	useEffect(() => {
		const onScroll = () => {
			if (headings.length === 0) {
				setActiveHeading(null);
				return;
			}

			const points = headings
				.map((item) => {
					const element = document.getElementById(item.id);
					if (!element) return null;
					const rect = element.getBoundingClientRect();
					return { id: item.id, top: rect.top };
				})
				.filter((item): item is { id: string; top: number } => Boolean(item));

			if (points.length === 0) return;

			const visible = points
				.filter((point) => point.top <= 180)
				.sort((a, b) => b.top - a.top)[0];

			setActiveHeading(visible?.id ?? points[0]?.id ?? null);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, true);
		return () => {
			window.removeEventListener("scroll", onScroll, true);
		};
	}, [headings]);

	useEffect(() => {
		const nextItem: RecentItem = {
			path: pathname,
			title: getRouteTitle(pathname),
			visitedAt: new Date().toISOString(),
		};

		setRecent((prev) => {
			const filtered = prev.filter((item) => item.path !== pathname);
			const next = [nextItem, ...filtered].slice(0, RECENT_LIMIT);
			writeRecentItems(next);
			return next;
		});
	}, [pathname]);

	return (
		<div className="h-full overflow-y-auto p-2.5">
			<div className="mb-2 px-1 text-[11px] uppercase tracking-wide text-muted">
				inspector
			</div>
			<div className="space-y-2.5">
				<InspectorSection title="outline">
					{headings.length > 0 ? (
						<ul className="space-y-1">
							{headings.map((heading) => (
								<li key={heading.id}>
									<a
										href={`#${heading.id}`}
										className={cn(
											"block rounded px-2 py-1 text-xs leading-tight",
											activeHeading === heading.id
												? "bg-panel text-foreground"
												: "text-muted hover:bg-panel hover:text-foreground",
										)}
										style={{ paddingLeft: `${6 + (heading.level - 1) * 12}px` }}
									>
										{heading.text}
									</a>
								</li>
							))}
						</ul>
					) : (
						<p className="text-xs text-muted">no headings on this page</p>
					)}
				</InspectorSection>

				<InspectorSection title="file info">
					<dl className="space-y-1 text-xs">
						{fileInfo.map((item) => (
							<div key={item.label} className="grid grid-cols-[70px_1fr] gap-2">
								<dt className="text-muted">{item.label}</dt>
								<dd className="break-words text-foreground">{item.value}</dd>
							</div>
						))}
					</dl>
				</InspectorSection>

				<InspectorSection title="search">
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="search pages, posts, projects"
						className="w-full rounded border border-border bg-panel px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
					/>
					{query.trim().length > 0 && (
						<ul className="mt-2 space-y-1">
							{filteredResults.length > 0 ? (
								filteredResults.map((result) => (
									<li key={result.path}>
										<Link
											to={result.path}
											className="block rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-foreground"
										>
											<div className="text-foreground">{result.title}</div>
											<div className="text-[11px] uppercase tracking-wide">
												{result.kind}
											</div>
										</Link>
									</li>
								))
							) : (
								<li className="px-2 py-1 text-xs text-muted">no matches</li>
							)}
						</ul>
					)}
				</InspectorSection>

				<InspectorSection title="recently opened">
					<ul className="space-y-1">
						{recent.length > 0 ? (
							recent.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										className="block rounded px-2 py-1 text-xs text-muted hover:bg-panel hover:text-foreground"
									>
										<div className="truncate text-foreground">{item.title}</div>
										<div className="text-[11px]">
											{new Date(item.visitedAt).toLocaleString()}
										</div>
									</Link>
								</li>
							))
						) : (
							<li className="px-2 py-1 text-xs text-muted">no recent pages</li>
						)}
					</ul>
				</InspectorSection>
			</div>
		</div>
	);
}
