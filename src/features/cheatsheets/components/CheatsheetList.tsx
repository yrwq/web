import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getCheatsheetIndex } from "@/features/cheatsheets/api/cheatsheetIndex";
import { cn } from "@/lib/utils/cn";

export function CheatsheetList() {
	const { slug } = useParams();
	const cheatsheets = useMemo(() => getCheatsheetIndex(), []);

	return (
		<div className="flex flex-col gap-4 max-w-2xs">
			<div className="flex items-center justify-between border-b border-border border-dashed pb-2">
				<div className="text-xs uppercase text-muted">library</div>
			</div>
			<ul className="flex flex-col gap-1.5 list-none">
				{cheatsheets.map((sheet) => (
					<li key={sheet.slug} className="flex items-baseline text-md">
						<Link
							to={`/cheatsheets/${sheet.slug}`}
							className={cn(
								"hover:text-accent underline-offset-4 my-0.5 decoration-dotted truncate block leading-tight",
								slug === sheet.slug ? "text-accent" : "text-accent-dark",
							)}
						>
							{sheet.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
