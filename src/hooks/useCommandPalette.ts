"use client";

import { useEffect, useState, useCallback } from "react";

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMode, setQuickMode] = useState("");

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle any keys if command palette is open (let it handle its own)
      if (isOpen) return;

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
        return;
      }

      // Don't handle other keys if we're in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInputField) return;

      // Handle quick shortcuts (g + key combinations)
      if (e.key === "g") {
        e.preventDefault();
        setQuickMode("g");
        setTimeout(() => setQuickMode(""), 2000); // Clear after 2 seconds
        return;
      }

      // Handle g + key combinations
      if (quickMode === "g") {
        e.preventDefault();
        setQuickMode(""); // Clear quick mode

        switch (e.key) {
          case "h":
            window.location.href = "/";
            return;
          case "b":
            window.location.href = "/blog";
            return;
          case "s":
            window.location.href = "/stack";
            return;
        }
      }

      // Vim command mode (:)
      if (e.key === ":") {
        e.preventDefault();
        open();
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close, toggle, quickMode]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    quickMode,
  };
}
