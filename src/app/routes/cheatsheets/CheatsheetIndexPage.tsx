import { CheatsheetLayout } from "@/features/cheatsheets/components/CheatsheetLayout";

export function CheatsheetIndexPage() {
	return (
		<CheatsheetLayout>
			<div className="h-full flex flex-col gap-6">
				<div className="border-b border-border border-dashed pb-4">
					<h1 className="text-xl text-accent font-bold mt-2">cheatseets</h1>
				</div>

				<div className="prose-content grow">
					<p>useful keybindings i use all the time</p>
				</div>
			</div>
		</CheatsheetLayout>
	);
}
