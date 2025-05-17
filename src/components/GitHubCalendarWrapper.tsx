"use client";

import GitHubCalendar from "react-github-calendar";
import { useTheme } from "./ThemeProvider";

export function GitHubCalendarWrapper() {
  const { resolvedTheme } = useTheme();

  // GitHub-like theme colors
  const githubTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"], // GitHub light mode colors
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"], // GitHub dark mode colors
  };

  return (
    <div className="justify-center items-center">
      <GitHubCalendar
        theme={githubTheme}
        username="yrwq"
        hideColorLegend
        hideTotalCount
        hideMonthLabels
        blockMargin={2}
        blockSize={13}
        colorScheme={resolvedTheme}
      />
    </div>
  );
}
