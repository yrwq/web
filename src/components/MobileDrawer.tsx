"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Home,
  Bookmark,
  SquarePen,
  Cog,
  X,
  ChevronRight,
  Mail,
  Palette,
  ExternalLink,
} from "lucide-react";
import { DiscordFilled, GithubFilled } from "@ant-design/icons";
import Link from "next/link";
import clsx from "clsx";
import ThemeSelector from "./ThemeSelector";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collections?: Array<{ _id: string | number; title: string }>;
  posts?: Array<{ slug: string; title: string }>;
}

// Mark as client component prop types
type ClientMobileDrawerProps = Omit<MobileDrawerProps, "onClose"> & {
  onClose: () => void;
};

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  badge?: number;
}

export function MobileDrawer({
  isOpen,
  onClose,
  collections,
  posts,
}: ClientMobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Set up drag constraints
  useEffect(() => {
    if (drawerRef.current) {
      const drawerWidth = drawerRef.current.offsetWidth;
      setDragConstraints({ left: -drawerWidth, right: 0 });
    }
  }, [isOpen]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const shouldClose = info.offset.x < -100 || info.velocity.x < -500;
    if (shouldClose) {
      onClose();
    }
  };

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navSections: NavSection[] = [
    {
      id: "main",
      title: "Navigation",
      items: [
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
          badge: posts?.length,
        },
        {
          id: "stack",
          label: "Stack",
          icon: <Cog size={20} />,
          href: "/stack",
        },
      ],
    },
    {
      id: "bookmarks",
      title: "Bookmarks",
      items:
        collections?.map((collection) => ({
          id: `bookmark-${collection._id}`,
          label: collection.title,
          icon: <Bookmark size={20} />,
          href: `/bookmarks/${collection._id}`,
        })) || [],
    },
    {
      id: "recent-posts",
      title: "Recent Posts",
      items:
        posts?.slice(0, 5).map((post) => ({
          id: `post-${post.slug}`,
          label: post.title,
          icon: <SquarePen size={16} />,
          href: `/blog/${post.slug}`,
        })) || [],
    },
    {
      id: "social",
      title: "Connect",
      items: [
        {
          id: "github",
          label: "GitHub",
          icon: <GithubFilled style={{ fontSize: 20 }} />,
          href: "https://github.com",
          external: true,
        },
        {
          id: "discord",
          label: "Discord",
          icon: <DiscordFilled style={{ fontSize: 20 }} />,
          href: "https://discord.com",
          external: true,
        },
        {
          id: "email",
          label: "Email",
          icon: <Mail size={20} />,
          href: "mailto:contact@example.com",
          external: true,
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-surface border-r border-border z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                <p className="text-sm text-muted-foreground">
                  Navigate your space
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-overlay/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {navSections.map((section) => (
                  <div key={section.id}>
                    {section.items.length > 0 && (
                      <>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => {
                            const isCurrentActive = item.href
                              ? isActive(item.href)
                              : false;

                            if (item.external && item.href) {
                              return (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={onClose}
                                  className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                    "hover:bg-overlay/50 text-muted-foreground hover:text-foreground",
                                  )}
                                >
                                  <div className="flex-shrink-0 text-muted-foreground">
                                    {item.icon}
                                  </div>
                                  <span className="flex-1 font-medium">
                                    {item.label}
                                  </span>
                                  <ExternalLink
                                    size={14}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </Link>
                              );
                            }

                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  if (item.onClick) {
                                    item.onClick();
                                  } else if (item.href) {
                                    handleNavigation(item.href);
                                  }
                                }}
                                className={clsx(
                                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
                                  isCurrentActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-overlay/50 text-muted-foreground hover:text-foreground",
                                )}
                              >
                                <div
                                  className={clsx(
                                    "flex-shrink-0",
                                    isCurrentActive
                                      ? "text-primary"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {item.icon}
                                </div>
                                <span className="flex-1 font-medium truncate">
                                  {item.label}
                                </span>
                                {item.badge && item.badge > 0 && (
                                  <span className="bg-primary/20 text-primary text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                    {item.badge > 99 ? "99+" : item.badge}
                                  </span>
                                )}
                                {!item.external && (
                                  <ChevronRight
                                    size={14}
                                    className={clsx(
                                      "transition-transform duration-200",
                                      isCurrentActive
                                        ? "text-primary"
                                        : "text-muted-foreground opacity-0 group-hover:opacity-100",
                                    )}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Theme Selector */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Appearance
                  </h3>
                  <div className="p-3 rounded-lg bg-overlay/20 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Palette size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Theme
                      </span>
                    </div>
                    <ThemeSelector />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-overlay/20">
              <p className="text-xs text-muted-foreground text-center">
                Swipe left or tap outside to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
