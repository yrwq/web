import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import { getCheatsheetBySlug } from "@/features/cheatsheets/api/cheatsheetDoc";
import { CheatsheetLayout } from "@/features/cheatsheets/components/CheatsheetLayout";
import type { CheatsheetDoc } from "@/features/cheatsheets/types/cheatsheets";

export function CheatsheetPage() {
	const { slug } = useParams();
	const [cheatsheet, setCheatsheet] = useState<CheatsheetDoc | null>(null);
	const [loading, setLoading] = useState(true);
	const articleRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!slug) {
			setLoading(false);
			setCheatsheet(null);
			return;
		}

		setLoading(true);
		getCheatsheetBySlug(slug).then((fetchedCheatsheet) => {
			setCheatsheet(fetchedCheatsheet);
			setLoading(false);
		});

		if (articleRef.current) {
			articleRef.current.scrollTop = 0;
		}
	}, [slug]);

	useEffect(() => {
		const html = document.documentElement;
		const body = document.body;
		const root = document.getElementById("root");
		const media = window.matchMedia("(min-width: 768px)");

		const prevHtmlOverflow = html.style.overflow;
		const prevBodyOverflow = body.style.overflow;
		const prevRootOverflow = root?.style.overflow ?? "";

		const applyLock = () => {
			const shouldLock = media.matches;
			html.style.overflow = shouldLock ? "hidden" : prevHtmlOverflow;
			body.style.overflow = shouldLock ? "hidden" : prevBodyOverflow;
			if (root) {
				root.style.overflow = shouldLock ? "hidden" : prevRootOverflow;
			}
		};

		applyLock();
		media.addEventListener("change", applyLock);

		return () => {
			media.removeEventListener("change", applyLock);
			html.style.overflow = prevHtmlOverflow;
			body.style.overflow = prevBodyOverflow;
			if (root) root.style.overflow = prevRootOverflow;
		};
	}, []);

	if (loading) return <div>Loading...</div>;
	if (!cheatsheet) return <NotFoundPage />;

	const { Component, meta } = cheatsheet;
	return (
		<CheatsheetLayout
			className="md:h-[calc(100vh-(var(--page-padding)*2))] md:overflow-hidden md:pb-10"
			contentClassName="md:h-full md:min-h-0 md:flex md:flex-col"
		>
			<article
				ref={articleRef}
				className="blog-post-scroll-container md:flex-1 md:min-h-0 md:overflow-y-auto pr-4"
			>
				<div className="mb-6 border-b border-border border-dashed pb-4">
					<h1 className="text-xl text-accent font-bold">{meta.title}</h1>
				</div>

				<div className="prose-content blog-post-scroll">
					<Component />
				</div>
			</article>
		</CheatsheetLayout>
	);
}
