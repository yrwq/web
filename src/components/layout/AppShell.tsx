import { SidebarNav } from "./SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col mx-auto">
			<div className="flex flex-col md:flex-row items-stretch md:items-start">
				<SidebarNav />
				<main className="flex-1 min-w-0 flex flex-col items-stretch md:items-start">
					{children}
				</main>
			</div>
		</div>
	);
}
