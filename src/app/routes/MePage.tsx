import { Briefcase, Code2, Mail, MessageCircle, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { getStaticRouteSeo } from "@/app/route-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import { getAllProjects } from "@/features/projects/api/projects";
import { SITE_URL } from "@/lib/seo";

function TerminalSection({
	icon,
	label,
	children,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-6">
			<h2 className="text-accent font-semibold mb-3 flex items-center gap-2">
				{icon}
				<span>{label}</span>
			</h2>
			{children}
		</div>
	);
}

function Card({
	title,
	description,
	href,
	to,
}: {
	title: string;
	description: string;
	href?: string;
	to?: string;
}) {
	const inner = (
		<>
			<div className="text-sm text-foreground">{title}</div>
			<div className="text-xs text-muted mt-0.5">{description}</div>
		</>
	);

	if (href) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="border border-border p-3 block hover:border-accent transition-colors"
			>
				{inner}
			</a>
		);
	}

	if (to) {
		return (
			<Link
				to={to}
				className="border border-border p-3 block hover:border-accent transition-colors"
			>
				{inner}
			</Link>
		);
	}

	return <div className="border border-border p-3">{inner}</div>;
}

export function MePage({ path = "/me" }: { path?: "/" | "/me" }) {
	const recentPosts = getAllPosts().slice(0, 3);
	const recentProjects = getAllProjects().slice(0, 3);

	return (
		<div className="p-4 md:p-6">
			<Seo {...getStaticRouteSeo(path)} />
			<JsonLd
				schema={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: "yrwq",
					url: SITE_URL,
					description: "about me, the work i do, and the projects i enjoy building.",
					sameAs: [
						"https://github.com/yrwq",
						"https://www.linkedin.com/in/david-inhof/",
					],
				}}
			/>
			<JsonLd
				schema={{
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: SITE_URL,
						},
					],
				}}
			/>

			{/* neofetch-style header */}
			<div className="mb-6 border border-border overflow-hidden">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5">
					<span className="text-xs text-muted">neofetch</span>
				</div>
				<div className="p-4 space-y-1 text-xs md:text-sm leading-relaxed">
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">user</span>
						<span>yrwq</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">hostname</span>
						<span>yrwq.github.io</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">os</span>
						<span>macOS</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">uptime</span>
						<span>a few years now</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">shell</span>
						<span>zsh</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">terminal</span>
						<span>ghostty</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">editor</span>
						<span>neovim</span>
					</div>
					<div className="flex gap-2">
						<span className="text-accent w-24 shrink-0">contact</span>
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
					<span className="text-xs text-muted">
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

			{/* Projects */}
			<TerminalSection icon={<Terminal size={16} />} label="$ cat work.log">
				<div className="grid gap-2">
					{recentProjects.map((p) => (
						<Card
							key={p.slug}
							title={p.title}
							description={p.description ?? ""}
							to={`/projects/${p.slug}`}
						/>
					))}
				</div>
				<p className="mt-3 text-sm text-muted">
					<span className="text-accent">$</span> have a look at{" "}
					<Link to="/projects" className="text-accent">
						projects
					</Link>{" "}
					for detailed write ups.
				</p>
			</TerminalSection>

			{/* Recent posts */}
			{recentPosts.length > 0 && (
				<TerminalSection
					icon={<MessageCircle size={16} />}
					label="$ tail blog/"
				>
					<div className="grid gap-2">
						{recentPosts.map((post) => (
							<Card
								key={post.slug}
								title={post.title}
								description={post.description ?? ""}
								to={`/blog/${post.slug}`}
							/>
						))}
					</div>
				</TerminalSection>
			)}

			{/* Contact */}
			<TerminalSection icon={<Mail size={16} />} label="$ cat ~/.contacts">
				<div className="border border-border p-3 space-y-2 text-sm">
					<div className="flex items-center gap-2 text-foreground">
						<Code2 size={16} className="text-accent" />
						<a href="https://github.com/yrwq" target="_blank" rel="noreferrer">
							yrwq
						</a>
					</div>
					<div className="flex items-center gap-2 text-foreground">
						<Briefcase size={16} className="text-accent" />
						<a
							href="https://www.linkedin.com/in/david-inhof/"
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
						<a href="mailto:yrwq_again@proton.me">yrwq_again@proton.me</a>
					</div>
				</div>
			</TerminalSection>
		</div>
	);
}
