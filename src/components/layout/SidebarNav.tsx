import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils/cn";

export function SidebarNav() {
	return (
		<nav className="retro-border w-full md:w-auto">
			<div className="flex flex-col">
				<div className="flex flex-col gap-1">
					<NavLink
						to="/blog"
						className={({ isActive }) =>
							cn(
								"hover:text-accent block",
								isActive ? "text-accent" : "text-accent-dark",
							)
						}
					>
						posts
					</NavLink>
					<NavLink
						to="/projects"
						className={({ isActive }) =>
							cn(
								"hover:text-accent block",
								isActive ? "text-accent" : "text-accent-dark",
							)
						}
					>
						projects
					</NavLink>
				</div>

				<div className="flex flex-col gap-1">
					<NavLink to="/me" className="hover:text-accent block">
						me
					</NavLink>
				</div>

				<div className="mt-5 text-muted">more</div>
			</div>
		</nav>
	);
}
