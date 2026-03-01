import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

export function MePage() {
	return (
		<div className="flex flex-row items-stretch">
			<Seo
				title="me"
				description="about me, the work i do, and the projects i enjoy building."
				path="/me"
				image="/og/me.png"
			/>
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
						i like building minimal software that does things right.
            most of my work lives somewhere between web applications, developer
            tooling, and linux focused side projects. i care about performance 
            and how a software feels when someone actually uses it.
              i tend to like systems that are
            simple in the right places, honest about what they are doing, not overdesigned.
					</p>
				</div>

				<div className="grid gap-8">
					<section>
						<h2 className="mb-3 text-lg text-accent">who i am</h2>
						<div className="grid gap-3">
							<p>
                i am a self-taught developer. i did not come into programming through the usual route.
                <span className="text-muted"> by usual route i mean the ai (hopefully) <i>bubble...</i> </span>
                <p>
                i learned by building, breaking, rewriting things and spending enough time stuck with them, to
                understand what was actually going on.
                </p>
							</p>
							<p>
								over time that turned into a pretty wide range of interests. i
								enjoy frontend for the details, backend for its modeling,
                  and lower level for performance, and control.
							</p>
						</div>
					</section>

					<section>
						<h2 className="mb-3 text-lg text-accent">projects i enjoyed working on</h2>
						<div className="grid gap-4">
							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">this site</h3>
								</div>
								<p className="mt-2 text-sm">
									my personal website and blog engine, written from scratch. i
									built it because i wanted a place to write and publish on my own
									terms without dragging in a heavy cms or treating my personal site
									like a generic portfolio template.
								</p>
								<p className="mt-2 text-sm text-muted">
									it is also an example of how i like software to feel
								</p>
							</article>

							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">termstart</h3>
								</div>
								<p className="mt-2 text-sm">
									a keyboard-driven bookmark manager that behaves like a small
									terminal inside the browser. files map to bookmarks, directories
									organize them, and commands drive the interface.
								</p>
								<p className="mt-2 text-sm text-muted">
									it has 200+ stars on github, which matters less to me as a number
									and more as proof that other people actually found it useful.
								</p>
							</article>

							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">lush</h3>
								</div>
								<p className="mt-2 text-sm">
									a larger rust project built around gtk widgets and lua scripting
									as a wayland shell.
								</p>
								<p className="mt-2 text-sm text-muted">
                  it is very much a work in progress now, but i use it daily.
								</p>
							</article>

							<article className="border border-border p-4">
								<div className="flex flex-wrap items-baseline gap-3">
									<h3 className="text-foreground">professional work</h3>
								</div>
								<p className="mt-2 text-sm">
									i worked for about two years on private full-stack web applications.
									i was not the founder, but part of the team building and shipping
									the products.
								</p>
								<p className="mt-2 text-sm text-muted">
									that matters to me because it moved things out of the
									"side project" world and into real product work. existing
									codebases, deadlines, maintenance, and the
									kind of tradeoffs that come with software other people rely on.
								</p>
							</article>
						</div>

					  <p className="mt-4 text-foreground">
              if you are interested have a look at my <Link to="/projects">projects</Link> page for detailed write ups.
            </p>
					</section>
				</div>
			</section>
		</div>
	);
}
