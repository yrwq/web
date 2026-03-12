import { getStaticRouteSeo } from "@/app/route-seo";
import { Seo } from "@/components/seo/Seo";

export function BlogIndexPage() {
	return (
		<section className="editor-panel h-full border border-border bg-panel-deeper/20 p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/blog")} />
			<div className="mb-6 border-b border-border border-dashed pb-2">
				<h1 className="text-xl text-accent font-semibold">blog</h1>
			</div>

			<div className="prose-content">
				<p>pick a post from the explorer to open it.</p>
				<p>
					<span className="text-red">disclaimer: </span>
					everything here is my personal opinion.
				</p>
			</div>
		</section>
	);
}
