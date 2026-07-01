"use client";

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command-palette";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";

interface SearchItem {
	path: string;
	title: string;
	kind: "page" | "post" | "project";
	keywords: string;
}

export function CommandPaletteTrigger() {
	return (
		<kbd className="text-xs text-muted border border-border rounded px-1.5 py-0.5 hidden sm:inline">
			⌘K
		</kbd>
	);
}

export function CommandPalette({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const navigate = useNavigate();

	const searchIndex = useMemo<SearchItem[]>(() => {
		const pages: SearchItem[] = [
			{
				path: "/",
				title: "me.tsx",
				kind: "page",
				keywords: "profile about home",
			},
			{
				path: "/blog",
				title: "blog",
				kind: "page",
				keywords: "writing posts index",
			},
			{
				path: "/projects",
				title: "projects",
				kind: "page",
				keywords: "work portfolio index",
			},
			{
				path: "/uses",
				title: "uses.tsx",
				kind: "page",
				keywords: "tools setup config equipment",
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

	const runCommand = useCallback(
		(command: () => unknown) => {
			onOpenChange(false);
			command();
		},
		[onOpenChange],
	);

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="type a path, post, or project..." />
			<CommandList>
				<CommandEmpty>no results found.</CommandEmpty>
				<CommandGroup heading="pages">
					<CommandItem onSelect={() => runCommand(() => navigate("/"))}>
						<span className="text-muted mr-2 select-none">~/</span>me.tsx
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => navigate("/blog"))}>
						<span className="text-muted mr-2 select-none">~/</span>blog/
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
						<span className="text-muted mr-2 select-none">~/</span>projects/
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => navigate("/uses"))}>
						<span className="text-muted mr-2 select-none">~/</span>uses.tsx
					</CommandItem>
				</CommandGroup>
				{searchIndex.filter((i) => i.kind === "post").length > 0 && (
					<CommandGroup heading="posts">
						{searchIndex
							.filter((i) => i.kind === "post")
							.map((item) => (
								<CommandItem
									key={item.path}
									onSelect={() => runCommand(() => navigate(item.path))}
								>
									<span className="text-muted mr-2 select-none">blog/</span>
									{item.title}
								</CommandItem>
							))}
					</CommandGroup>
				)}
				{searchIndex.filter((i) => i.kind === "project").length > 0 && (
					<CommandGroup heading="projects">
						{searchIndex
							.filter((i) => i.kind === "project")
							.map((item) => (
								<CommandItem
									key={item.path}
									onSelect={() => runCommand(() => navigate(item.path))}
								>
									<span className="text-muted mr-2 select-none">projects/</span>
									{item.title}
								</CommandItem>
							))}
					</CommandGroup>
				)}
			</CommandList>
			<CommandSeparator />
			<div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted font-mono">
				<span>↑↓ navigate</span>
				<span>↵ open</span>
				<span>esc close</span>
			</div>
		</CommandDialog>
	);
}
