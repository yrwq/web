"use client";

import GitHubCalendar from "react-github-calendar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useEffect, useState, useRef } from "react";

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function GitHubCalendarWrapper() {
  const { theme, resolvedTheme, isCustomTheme } = useTheme();
  const [calendarColors, setCalendarColors] = useState<string[]>([
    "#161b22", "#0e4429", "#006d32", "#26a641", "#39d353" // Default to dark theme colors
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Responsive block size, margin, and min width
  const [blockSize, setBlockSize] = useState(13);
  const [months, setMonths] = useState(12);
  const [blockMargin, setBlockMargin] = useState(2);
  const [minWidth, setMinWidth] = useState(700);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setBlockSize(10);
        setBlockMargin(1);
        setMinWidth(500);
        setMonths(8)
      } else if (window.innerWidth < 700) {
        setBlockSize(10);
        setBlockMargin(1);
        setMinWidth(500);
        setMonths(12)
      } else {
        setBlockSize(13);
        setBlockMargin(2);
        setMinWidth(700);
        setMonths(4)
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      // Fallback to a default set of colors if there's an error or theme not found
      setCalendarColors(calendarThemes["dark"] || ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]); // Fallback to light theme defaults or a hardcoded default
    }
  }, [theme, resolvedTheme, isCustomTheme]);

  const selectLastMonth = (contributions: Activity[]): Activity[] => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = months;

    return contributions.filter((activity: Activity) => {
      const date = new Date(activity.date);
      const monthOfDay = date.getMonth();

      return (
        date.getFullYear() === currentYear &&
        monthOfDay > currentMonth - shownMonths &&
        monthOfDay <= currentMonth
      );
    });
  };

  const selectMobileMonths = (contributions: Activity[]): Activity[] => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 6;

    return contributions.filter((activity: Activity) => {
      const date = new Date(activity.date);
      const monthOfDay = date.getMonth();

      return (
        date.getFullYear() === currentYear &&
        monthOfDay > currentMonth - shownMonths &&
        monthOfDay <= currentMonth
      );
    });
  };

  // Robust auto-scroll-to-end logic
  useEffect(() => {
    const scrollToEnd = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      }
    };

    // Use requestAnimationFrame for next paint, then a small timeout for safety
    requestAnimationFrame(() => {
      setTimeout(scrollToEnd, 50); // A small delay to ensure layout is complete
    });

    // ResizeObserver for container/content size changes
    let resizeObserver: ResizeObserver | null = null;
    if (scrollRef.current) {
      resizeObserver = new ResizeObserver(scrollToEnd);
      resizeObserver.observe(scrollRef.current);
    }

    // Window resize listener (for orientation changes, etc.)
    window.addEventListener("resize", scrollToEnd);

    // Cleanup
    return () => {
      window.removeEventListener("resize", scrollToEnd);
      if (resizeObserver && scrollRef.current) {
        resizeObserver.unobserve(scrollRef.current);
      }
    };
  }, [calendarColors]);

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/30"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        className="flex justify-end"
        style={{ minWidth: `${minWidth}px` }}
      >
        <GitHubCalendar
          username="yrwq"
          hideTotalCount
          blockMargin={blockMargin}
          blockSize={blockSize}
          transformData={selectLastMonth}
          colorScheme={resolvedTheme}
          theme={{
            light: calendarColors,
            dark: calendarColors,
          }}
          style={{
            color: "var(--color-text)",
          }}
        />
      </div>
    </div>
  );
}
