"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "dark") setTheme("system");
    else if (theme === "system") setTheme("light");
    else setTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 bg-surface hover:bg-muted text-foreground transition-colors duration-500 ease-in-out rounded-md mr-2 w-10 h-10 flex items-center justify-center text-xl"
      aria-label="Toggle theme"
      title={`Current theme: ${theme} (${resolvedTheme})`}
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-cyan" />
      ) : theme === "system" ? (
        <Monitor className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-yellow" />
      )}
    </button>
  );
}
