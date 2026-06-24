import {
	Terminal,
	Mail,
	Globe,
	Code2,
	Briefcase,
	MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";
import { getAllPosts } from "@/features/blog/api/blogIndex";

export function MePage({ path = "/me" }: { path?: "/" | "/me" }) {
	const recentPosts = getAllPosts().slice(0, 2);

	return (
		<div className="p-4 md:p-6 max-w-4xl">
			<Seo {...getStaticRouteSeo(path)} />

			{/* neofetch-style header */}
			<div className="mb-6 border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-yellow/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-green/80" />
					</div>
					<span className="text-xs text-muted ml-2">neofetch</span>
				</div>
				<div className="p-4 space-y-1.5 text-xs md:text-sm leading-relaxed">
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">user</span>
						<span>yrwq</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">hostname</span>
						<span>yrwq.github.io</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">uptime</span>
						<span>a few years now</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">shell</span>
						<span>zsh 5.9</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">wm</span>
						<span>lush (wayland)</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">ide</span>
						<span>nvim 0.11</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-20 shrink-0">contact</span>
						<span>yrwq_again@proton.me</span>
					</div>
					<div className="flex gap-0.5 pt-2">
						<div className="w-4 h-4 bg-red" />
						<div className="w-4 h-4 bg-orange" />
						<div className="w-4 h-4 bg-yellow" />
						<div className="w-4 h-4 bg-green" />
						<div className="w-4 h-4 bg-aqua" />
						<div className="w-4 h-4 bg-blue" />
						<div className="w-4 h-4 bg-purple" />
					</div>
				</div>
			</div>

			{/* Bio */}
			<div className="mb-6 border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-yellow/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-green/80" />
					</div>
					<span className="text-xs text-muted ml-2">
						yrwq@site:~<span className="text-accent">$</span> cat README.md
					</span>
				</div>
				<div className="p-4 text-sm space-y-2">
					<p>
						i build web applications, developer tooling, and workflow focused
						side projects. this site is where i keep the work worth showing and
						the notes worth publishing.
					</p>
					<p>
						i care about software that feels direct, performs well, and stays
						simple.
					</p>
					<p>
						i learned by building, breaking, rewriting things, and staying with
						problems long enough to understand what was actually going on.
					</p>
				</div>
			</div>

			{/* Selected work */}
			<div className="mb-6">
				<h2
					id="selected-work"
					className="text-accent font-semibold mb-3 flex items-center gap-2"
				>
					<Terminal size={16} />
					$ cat work.log
				</h2>
				<div className="grid gap-3">
					<article className="border border-border p-3">
						<div className="flex flex-wrap items-baseline gap-3">
							<h3 className="text-foreground">
								<a
									href="https://github.com/yrwq/web"
									target="_blank"
									rel="noreferrer"
								>
									this site
								</a>
							</h3>
						</div>
						<p className="mt-1.5 text-sm text-muted">
							my personal website and blog engine, written from scratch. built
							to write and publish on my own terms.
						</p>
					</article>

					<article className="border border-border p-3">
						<div className="flex flex-wrap items-baseline gap-3">
							<h3 className="text-foreground">
								<Link to="/projects/termstart">termstart</Link>
							</h3>
						</div>
						<p className="mt-1.5 text-sm text-muted">
							a keyboard-driven bookmark manager that behaves like a small
							terminal inside the browser.
						</p>
					</article>

					<article className="border border-border p-3">
						<div className="flex flex-wrap items-baseline gap-3">
							<h3 className="text-foreground">
								<a
									href="https://github.com/yrwq/lush"
									target="_blank"
									rel="noreferrer"
								>
									lush
								</a>
							</h3>
						</div>
						<p className="mt-1.5 text-sm text-muted">
							a larger rust project built around gtk widgets and lua scripting
							as a wayland shell.
						</p>
					</article>
				</div>

				<p className="mt-3 text-sm text-muted">
					<span className="text-accent">$</span> have a look at{" "}
					<Link to="/projects" className="text-accent">
						projects
					</Link>{" "}
					for detailed write ups.
				</p>
			</div>

			{/* Recent posts */}
			{recentPosts.length > 0 && (
				<div className="mb-6">
					<h2
						id="recent-writing"
						className="text-accent font-semibold mb-3 flex items-center gap-2"
					>
						<MessageCircle size={16} />
						$ tail blog/
					</h2>
					<div className="grid gap-2.5">
						{recentPosts.map((post) => (
							<article
								key={post.slug}
								className="border border-border p-3"
							>
								<h3 className="text-foreground">
									<Link to={`/blog/${post.slug}`}>{post.title}</Link>
								</h3>
								{post.description && (
									<p className="mt-1 text-sm text-muted">
										{post.description}
									</p>
								)}
							</article>
						))}
					</div>
				</div>
			)}

			{/* Contact */}
			<div>
				<h2
					id="contact"
					className="text-accent font-semibold mb-3 flex items-center gap-2"
				>
					<Mail size={16} />
					$ cat ~/.contacts
				</h2>
				<div className="border border-border p-3 space-y-2 text-sm">
					<div className="flex items-center gap-2 text-foreground">
						<Globe size={16} className="text-accent" />
						<a
							href="https://github.com/yrwq"
							target="_blank"
							rel="noreferrer"
						>
							github.com/yrwq
						</a>
					</div>
					<div className="flex items-center gap-2 text-foreground">
				<Code2 size={16} className="text-accent" />
					<a
						href="https://github.com/yrwq"
						target="_blank"
						rel="noreferrer"
					>
						yrwq
					</a>
					</div>
					<div className="flex items-center gap-2 text-foreground">
				<Briefcase size={16} className="text-accent" />
					<a
						href="https://www.linkedin.com/in/d%C3%A1vid-inhof-3606883b5"
						target="_blank"
						rel="noreferrer"
					>
						linkedin
					</a>
					</div>
					<div className="flex items-center gap-2 text-foreground">
						<MessageCircle size={16} className="text-accent" />
						<span>discord: yrwqid</span>
					</div>
					<div className="flex items-center gap-2 text-foreground">
						<Mail size={16} className="text-accent" />
						<a href="mailto:yrwq_again@proton.me">
							yrwq_again@proton.me
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
