export const THEME_STORAGE_KEY = "theme-preference";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_SEQUENCE: ThemePreference[] = ["system", "light", "dark"];

export function isThemePreference(
	value: string | null,
): value is ThemePreference {
	return value === "system" || value === "light" || value === "dark";
}

export function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
	return preference === "system" ? getSystemTheme() : preference;
}

export function applyThemeToDocument(preference: ThemePreference) {
	if (typeof document === "undefined") {
		return;
	}

	const root = document.documentElement;
	const resolved = resolveTheme(preference);

	root.dataset.theme = preference;
	root.style.colorScheme = resolved;
}

export function getStoredThemePreference(): ThemePreference {
	if (typeof window === "undefined") {
		return "system";
	}

	let stored: string | null = null;
	try {
		stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	} catch {
		stored = null;
	}

	return isThemePreference(stored) ? stored : "system";
}

export function getNextThemePreference(
	current: ThemePreference,
): ThemePreference {
	const index = THEME_SEQUENCE.indexOf(current);
	return THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length] ?? "system";
}
