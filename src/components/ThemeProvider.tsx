"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Function to resolve system theme
  const resolveSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Function to determine which theme to apply
  const calculateResolvedTheme = (themeValue: Theme): "light" | "dark" => {
    return themeValue === "system" ? resolveSystemTheme() : themeValue;
  };

  // Update the theme state and localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  // Initialize theme from localStorage on mount, defaulting to system preference or dark
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (typeof window !== 'undefined') {
      // If no stored preference, use system preference
      setThemeState("system");
      // And ensure dark is set initially as fallback
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply theme to document and calculate resolved theme
  useEffect(() => {
    if (!mounted) return;

    const resolved = calculateResolvedTheme(theme);
    setResolvedTheme(resolved);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newResolved = resolveSystemTheme();
        setResolvedTheme(newResolved);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};