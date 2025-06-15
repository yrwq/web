"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // Initial animation for the main content
    gsap.fromTo(
      mainRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    // Theme transition animation
    const handleThemeChange = () => {
      gsap
        .timeline()
        .to(mainRef.current, {
          filter: "blur(8px)",
          duration: 0.1,
          ease: "power2.in",
        })
        .to(mainRef.current, {
          filter: "blur(0px)",
          duration: 0.1,
          ease: "power2.out",
        });
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className="overflow-auto h-screen no-overlap no-scrollbar"
      style={{ padding: "1rem", boxSizing: "border-box" }}
    >
      {children}
    </main>
  );
}
