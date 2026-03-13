import {
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { ExplorerTree } from "./ExplorerTree";
import { EditorUiProvider, useEditorUi } from "./editor-state";
import { InspectorPanel } from "./InspectorPanel";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<EditorUiProvider>
			<EditorShell>{children}</EditorShell>
		</EditorUiProvider>
	);
}

function EditorShell({ children }: { children: ReactNode }) {
	const { explorerWidth, setExplorerWidth, themePreference, cycleTheme } =
		useEditorUi();
	const { pathname } = useLocation();
	const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

	const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		event.preventDefault();
		resizeStartRef.current = { x: event.clientX, width: explorerWidth };

		const onMove = (moveEvent: PointerEvent) => {
			const start = resizeStartRef.current;
			if (!start) return;
			const nextWidth = start.width + moveEvent.clientX - start.x;
			setExplorerWidth(nextWidth);
		};

		const onUp = () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			resizeStartRef.current = null;
		};

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	return (
		<div className="editor-shell mx-auto h-[calc(100vh-(var(--page-padding)*2))] min-h-[560px] overflow-hidden border border-border bg-panel">
			<header className="editor-header flex items-center justify-between border-b border-border px-3 py-2">
				<div className="truncate text-sm text-muted">
					workspace / {pathname === "/" ? "me.tsx" : pathname.slice(1)}
				</div>
				<button
					type="button"
					className="rounded border border-border px-2 py-1 text-xs text-muted hover:text-foreground hover:border-accent"
					onClick={cycleTheme}
					title="Cycle theme"
				>
					theme: {themePreference}
				</button>
			</header>
			<div className="flex h-[calc(100%-74px)] min-h-0 flex-col md:flex-row">
				<aside
					className="relative hidden md:block shrink-0 border-r border-border bg-panel-deeper/30"
					style={{ width: `${explorerWidth}px` }}
				>
					<ExplorerTree />
					<div
						className="absolute -right-1 top-0 h-full w-2 cursor-col-resize"
						onPointerDown={handlePointerDown}
					/>
				</aside>
				<aside className="block md:hidden w-full border-b border-border max-h-56 overflow-y-auto">
					<ExplorerTree />
				</aside>
				<main
					data-editor-content="true"
					className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 md:p-6"
				>
					{children}
				</main>
				<aside className="hidden lg:block w-72 shrink-0 border-l border-border bg-panel-deeper/30">
					<InspectorPanel />
				</aside>
			</div>
			<footer className="editor-status flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted">
				<span>Copyright 2026 yrwq</span>
				<span>UTF-8 LF</span>
			</footer>
		</div>
	);
}
