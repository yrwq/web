"use client";

import { useState, useEffect } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { MobileDrawer } from "./MobileDrawer";
import { MobileMenuButton } from "./MobileMenuButton";

interface MobileNavigationProps {
  collections?: Array<{ _id: string | number; title: string }>;
  posts?: Array<{ slug: string; title: string }>;
  navigationStyle?: "bottom" | "drawer" | "clean";
}

export function MobileNavigation({
  collections,
  posts,
  navigationStyle = "clean",
}: MobileNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render on desktop
  if (!isMobile) return null;

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Render based on navigation style
  switch (navigationStyle) {
    case "bottom":
      return (
        <>
          <BottomNavigation
            collections={collections}
            onMenuOpen={handleDrawerOpen}
          />
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={handleDrawerClose}
            collections={collections}
            posts={posts}
          />
        </>
      );

    case "drawer":
      return (
        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          collections={collections}
          posts={posts}
        />
      );

    case "clean":
    default:
      return (
        <>
          {/* Clean bottom navigation without conflicts */}
          <BottomNavigation
            collections={collections}
            onMenuOpen={handleDrawerOpen}
          />

          {/* Top-right menu button */}
          {/* <MobileMenuButton onMenuOpen={handleDrawerOpen} /> */}

          {/* Drawer for full navigation */}
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={handleDrawerClose}
            collections={collections}
            posts={posts}
          />
        </>
      );
  }
}
