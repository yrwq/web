"use client";

import GitHubCalendar from "react-github-calendar";
import { useTheme, Theme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function GitHubCalendarWrapper() {
  const { theme, resolvedTheme, isCustomTheme } = useTheme();
  const [calendarColors, setCalendarColors] = useState<string[]>([]);

  // Theme colors for different theme variants
  const calendarThemes: Record<string, string[]> = {
    // Light themes
    "light": ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    "gruvbox-light": ["#fbf1c7", "#b8bb26", "#98971a", "#79740e", "#4c500e"],
    "rose-pine-dawn": ["#faf4ed", "#56949f", "#286983", "#907aa9", "#d7827e"],
    
    // Dark themes
    "dark": ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    "gruvbox-dark": ["#282828", "#98971a", "#b8bb26", "#d8c25a", "#fabd2f"],
    "rose-pine-moon": ["#232136", "#3e8fb0", "#9ccfd8", "#c4a7e7", "#eb6f92"],
  };

  // Update colors when theme changes
  useEffect(() => {
    try {
      // Determine which theme colors to use
      let colors: string[];
      
      if (theme !== "light" && theme !== "dark" && theme !== "system") {
        // If it's a custom theme, use its colors
        colors = calendarThemes[theme] || calendarThemes[resolvedTheme];
      } else {
        // Otherwise use the resolved theme (light/dark)
        colors = calendarThemes[resolvedTheme];
      }
      
      setCalendarColors(colors);
    } catch (e) {
      // Fallback to basic colors if there's an error
      setCalendarColors(calendarThemes[resolvedTheme]);
    }
  }, [theme, resolvedTheme, isCustomTheme]);

  return (
    <div className="justify-center items-center">
      <GitHubCalendar
        username="yrwq"
        hideColorLegend
        hideTotalCount
        hideMonthLabels
        blockMargin={2}
        blockSize={13}
        colorScheme={resolvedTheme}
        theme={{
          light: calendarThemes["light"],
          dark: calendarThemes["dark"],
        }}
        style={{ 
          color: "var(--color-text)",
          '--calendar-scale-0': calendarColors[0] || calendarThemes[resolvedTheme][0],
          '--calendar-scale-1': calendarColors[1] || calendarThemes[resolvedTheme][1],
          '--calendar-scale-2': calendarColors[2] || calendarThemes[resolvedTheme][2],
          '--calendar-scale-3': calendarColors[3] || calendarThemes[resolvedTheme][3],
          '--calendar-scale-4': calendarColors[4] || calendarThemes[resolvedTheme][4],
        } as React.CSSProperties}
      />
    </div>
  );
}
