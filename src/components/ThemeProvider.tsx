"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Available theme options
export type CustomTheme = "gruvbox-light" | "gruvbox-dark" | "rose-pine-dawn" | "rose-pine-moon";
export type Theme = "light" | "dark" | "system" | CustomTheme;

// Custom themes
export const CUSTOM_THEMES = ["gruvbox-light", "gruvbox-dark", "rose-pine-dawn", "rose-pine-moon"];

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  isCustomTheme: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme without causing hydration issues
function getDefaultTheme(): Theme {
  return "dark";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>(getDefaultTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [themeInitialized, setThemeInitialized] = useState(false);

  // Function to determine if the system prefers dark mode
  const systemPrefersDark = (): boolean => {
    return typeof window !== "undefined" 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true;
  };

  // Function to determine the base theme (light or dark)
  const resolveBaseTheme = (themeValue: Theme): "light" | "dark" => {
    if (themeValue === "system") {
      return systemPrefersDark() ? "dark" : "light";
    } 
    if (themeValue === "light" || themeValue === "dark") {
      return themeValue;
    }
    // Handle custom themes
    return (themeValue.includes("light") || themeValue.includes("dawn")) 
      ? "light" 
      : "dark";
  };

  // Check if a theme is a custom theme
  const isCustomTheme = (themeValue: Theme): boolean => {
    return CUSTOM_THEMES.includes(themeValue);
  };

  // Update the theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    try {
      // Try to get stored theme
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      
      if (storedTheme) {
        setThemeState(storedTheme);
        const resolved = resolveBaseTheme(storedTheme);
        setResolvedTheme(resolved);
      } else {
        // Default to dark if no theme stored
        setThemeState("dark");
        setResolvedTheme("dark");
      }
      
      // Mark theme as initialized
      setThemeInitialized(true);
    } catch (e) {
      // Default to dark if error
      console.error("Error initializing theme:", e);
      setThemeInitialized(true);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    try {
      // Avoid client/server mismatch by delaying first render
      if (!themeInitialized) {
        setThemeInitialized(true);
        return;
      }
      
      // Get the base theme (light/dark)
      const baseTheme = resolveBaseTheme(theme);
      setResolvedTheme(baseTheme);
      
      // Clear all theme classes
      const allThemeClasses = ["light", "dark", ...CUSTOM_THEMES];
      document.documentElement.classList.remove(...allThemeClasses);
      
      // Add the base theme class
      document.documentElement.classList.add(baseTheme);
      
      // Set color-scheme
      document.documentElement.style.colorScheme = baseTheme;
      
      // Add the custom theme class if applicable
      if (isCustomTheme(theme)) {
        document.documentElement.classList.add(theme);
      }
    } catch (e) {
      console.error("Error applying theme:", e);
    }
  }, [theme, mounted, themeInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const newBaseTheme = systemPrefersDark() ? "dark" : "light";
      setResolvedTheme(newBaseTheme);
      
      // Update classes
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newBaseTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: getDefaultTheme(),
        setTheme,
        resolvedTheme: "dark",
        isCustomTheme: false
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      resolvedTheme,
      isCustomTheme: isCustomTheme(theme)
    }}>
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