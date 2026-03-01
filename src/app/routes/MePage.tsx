import { Link } from "react-router-dom";
import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";
import { getAllPosts } from "@/features/blog/api/blogIndex";

export function MePage({ path = "/me" }: { path?: "/" | "/me" }) {
	const recentPosts = getAllPosts().slice(0, 2);

	return (
		<div className="flex flex-row items-stretch">
			<Seo {...getStaticRouteSeo(path)} />
			<section className="retro-border flex-1 min-w-0">
				<div className="mb-6 border-b border-border border-dashed pb-4">
					<h1 className="text-2xl text-accent font-bold leading-tight">
						hi. im yrwq
					</h1>
					<p className="mt-3 max-w-3xl text-sm text-muted">
						welcome. if you stumbled upon this page, this is the short version of
						who i am and what i spend my time on.
					</p>
					<p className="mt-4 max-w-3xl text-foreground">
						i build web applications, developer tooling, and linux-focused side
						projects. this site is where i keep the work worth showing and the
						notes worth publishing.
					</p>
					<p className="mt-3 max-w-3xl text-foreground">
						i care about software that feels direct, performs well, and stays simple.
					</p>
				</div>

				<div className="grid gap-8">
					<section>
						<h2 className="mb-3 text-lg text-accent">what i build</h2>
						<div className="grid gap-3">
							<p>
								most of my work lives somewhere between web applications,
                small developer tools, and side projects shaped by a
								linux-first workflow.
							</p>
							<p>
								i enjoy frontend for the details, backend for its modeling, and
								lower-level work when performance or control starts to matter.
							</p>
						</div>
					</section>

					<section>
						<h2 className="mb-3 text-lg text-accent">
							how i think about software
						</h2>
						<div className="grid gap-3">
							<p>
								i learned by building, breaking, rewriting things, and staying
								with problems long enough to understand what was actually going on.
							</p>
							<p>
								that pushed me toward systems that are honest about what they do,
								simple in the right places, and not overdesigned for the sake of
								looking modern.
							</p>
						</div>
					</section>

					<section>
						<h2 className="mb-3 text-lg text-accent">selected work</h2>
						<div className="grid gap-4">
							<article className="border border-border p-4">
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
								<p className="mt-2 text-sm">
									my personal website and blog engine, written from scratch. i
									built it because i wanted a place to write and publish on my own
									terms without dragging in a heavy cms or turning it into a
									generic portfolio template.
								</p>
								<p className="mt-2 text-sm text-muted">
									also doubles as a small example of how i like software to feel.
								</p>
							</article>

							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">
										<Link to="/projects/termstart">termstart</Link>
									</h3>
								</div>
								<p className="mt-2 text-sm">
									a keyboard-driven bookmark manager that behaves like a small
									terminal inside the browser. files map to bookmarks, directories
									organize them, and commands drive the interface.
								</p>
								<p className="mt-2 text-sm text-muted">
									it has 200+ stars on github, which matters less as a number than
									as proof that other people actually found it useful.
								</p>
							</article>

							<article className="border border-border p-4">
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
								<p className="mt-2 text-sm">
									a larger rust project built around gtk widgets and lua scripting
									as a wayland shell.
								</p>
								<p className="mt-2 text-sm text-muted">
									it is still very much a work in progress, but i use it daily.
								</p>
							</article>

							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">
											professional work
									</h3>
								</div>
								<p className="mt-2 text-sm">
									i worked for about two years on full-stack web applications.
									i was not the founder, but part of the team building and shipping
									the products.
								</p>
								<p className="mt-2 text-sm text-muted">
									that mattered because it moved things out of the "side project"
									world and into real product work: existing codebases, deadlines,
									maintenance, and tradeoffs that affect other people.
								</p>
							</article>
						</div>

						<p className="mt-4 text-foreground">
							if you are interested have a look at my{" "}
							<Link to="/projects">projects</Link> page for detailed write ups.
						</p>
					</section>

					{recentPosts.length > 0 && (
						<section>
							<h2 className="mb-3 text-lg text-accent">recent writing</h2>
							<div className="grid gap-3">
								{recentPosts.map((post) => (
									<article key={post.slug} className="border border-border p-4">
										<h3 className="text-foreground">
											<Link to={`/blog/${post.slug}`}>{post.title}</Link>
										</h3>
										{post.description && (
											<p className="mt-2 text-sm text-muted">
												{post.description}
											</p>
										)}
									</article>
								))}
							</div>
						</section>
					)}
				</div>
			</section>
		</div>
	);
}
