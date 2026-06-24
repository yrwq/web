import { Outlet } from "react-router-dom";
import { TerminalLayout } from "@/components/terminal-layout";

export function RootLayout() {
	return (
		<TerminalLayout>
			<Outlet />
		</TerminalLayout>
	);
}
