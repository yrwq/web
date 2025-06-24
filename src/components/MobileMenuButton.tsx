"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onMenuOpen?: () => void;
}

export function MobileMenuButton({ onMenuOpen }: MobileMenuButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 15 && currentScrollY > 200) {
        setIsVisible(false);
      } else if (lastScrollY > currentScrollY + 15) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY]);

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 500 }}
      onClick={() => onMenuOpen?.()}
      className="fixed top-6 right-6 w-12 h-12 bg-surface/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg flex items-center justify-center text-foreground hover:bg-overlay/50 transition-colors z-50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      aria-label="Open navigation menu"
    >
      <Menu size={20} />
    </motion.button>
  );
}

// Utility function
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId === null) {
      func(...args);
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, delay);
    }
  };
}
