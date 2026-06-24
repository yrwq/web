export function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[320px] p-6">
			<div className="border border-border p-6 max-w-lg w-full">
				<div className="flex items-center gap-2 bg-panel border-b border-border px-3 py-1.5 -mx-6 -mt-6 mb-4">
					<div className="flex gap-1.5">
						<div className="w-2.5 h-2.5 rounded-full bg-red/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-yellow/80" />
						<div className="w-2.5 h-2.5 rounded-full bg-green/80" />
					</div>
					<span className="text-xs text-muted ml-2">bash: command not found</span>
				</div>
				<div className="space-y-2 text-sm">
					<p>
						<span className="text-red">bash:</span> page not found: command not
						found
					</p>
					<p className="text-muted">
						try navigating with{" "}
						<kbd className="px-1.5 py-0.5 border border-border rounded text-xs">
							⌘K
						</kbd>{" "}
						or go back to{" "}
						<a href="/" className="text-accent hover:underline">
							~
						</a>
						.
					</p>
				</div>
				<img
					src="/construction.gif"
					alt="under construction"
					className="mt-4 h-24 w-24 mx-auto rounded"
				/>
			</div>
		</div>
	);
}
