import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { CheatsheetList } from "./CheatsheetList";

export function CheatsheetLayout({
	children,
	className,
	contentClassName,
}: {
	children: ReactNode;
	className?: string;
	contentClassName?: string;
}) {
	return (
		<div
			className={cn("flex flex-col md:flex-row items-start w-full", className)}
		>
			<aside className="retro-border shrink-0 w-full md:w-auto">
				<CheatsheetList />
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
