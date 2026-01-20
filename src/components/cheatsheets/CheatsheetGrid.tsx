import type { ReactNode } from "react";

export function CheatsheetGrid({
	title,
	children,
}: {
	title?: string;
	children: ReactNode;
}) {
	return (
		<section className="cheatsheet-section">
			{title ? <h2 className="cheatsheet-section-title">{title}</h2> : null}
			<dl className="cheatsheet-grid">{children}</dl>
		</section>
	);
}

export function CheatsheetItem({
	keys,
	children,
}: {
	keys: string;
	children: ReactNode;
}) {
	return (
		<>
			<dt className="cheatsheet-term">
				<kbd>{keys}</kbd>
			</dt>
			<dd className="cheatsheet-desc">{children}</dd>
		</>
	);
}
