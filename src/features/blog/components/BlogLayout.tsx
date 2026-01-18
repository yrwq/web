import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { BlogList } from "./BlogList";

export function BlogLayout({
	children,
	className,
	contentClassName,
}: {
	children: ReactNode;
	className?: string;
	contentClassName?: string;
}) {
	return (
		<div className={cn("flex flex-row items-start w-full", className)}>
			<aside className="retro-border shrink-0">
				<BlogList />
			</aside>
			<section
				className={cn(
					"retro-border flex-1 min-w-0 self-stretch",
					contentClassName,
				)}
			>
				{children}
			</section>
		</div>
	);
}
