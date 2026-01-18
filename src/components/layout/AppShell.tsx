import { SidebarNav } from "./SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col mx-auto">
			<div className="flex flex-row items-start">
				<SidebarNav />
				<main className="flex-1 min-w-0 flex flex-col items-start">
					{children}
				</main>
			</div>
		</div>
	);
}
