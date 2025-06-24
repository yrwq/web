"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Bookmark, SquarePen, Cog, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface BottomNavigationProps {
  collections?: Array<{ _id: string | number; title: string }>;
  onMenuOpen?: () => void;
}

export function BottomNavigation({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [collections, setCollections] = useState<any[]>([]);

  const mainNavItems: NavigationItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={20} />,
      href: "/",
    },
    {
      id: "blog",
      label: "Blog",
      icon: <SquarePen size={20} />,
      href: "/blog",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <Bookmark size={20} />,
      href: "/bookmarks",
      badge: collections?.length,
    },
    {
      id: "stack",
      label: "Stack",
      icon: <Cog size={20} />,
      href: "/stack",
    },
  ];

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 10 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (lastScrollY > currentScrollY + 10) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY]);

  useEffect(() => {
    async function fetchCollections() {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        setCollections(await res.json());
      }
    }
    fetchCollections();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border/50 z-30 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={clsx(
                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive(item.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-overlay/50",
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {/* {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )} */}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}

          {/* More Button */}
          <button
            onClick={() => onMenuOpen?.()}
            className={clsx(
              "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
              "text-muted-foreground hover:text-foreground hover:bg-overlay/50",
            )}
          >
            <Menu size={20} />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </motion.nav>
    </>
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
