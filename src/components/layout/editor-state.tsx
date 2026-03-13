import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	applyThemeToDocument,
	getNextThemePreference,
	getStoredThemePreference,
	THEME_STORAGE_KEY,
	type ThemePreference,
} from "@/lib/theme";

type ExplorerFolder = "blog" | "projects";

interface EditorUiState {
	explorerWidth: number;
	collapsedFolders: Record<ExplorerFolder, boolean>;
	themePreference: ThemePreference;
	setExplorerWidth: (width: number) => void;
	toggleFolder: (folder: ExplorerFolder) => void;
	cycleTheme: () => void;
}

const MIN_EXPLORER_WIDTH = 220;
const MAX_EXPLORER_WIDTH = 520;
const EXPLORER_WIDTH_KEY = "editor-explorer-width";
const COLLAPSED_KEY = "editor-collapsed-folders";

const EditorUiContext = createContext<EditorUiState | null>(null);

function getInitialExplorerWidth() {
	if (typeof window === "undefined") {
		return 280;
	}

	const stored = Number.parseInt(
		window.localStorage.getItem(EXPLORER_WIDTH_KEY) ?? "",
		10,
	);
	if (Number.isNaN(stored)) {
		return 280;
	}
	return Math.min(Math.max(stored, MIN_EXPLORER_WIDTH), MAX_EXPLORER_WIDTH);
}

function getInitialCollapsedFolders(): Record<ExplorerFolder, boolean> {
	if (typeof window === "undefined") {
		return { blog: false, projects: false };
	}

	try {
		const parsed = JSON.parse(
			window.localStorage.getItem(COLLAPSED_KEY) ?? "{}",
		) as Partial<Record<ExplorerFolder, boolean>>;
		return {
			blog: parsed.blog ?? false,
			projects: parsed.projects ?? false,
		};
	} catch {
		return { blog: false, projects: false };
	}
}

export function EditorUiProvider({ children }: { children: ReactNode }) {
	const [explorerWidth, setExplorerWidthState] = useState(
		getInitialExplorerWidth,
	);
	const [collapsedFolders, setCollapsedFolders] = useState(
		getInitialCollapsedFolders,
	);
	const [themePreference, setThemePreference] = useState<ThemePreference>(() =>
		getStoredThemePreference(),
	);

	const setExplorerWidth = useCallback((width: number) => {
		const clamped = Math.min(
			Math.max(width, MIN_EXPLORER_WIDTH),
			MAX_EXPLORER_WIDTH,
		);
		setExplorerWidthState(clamped);
		window.localStorage.setItem(EXPLORER_WIDTH_KEY, String(clamped));
	}, []);

	const toggleFolder = useCallback((folder: ExplorerFolder) => {
		setCollapsedFolders((prev) => {
			const next = {
				...prev,
				[folder]: !prev[folder],
			};
			window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const cycleTheme = useCallback(() => {
		setThemePreference((prev) => {
			const next = getNextThemePreference(prev);
			applyThemeToDocument(next);
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
			return next;
		});
	}, []);

	const value = useMemo(
		() => ({
			explorerWidth,
			collapsedFolders,
			themePreference,
			setExplorerWidth,
			toggleFolder,
			cycleTheme,
		}),
		[
			explorerWidth,
			collapsedFolders,
			themePreference,
			setExplorerWidth,
			toggleFolder,
			cycleTheme,
		],
	);

	return (
		<EditorUiContext.Provider value={value}>
			{children}
		</EditorUiContext.Provider>
	);
}

export function useEditorUi() {
	const context = useContext(EditorUiContext);
	if (!context) {
		throw new Error("useEditorUi must be used within EditorUiProvider");
	}
	return context;
}
