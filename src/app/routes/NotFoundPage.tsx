export function NotFoundPage() {
	return (
		<div className="flex flex-row items-stretch">
			<section className="flex flex-col items-center justify-center retro-border flex-1 min-w-0 h-full">
				<span className="text-xl mb-2">not found</span>
				<img
					src="/construction.gif"
					alt="404"
					className="h-32 w-32 rounded-md"
				/>
			</section>
		</div>
	);
}
