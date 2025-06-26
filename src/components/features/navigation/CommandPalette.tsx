"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Search,
  Home,
  Cog,
  Folder,
  Bookmark,
  Mail,
  Github,
  Palette,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  SquarePen,
} from "lucide-react";
import { HomeOutlined, GithubOutlined, DiscordFilled } from "@ant-design/icons";
import clsx from "clsx";
import gsap from "gsap";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category: "navigation" | "actions" | "themes" | "external";
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  collections?: Array<{ _id: string | number; title: string }>;
  posts?: Array<{ slug: string; title: string }>;
  quickMode?: string;
}

export function CommandPalette({
  isOpen,
  onClose,
  collections = [],
  posts = [],
  quickMode = "",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Generate dynamic commands based on current context
  const commands: Command[] = [
    // Navigation - show only if not on current page
    ...(pathname !== "/"
      ? [
          {
            id: "nav-home",
            label: "Go to Home",
            description: "Navigate to the home page",
            icon: <HomeOutlined size={16} />,
            action: () => router.push("/"),
            keywords: ["home", "main", "index"],
            category: "navigation" as const,
          },
        ]
      : []),
    ...(pathname !== "/stack"
      ? [
          {
            id: "nav-stack",
            label: "Go to Stack",
            description: "View my technology stack",
            icon: <Cog size={16} />,
            action: () => router.push("/stack"),
            keywords: ["stack", "tech", "technology", "tools"],
            category: "navigation" as const,
          },
        ]
      : []),
    ...(pathname !== "/blog"
      ? [
          {
            id: "nav-blog",
            label: "Go to Blog",
            description: "View all blog posts",
            icon: <Folder size={16} />,
            action: () => router.push("/blog"),
            keywords: ["blog", "posts", "articles", "writing"],
            category: "navigation" as const,
          },
        ]
      : []),

    // Dynamic blog posts
    ...posts.map((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      description: `Read blog post: ${post.title}`,
      icon: <SquarePen size={16} />,
      action: () => router.push(`/blog/${post.slug}`),
      keywords: ["blog", "post", "article", post.title.toLowerCase()],
      category: "navigation" as const,
    })),

    // Dynamic bookmark collections
    ...collections.map((collection) => ({
      id: `bookmark-${collection._id}`,
      label: collection.title,
      description: `View bookmarks: ${collection.title}`,
      icon: <Bookmark size={16} />,
      action: () => router.push(`/bookmarks/${collection._id}`),
      keywords: ["bookmarks", "collection", collection.title.toLowerCase()],
      category: "navigation" as const,
    })),

    // Theme Actions - only show themes that are not currently active
    ...(theme !== "dark"
      ? [
          {
            id: "theme-dark",
            label: "Switch to Dark Theme",
            description: "Change to dark mode",
            icon: <Moon size={16} />,
            action: () => setTheme("dark"),
            keywords: ["theme", "dark", "night", "mode"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "light"
      ? [
          {
            id: "theme-light",
            label: "Switch to Light Theme",
            description: "Change to light mode",
            icon: <Sun size={16} />,
            action: () => setTheme("light"),
            keywords: ["theme", "light", "day", "mode"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "system"
      ? [
          {
            id: "theme-system",
            label: "Use System Theme",
            description: "Follow system preference",
            icon: <Monitor size={16} />,
            action: () => setTheme("system"),
            keywords: ["theme", "system", "auto", "preference"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "gruvbox-dark"
      ? [
          {
            id: "theme-gruvbox-dark",
            label: "Gruvbox Dark",
            description: "Switch to Gruvbox dark theme",
            icon: <Palette size={16} />,
            action: () => setTheme("gruvbox-dark"),
            keywords: ["theme", "gruvbox", "dark"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "gruvbox-light"
      ? [
          {
            id: "theme-gruvbox-light",
            label: "Gruvbox Light",
            description: "Switch to Gruvbox light theme",
            icon: <Palette size={16} />,
            action: () => setTheme("gruvbox-light"),
            keywords: ["theme", "gruvbox", "light"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "rose-pine-dawn"
      ? [
          {
            id: "theme-rose-pine-dawn",
            label: "Rose Pine Dawn",
            description: "Switch to Rose Pine dawn theme",
            icon: <Palette size={16} />,
            action: () => setTheme("rose-pine-dawn"),
            keywords: ["theme", "rose", "pine", "dawn"],
            category: "themes" as const,
          },
        ]
      : []),
    ...(theme !== "rose-pine-moon"
      ? [
          {
            id: "theme-rose-pine-moon",
            label: "Rose Pine Moon",
            description: "Switch to Rose Pine moon theme",
            icon: <Palette size={16} />,
            action: () => setTheme("rose-pine-moon"),
            keywords: ["theme", "rose", "pine", "moon"],
            category: "themes" as const,
          },
        ]
      : []),

    // Actions
    {
      id: "action-reload",
      label: "Reload Page",
      description: "Refresh the current page",
      icon: <Terminal size={16} />,
      action: () => window.location.reload(),
      keywords: ["reload", "refresh", "restart"],
      category: "actions",
    },
    {
      id: "action-copy-url",
      label: "Copy Current URL",
      description: "Copy the current page URL to clipboard",
      icon: <ExternalLink size={16} />,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      },
      keywords: ["copy", "url", "link", "clipboard"],
      category: "actions",
    },
    {
      id: "action-toggle-sidebar",
      label: "Toggle Sidebar",
      description: "Show or hide the sidebar",
      icon: <Folder size={16} />,
      action: () => {
        const toggleButton = document.querySelector(
          '[title*="sidebar"]',
        ) as HTMLElement;
        if (toggleButton) toggleButton.click();
      },
      keywords: ["sidebar", "toggle", "menu", "navigation"],
      category: "actions",
    },
    {
      id: "action-go-back",
      label: "Go Back",
      description: "Navigate to the previous page",
      icon: <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />,
      action: () => router.back(),
      keywords: ["back", "previous", "history"],
      category: "actions",
    },
    {
      id: "action-go-forward",
      label: "Go Forward",
      description: "Navigate to the next page",
      icon: <ChevronRight size={16} />,
      action: () => router.forward(),
      keywords: ["forward", "next", "history"],
      category: "actions",
    },
    {
      id: "action-print",
      label: "Print Page",
      description: "Print the current page",
      icon: <Terminal size={16} />,
      action: () => window.print(),
      keywords: ["print", "save", "pdf"],
      category: "actions",
    },

    // Quick Shortcuts
    {
      id: "quick-home",
      label: "Quick: Home (gh)",
      description: "Press 'g' then 'h' to go home",
      icon: <HomeOutlined size={16} />,
      action: () => router.push("/"),
      keywords: ["quick", "shortcut", "gh", "home"],
      category: "actions",
    },
    {
      id: "quick-blog",
      label: "Quick: Blog (gb)",
      description: "Press 'g' then 'b' to go to blog",
      icon: <SquarePen size={16} />,
      action: () => router.push("/blog"),
      keywords: ["quick", "shortcut", "gb", "blog"],
      category: "actions",
    },
    {
      id: "quick-stack",
      label: "Quick: Stack (gs)",
      description: "Press 'g' then 's' to go to stack",
      icon: <Cog size={16} />,
      action: () => router.push("/stack"),
      keywords: ["quick", "shortcut", "gs", "stack"],
      category: "actions",
    },

    // External Links
    {
      id: "external-github",
      label: "GitHub Profile",
      description: "View my GitHub profile",
      icon: <GithubOutlined size={16} />,
      action: () => window.open("https://github.com/yrwq", "_blank"),
      keywords: ["github", "code", "repositories", "projects"],
      category: "external",
    },
    {
      id: "external-email",
      label: "Send Email",
      description: "Send me an email",
      icon: <Mail size={16} />,
      action: () => window.open("mailto:yrwq_again@proton.me", "_blank"),
      keywords: ["email", "contact", "mail", "message"],
      category: "external",
    },
    {
      id: "external-discord",
      label: "Discord Profile",
      description: "View my Discord profile",
      icon: <DiscordFilled size={16} />,
      action: () =>
        window.open("https://discord.com/users/925056171197464658", "_blank"),
      keywords: ["discord", "chat", "gaming", "social"],
      category: "external",
    },
  ];

  // Filter commands based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredCommands(commands);
    } else {
      const filtered = commands.filter((command) => {
        const searchTerm = query.toLowerCase();
        return (
          command.label.toLowerCase().includes(searchTerm) ||
          command.description?.toLowerCase().includes(searchTerm) ||
          command.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm),
          )
        );
      });
      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Handle Ctrl+N and Ctrl+P first
      if (e.ctrlKey && (e.key === "n" || e.key === "p")) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "n") {
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
        } else {
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        case "Tab":
          e.preventDefault();
          e.stopPropagation();
          // Tab to next item
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case "Home":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex(filteredCommands.length - 1);
          break;
        case "PageDown":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) =>
            Math.min(prev + 5, filteredCommands.length - 1),
          );
          break;
        case "PageUp":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => Math.max(prev - 5, 0));
          break;
      }
    },
    [isOpen, filteredCommands, selectedIndex, onClose],
  );

  // Focus input when opened and animate
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);

      // Animate in
      const palette = document.querySelector('[data-command-palette="true"]');
      const content = document.querySelector(
        '[data-command-palette="true"] > div',
      );

      if (palette && content) {
        gsap.set(palette, { opacity: 0 });
        gsap.set(content, { y: -20, opacity: 0, scale: 0.95 });

        gsap.to(palette, { opacity: 1, duration: 0.2, ease: "power2.out" });
        gsap.to(content, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.05,
          ease: "power2.out",
        });
      }
    }
  }, [isOpen]);

  // Add keyboard event listener with capture to handle before other elements
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown, true);
      return () => document.removeEventListener("keydown", handleKeyDown, true);
    }
  }, [isOpen, handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && filteredCommands.length > 0) {
      const commandItems = Array.from(
        listRef.current.querySelectorAll('[data-command-item="true"]'),
      );
      const selectedElement = commandItems[selectedIndex] as HTMLElement;

      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, filteredCommands.length]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: Command["category"]) => {
    switch (category) {
      case "navigation":
        return <Home size={14} />;
      case "actions":
        return <Terminal size={14} />;
      case "themes":
        return <Palette size={14} />;
      case "external":
        return <ExternalLink size={14} />;
      default:
        return <ChevronRight size={14} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-all duration-200"
      data-command-palette="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-2xl mx-4">
        <div className="bg-surface border border-border rounded-lg shadow-2xl overflow-hidden ring-1 ring-border/50">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search size={20} className="text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // Handle navigation keys in input
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  handleKeyDown(e.nativeEvent);
                } else if (e.ctrlKey && (e.key === "n" || e.key === "p")) {
                  e.preventDefault();
                  handleKeyDown(e.nativeEvent);
                }
              }}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
            />
            <div className="text-xs text-muted-foreground bg-overlay px-2 py-1 rounded">
              ESC
            </div>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto py-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--color-border) transparent",
            }}
          >
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <div>No commands found for "{query}"</div>
                <div className="text-xs mt-1 opacity-70">
                  Try searching for navigation, themes, or actions
                </div>
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  data-command-item="true"
                  className={clsx(
                    "flex items-center px-4 py-3 cursor-pointer transition-all duration-150 group",
                    index === selectedIndex
                      ? "bg-overlay text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-overlay/50 hover:text-foreground hover:translate-x-1",
                  )}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                >
                  <div
                    className={clsx(
                      "flex items-center justify-center w-8 h-8 rounded-md mr-3 transition-all duration-150",
                      index === selectedIndex
                        ? "bg-overlay/80 shadow-sm"
                        : "bg-overlay/50 group-hover:bg-overlay group-hover:scale-105",
                    )}
                  >
                    {command.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {command.label}
                    </div>
                    {command.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {command.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="text-xs opacity-60">{command.category}</div>
                    {command.category === "external" && (
                      <ExternalLink size={12} className="ml-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border bg-overlay/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    ↑↓
                  </kbd>
                  <span className="ml-1">Navigate</span>
                </div>
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    Ctrl
                  </kbd>
                  <span className="mx-1">+</span>
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    N/P
                  </kbd>
                </div>
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    Tab
                  </kbd>
                  <span className="ml-1">Next</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    ↵
                  </kbd>
                  <span className="ml-1">Select</span>
                </div>
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    Home/End
                  </kbd>
                  <span className="ml-1">First/Last</span>
                </div>
                <div className="flex items-center">
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    PgUp/Dn
                  </kbd>
                  <span className="ml-1">Jump</span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                        Cmd
                      </kbd>
                      <span className="mx-1">+</span>
                      <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                        K
                      </kbd>
                    </div>
                    <span className="text-muted-foreground">or</span>
                    <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                      :
                    </kbd>
                    <span className="ml-1">to open</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                    ESC
                  </kbd>
                  <span className="ml-1">to close</span>
                </div>
                {quickMode && (
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-muted-foreground">Quick mode:</span>
                    <kbd className="bg-overlay px-1.5 py-0.5 rounded text-xs border border-border/50">
                      {quickMode}
                    </kbd>
                    <span className="text-muted-foreground">
                      h=home, b=blog, s=stack
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
