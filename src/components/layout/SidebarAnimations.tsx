"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export function SidebarAnimations({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure refs are available
    if (!sidebarRef.current || !contentRef.current) {
      return;
    }

    // Initial animation for navigation items
    const navItems = contentRef.current.querySelectorAll(".nav-item");

    if (navItems.length > 0) {
      try {
        // Set initial state
        gsap.set(navItems, {
          opacity: 0,
          x: -30,
          scale: 0.95,
          height: "auto",
        });

        // Animate to final state
        const tl = gsap.timeline();
        tl.to(navItems, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
        });
      } catch (error) {
        console.error("Error animating nav items:", error);
      }
    }

    // Initial animation for theme selector buttons
    const themeButtons = contentRef.current.querySelectorAll("button");

    if (themeButtons.length > 0) {
      try {
        // Set initial state
        gsap.set(themeButtons, {
          opacity: 0,
          y: 20,
          scale: 0.9,
        });

        // Animate to final state
        gsap.to(themeButtons, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        });
      } catch (error) {
        console.error("Error animating theme buttons:", error);
      }
    }

    // Animation for folder expansion
    const handleFolderClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const folder = target.closest(".nav-item");
      if (!folder) {
        return;
      }

      const content = folder.nextElementSibling as HTMLElement;
      if (!content) {
        return;
      }

      const isOpen = content.classList.contains("open");

      try {
        if (isOpen) {
          const items = content.querySelectorAll(".nav-item");
          if (items.length > 0) {
            gsap.to(items, {
              opacity: 0,
              height: 0,
              scale: 0.95,
              duration: 0.3,
              stagger: 0.03,
              ease: "power2.in",
              onComplete: () => {
                content.classList.remove("open");
                content.classList.add("closed");
              },
            });
          }
        } else {
          content.classList.remove("closed");
          content.classList.add("open");
          const items = content.querySelectorAll(".nav-item");
          if (items.length > 0) {
            gsap.fromTo(
              items,
              {
                opacity: 0,
                height: 0,
                scale: 0.95,
              },
              {
                opacity: 1,
                height: "auto",
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: "back.out(1.7)",
              },
            );
          }
        }
      } catch (error) {
        console.error("Error animating folder:", error);
      }
    };

    // Add click listener for folders
    const folders = contentRef.current.querySelectorAll(
      ".nav-item[data-folder='true']",
    );

    // Add event listeners
    const folderArray = Array.from(folders);
    for (const folder of folderArray) {
      folder.addEventListener("click", handleFolderClick as EventListener);
    }

    return () => {
      // Remove event listeners
      for (const folder of folderArray) {
        folder.removeEventListener("click", handleFolderClick as EventListener);
      }
    };
  }, []);

  return (
    <div ref={sidebarRef} className="sidebar-container">
      <div ref={contentRef} className="sidebar-content">
        {children}
      </div>
    </div>
  );
}
