import { Link, NavLink } from "react-router-dom";
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
					<Link to="/projects" className="hover:text-accent block">
						projects
					</Link>
				</div>

				<div className="flex flex-col gap-1">
					<NavLink
						to="/cheatsheets"
						className={({ isActive }) =>
							cn(
								"hover:text-accent block",
								isActive ? "text-accent" : "text-accent-dark",
							)
						}
					>
						cheatsheets
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
