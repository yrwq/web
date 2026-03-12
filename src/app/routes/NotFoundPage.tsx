export function NotFoundPage() {
	return (
		<section className="editor-panel flex h-full min-h-[320px] flex-col items-center justify-center border border-border bg-panel-deeper/20 p-6">
			<span className="mb-2 text-xl">not found</span>
			<img src="/construction.gif" alt="404" className="h-32 w-32 rounded-md" />
		</section>
	);
}
