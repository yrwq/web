"use client";

import { useEffect, useState, useCallback } from "react";

interface VimState {
  mode: "normal" | "visual";
  count: string;
  showStatus: boolean;
}

// Smooth scroll helper function
const smoothScroll = (
  element: HTMLElement,
  target: number,
  duration: number = 300,
) => {
  const start = element.scrollTop;
  const change = target - start;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function for smooth acceleration and deceleration
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    element.scrollTop = start + change * easeInOutCubic(progress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const useVimNavigation = () => {
  const [state, setState] = useState<VimState>({
    mode: "normal",
    count: "",
    showStatus: false,
  });

  const getCount = useCallback(() => {
    const num = parseInt(state.count) || 1;
    setState((prev) => ({ ...prev, count: "", showStatus: true }));
    return num;
  }, [state.count]);

  const shouldIgnoreEvent = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();

    // Check if command palette is open
    const commandPalette = document.querySelector(
      '[data-command-palette="true"]',
    );

    return (
      tagName === "input" ||
      tagName === "textarea" ||
      target.isContentEditable ||
      target.getAttribute("role") === "textbox" ||
      !!commandPalette
    );
  }, []);

  const getScrollableElement = useCallback(() => {
    return document.querySelector(".page-transition") as HTMLElement;
  }, []);

  const handleCommand = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle vim commands if Cmd+K or Ctrl+K is pressed (command palette)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") return;

      // Don't handle : key since it's used for command palette
      if (e.key === ":") return;

      // Don't handle Ctrl+N or Ctrl+P as they're used for command palette navigation
      if (e.ctrlKey && (e.key === "n" || e.key === "p")) return;

      if (shouldIgnoreEvent(e) || e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;
      const scrollableElement = getScrollableElement();

      if (!scrollableElement) return;

      // Handle numeric input for count
      if (key >= "0" && key <= "9") {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          count: prev.count + key,
          showStatus: true,
        }));
        return;
      }

      // Handle vim navigation keys
      switch (key) {
        case "j":
          e.preventDefault();
          scrollableElement.scrollTop += 50 * getCount();
          break;
        case "k":
          e.preventDefault();
          scrollableElement.scrollTop -= 50 * getCount();
          break;
        case "g":
          e.preventDefault();
          if (e.shiftKey) {
            // Capital G - go to bottom
            smoothScroll(
              scrollableElement,
              scrollableElement.scrollHeight,
              500,
            );
          } else {
            // Lowercase g - go to top
            smoothScroll(scrollableElement, 0, 500);
          }
          break;
        case "G":
          e.preventDefault();
          // Capital G - go to bottom
          smoothScroll(scrollableElement, scrollableElement.scrollHeight, 500);
          break;
        case "d":
          e.preventDefault();
          smoothScroll(
            scrollableElement,
            scrollableElement.scrollTop +
              (scrollableElement.clientHeight / 2) * getCount(),
            300,
          );
          break;
        case "u":
          e.preventDefault();
          smoothScroll(
            scrollableElement,
            scrollableElement.scrollTop -
              (scrollableElement.clientHeight / 2) * getCount(),
            300,
          );
          break;
      }
    },
    [getCount, shouldIgnoreEvent, getScrollableElement],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleCommand);

    return () => {
      window.removeEventListener("keydown", handleCommand);
    };
  }, [handleCommand]);

  useEffect(() => {
    if (state.showStatus) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, showStatus: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showStatus, state.count]);

  return {
    mode: state.mode,
    count: state.count,
    showStatus: state.showStatus,
  };
};
