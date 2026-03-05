import {
	type CSSProperties,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useState,
} from "react";
import { cn } from "@/lib/utils/cn";
import { BlogList } from "./BlogList";

export function BlogLayout({
	children,
	className,
	contentClassName,
	blogListClassName,
	asideClassName,
	asideContent,
	storageKey = "blog-list-width",
}: {
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	blogListClassName?: string;
	asideClassName?: string;
	asideContent?: ReactNode;
	storageKey?: string;
}) {
	const [blogListWidth, setBlogListWidth] = useState(() => {
		if (typeof window === "undefined") return 448;
		const saved = Number.parseInt(
			window.localStorage.getItem(storageKey) ?? "",
			10,
		);
		return Number.isNaN(saved) ? 448 : Math.max(260, saved);
	});

	useEffect(() => {
		window.localStorage.setItem(storageKey, String(blogListWidth));
	}, [blogListWidth, storageKey]);

	const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		event.preventDefault();

		const startX = event.clientX;
		const startWidth = blogListWidth;

		const onPointerMove = (moveEvent: globalThis.PointerEvent) => {
			const delta = moveEvent.clientX - startX;
			setBlogListWidth(Math.max(260, startWidth + delta));
		};

		const onPointerUp = () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
	};

	return (
		<div
			className={cn(
				"relative flex flex-col md:flex-row items-start w-full",
				className,
			)}
		>
			<aside
				className={cn(
					"retro-border shrink-0 w-full md:w-[min(100%,var(--blog-list-width))] md:max-w-max md:relative",
					asideClassName,
				)}
				style={{ "--blog-list-width": `${blogListWidth}px` } as CSSProperties}
			>
				{asideContent ?? <BlogList className={blogListClassName} />}
				<div
					className="group absolute -right-2.5 top-0 bottom-0 z-10 hidden md:flex w-5 cursor-col-resize items-center justify-center"
					onPointerDown={startResize}
					title="drag to resize"
				>
					<div className="relative h-full w-2 flex items-center justify-center">
						<div className="h-full w-0.5 bg-border transition-colors group-hover:bg-accent" />
						<div className="absolute text-[10px] leading-none text-muted group-hover:text-accent select-none">
							||
						</div>
					</div>
				</div>
			</aside>
			<section
				className={cn(
					"retro-border flex-1 min-w-0 self-stretch w-full min-h-0",
					contentClassName,
				)}
			>
				{children}
			</section>
		</div>
	);
}
