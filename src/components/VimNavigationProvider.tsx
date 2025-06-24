"use client";

import { useVimNavigation } from "@/hooks/useVimNavigation";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useEffect, useState } from "react";

export function VimNavigationProvider() {
  const [mounted, setMounted] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const vimNavigation = useVimNavigation(); // Always call the hook
  const { quickMode } = useCommandPalette();

  useEffect(() => {
    setMounted(true);

    // Simple debug listener
    const debugKeyHandler = (e: KeyboardEvent) => {
      setLastKey(e.key);
      console.log("Key pressed:", e.key);
    };

    window.addEventListener("keydown", debugKeyHandler);
    return () => window.removeEventListener("keydown", debugKeyHandler);
  }, []);

  // Only render UI when mounted
  if (!mounted) {
    return null;
  }

  const { mode, count, showStatus } = vimNavigation;

  return (
    <>
      {(showStatus || quickMode) && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 9999,
            fontFamily: "monospace",
          }}
        >
          {quickMode ? (
            <>
              <div>Quick mode: {quickMode}</div>
              <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>
                h=home, b=blog, s=stack
              </div>
            </>
          ) : (
            <>
              {mode} {count && `count: ${count}`} {lastKey && `(${lastKey})`}
              <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>
                Press : for commands, g for quick nav
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
