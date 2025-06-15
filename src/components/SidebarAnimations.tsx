"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SidebarAnimations({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("SidebarAnimations mounted");
    if (!sidebarRef.current || !contentRef.current) {
      console.log("Refs not ready");
      return;
    }

    // Initial animation for navigation items
    const navItems = contentRef.current.querySelectorAll(".nav-item");
    console.log("Found nav items:", navItems.length);

    if (navItems.length > 0) {
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
        onStart: () => console.log("Animation started"),
        onComplete: () => console.log("Animation completed"),
      });
    }

    // Initial animation for theme selector buttons
    const themeButtons = contentRef.current.querySelectorAll("button");
    console.log("Found theme buttons:", themeButtons.length);

    if (themeButtons.length > 0) {
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
    }

    // Animation for folder expansion
    const handleFolderClick = (e: Event) => {
      console.log("Folder clicked");
      const target = e.target as HTMLElement;
      const folder = target.closest(".nav-item");
      if (!folder) {
        console.log("No folder found");
        return;
      }

      const content = folder.nextElementSibling as HTMLElement;
      if (!content) {
        console.log("No content found");
        return;
      }

      const isOpen = content.classList.contains("open");
      console.log("Folder is open:", isOpen);

      if (isOpen) {
        const items = content.querySelectorAll(".nav-item");
        console.log("Closing items:", items.length);
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
            console.log("Folder closed");
          },
        });
      } else {
        content.classList.remove("closed");
        content.classList.add("open");
        const items = content.querySelectorAll(".nav-item");
        console.log("Opening items:", items.length);
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
            onComplete: () => console.log("Folder opened"),
          }
        );
      }
    };

    // Add click listener for folders
    const folders = contentRef.current.querySelectorAll(
      ".nav-item[data-folder='true']"
    );
    console.log("Found folders:", folders.length);

    folders.forEach((folder) => {
      folder.addEventListener("click", handleFolderClick as EventListener);
    });

    return () => {
      folders.forEach((folder) => {
        folder.removeEventListener("click", handleFolderClick as EventListener);
      });
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
