"use client";
import { BoxedIcon } from "@/components/BoxedIcon";
import ThemeSelector from "@/components/ThemeSelector";
import { DiscordFilled, GithubFilled, HomeOutlined } from "@ant-design/icons";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Cog,
  Mail,
  MailPlus,
  Menu,
  SquarePen,
  Palette,
  Folder,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { getPosts } from "@/lib/actions";
import clsx from "clsx";
import { usePathname } from "next/navigation"; // Import usePathname
import { SidebarAnimations } from "./SidebarAnimations";
import { useTheme } from "./ThemeProvider";
import gsap from "gsap";

function NavItem({
  href,
  children,
  icon,
  isExternal = false,
  collapsed = false,
  isFolder = false,
  onClick,
  isOpened = false,
  level = 0,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isExternal?: boolean;
  collapsed?: boolean;
  isFolder?: boolean;
  onClick?: () => void;
  isOpened?: boolean;
  level?: number;
  isActive?: boolean;
}) {
  // NavItem can now also render as a div if it's a folder to prevent link navigation
  const content = (
    <div
      className={clsx(
        "flex items-center relative overflow-hidden rounded transition-colors duration-100 text-foreground",
        collapsed ? "w-10 h-10 mx-auto justify-center" : "py-1",
        isFolder ? "cursor-pointer" : "",
        isActive ? "bg-overlay" : "hover:bg-overlay/30", // Only apply hover effect if not active
      )}
      style={
        collapsed
          ? {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
            }
          : { paddingLeft: `${level * 12 + 12}px`, paddingRight: "12px" }
      }
      onClick={isFolder ? onClick : undefined} // Only handle click if it's a folder
      data-folder={isFolder ? "true" : undefined}
    >
      {/* Tree lines */}
      {!collapsed && level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-4 flex items-center">
          <div className="w-4 h-px bg-border" />
        </div>
      )}

      {/* BoxedIcon (second flex item) */}
      <BoxedIcon
        noMargin={true} // Ensure no default margin from BoxedIcon
        className="w-6 h-6 flex-shrink-0 bg-transparent" // Set background of icon to transparent
      >
        {icon}
      </BoxedIcon>

      {/* Text span (third flex item) */}
      {!collapsed && (
        <span className="relative text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap ml-4">
          {children}
        </span>
      )}

      {/* Chevron for folders (last flex item, only in expanded view) */}
      {!collapsed && isFolder && (
        <ChevronRight
          size={14}
          className={`ml-auto text-muted-foreground transition-transform duration-200 ${
            isOpened ? "rotate-90" : ""
          }`}
        />
      )}
    </div>
  );

  if (isFolder) {
    return (
      <div
        className={`${
          collapsed ? "mt-4 block w-10 mx-auto" : "block w-full"
        } nav-item group`}
        data-folder="true"
      >
        {content}
      </div>
    );
  } else {
    return (
      <Link
        href={href}
        className={`${
          collapsed ? "mt-4 block w-10 mx-auto" : "block w-full"
        } nav-item group`}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </Link>
    );
  }
}

// Function to update CSS variables and layout
const toggleSidebar = (open: boolean) => {
  // Skip calculations if window isn't available yet
  if (typeof window === "undefined") return;

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 640;
  const isTablet = window.innerWidth <= 768 && window.innerWidth > 640;

  // Calculate width based on screen size and state
  const sidebarWidth = open
    ? isMobile
      ? "85%"
      : isTablet
        ? "250px"
        : "280px"
    : "60px";

  // Calculate exact pixel width for margin calculations
  const sidebarWidthPx = open
    ? isMobile
      ? window.innerWidth * 0.85
      : isTablet
        ? 250
        : 280
    : 60;

  // Update CSS variables
  document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
  document.documentElement.style.setProperty("--content-margin", sidebarWidth);

  // Update main content layout - target both main and PageTransition container
  const mainElement = document.querySelector("main");
  const pageTransition = document.querySelector(".page-transition");

  if (mainElement instanceof HTMLElement) {
    if (isMobile) {
      if (open) {
        // When sidebar is open on mobile, keep main element in place
        mainElement.style.marginLeft = "0";
        mainElement.style.width = "100%";
      } else {
        mainElement.style.marginLeft = "0";
        mainElement.style.width = "100%";
      }
    } else {
      // Desktop behavior - no margin since sidebar is fixed positioned
      mainElement.style.marginLeft = "0";
      mainElement.style.width = "100%";
      mainElement.style.paddingLeft = `${sidebarWidthPx}px`;
    }
  }

  // Additional handling for page transition container
  if (pageTransition instanceof HTMLElement) {
    if (isMobile && open) {
      // On mobile when sidebar is open, prevent interaction with content
      pageTransition.style.pointerEvents = "none";
    } else {
      pageTransition.style.pointerEvents = "auto";
    }
  }

  // Handle mobile overlay and content dimming
  const overlay = document.getElementById("sidebar-overlay");
  if (overlay instanceof HTMLElement) {
    overlay.style.opacity = isMobile && open ? "1" : "0";
    overlay.style.pointerEvents = isMobile && open ? "auto" : "none";
  }

  // Add/remove sidebar-open class to page-transition for mobile styling
  if (pageTransition instanceof HTMLElement && isMobile) {
    if (open) {
      pageTransition.classList.add("sidebar-open");
    } else {
      pageTransition.classList.remove("sidebar-open");
    }
  }

  // Toggle mobile menu button visibility
  const mobileToggle = document.getElementById("mobile-sidebar-toggle");
  if (mobileToggle instanceof HTMLElement && isMobile) {
    mobileToggle.style.display = open ? "none" : "flex";
  }

  // Add body scroll lock on mobile when sidebar is open
  if (isMobile) {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("sidebar-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("sidebar-open");
    }
  }
};

export function Sidebar({
  collections: initialCollections,
}: {
  collections: Array<{ _id: string | number; title: string }>;
}) {
  const [navOpen, setNavOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-collapse on mobile
    if (typeof window !== "undefined") {
      return window.innerWidth > 640;
    }
    return true;
  });
  const [activeView, setActiveView] = useState<
    "navigation" | "themes" | "contact"
  >("navigation"); // 'navigation', 'themes', 'contact'
  const [postsOpen, setPostsOpen] = useState(false); // State for Posts folder
  const [posts, setPosts] = useState<Array<{ slug: string; title: string }>>(
    [],
  );
  const [bookmarksOpen, setBookmarksOpen] = useState(false); // State for Bookmarks folder
  const [collections, setCollections] =
    useState<Array<{ _id: string | number; title: string }>>(
      initialCollections,
    );
  const pathname = usePathname(); // Get current path
  const { theme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  console.log("Sidebar render:", { sidebarOpen, activeView, postsOpen });

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Set initial CSS variables and ensure UI elements load
  useEffect(() => {
    if (!isClient) return;

    toggleSidebar(sidebarOpen);

    // Make sure navigation is open by default
    setNavOpen(true);
  }, [isClient, sidebarOpen]);

  // Function to update state and toggle sidebar
  const handleToggleSidebar = useCallback((open: boolean) => {
    setSidebarOpen(open);
    toggleSidebar(open);
  }, []);

  // Add CSS for custom sidebar scrollbar and overlay with improved performance
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        /* Sidebar animations */
        .sidebar-container {
          transition: width 0.15s ease-out;
          background-color: var(--color-surface);
          border-right: 1px solid var(--color-border);
        }

        /* Desktop layout fixes */
        @media (min-width: 641px) {
          main {
            transition: padding-left 0.3s ease-out;
            margin-left: 0 !important;
            width: 100% !important;
            overflow: visible !important;
          }

          /* Ensure no gap between sidebar and content */
          .flex.flex-1.h-full {
            gap: 0;
          }
        }

        .nav-item {
          transition: all 0.15s ease-out;
          position: relative;
        }

        .nav-item:hover {
          background-color: var(--color-overlay);
        }

        .nav-item.active {
          background-color: var(--color-overlay);
        }

        .nav-section {
          overflow: hidden;
          transition: max-height 0.15s ease-out, opacity 0.15s ease-out, margin 0.15s ease-out, padding 0.15s ease-out;
        }

        .nav-section.closed {
          max-height: 0;
          opacity: 0;
          margin: 0 !important;
          padding: 0 !important;
          pointer-events: none;
        }

        .nav-section.open {
          max-height: 500px;
          opacity: 1;
        }

        .rotate-icon {
          transition: transform 0.15s ease-out;
        }

        .rotate-icon.down {
          transform: rotate(180deg);
        }

        .nav-item .w-6.h-6 { /* Adjusted selector for new icon size */
          color: var(--color-muted-foreground);
        }

        .nav-item:hover .w-6.h-6 { /* Adjusted selector for new icon size */
          color: var(--color-foreground);
        }

        .nav-item.active .w-6.h-6 { /* Adjusted selector for new icon size */
          color: var(--color-foreground);
        }

        /* Ensure icon background is transparent in active nav items */
        .nav-item.active .boxed-icon {
            background-color: transparent !important;
            box-shadow: none !important; /* Also remove box shadow if any */
        }

        /* Tree lines */
        .nav-item .bg-border {
          background-color: var(--color-border);
        }

        /* Theme selector overrides */
        .theme-menu {
          transition: max-height 0.15s ease-out, opacity 0.15s ease-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .theme-menu.visible {
          max-height: 300px;
          opacity: 1;
        }

        /* Hide all scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          display: none;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: transparent;
          display: none;
        }
        .custom-sidebar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          border-right: 1px solid var(--color-border);
        }

        /* Fix icon alignment when sidebar is collapsed */
        .custom-sidebar-scroll.items-center .flex,
        .custom-sidebar-scroll.items-center a div,
        .custom-sidebar-scroll.items-center div,
        .custom-sidebar-scroll.items-center a {
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
          width: 100% !important;
          margin: 0 auto !important;
        }

        /* Additional fixes for collapsed icons */
        .custom-sidebar-scroll.items-center svg {
          display: block;
          margin: 0 auto;
        }

        /* Final override for BoxedIcon in collapsed sidebar */
        .custom-sidebar-scroll.items-center .w-8 {
          margin: 0 auto;
          width: 2rem !important;
          height: 2rem !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Fix for collapsed sidebar items */
        .custom-sidebar-scroll.items-center a {
          display: block;
          text-align: center;
          margin: 8px auto;
        }

        /* Center icons in collapsed view */
        .custom-sidebar-scroll.items-center div[class*="p-2"] {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }

        /* Collapsed sidebar navigation icons styling */
        .custom-sidebar-scroll.items-center a {
          margin: 1rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          font-weight: 600;
        }

        .custom-sidebar-scroll.items-center a:hover {
        }

        .custom-sidebar-scroll.items-center a svg {
          color: var(--color-muted-foreground, var(--color-foreground));
        }

        .custom-sidebar-scroll.items-center a:hover svg {
          color: var(--color-muted-foreground, var(--color-foreground));
        }

        /* Fix for icons in collapsed sidebar */
        .custom-sidebar-scroll.items-center .flex .w-8.h-8 {
          border-radius: 8px;
        }

        /* Additional styling for collapsed nav items */
        .custom-sidebar-scroll.items-center .w-10.h-10 {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          background-color: var(--color-overlay);
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10;
          width: 2.5rem !important;
          height: 2.5rem !important;
        }

        .custom-sidebar-scroll.items-center a:hover .w-10.h-10 {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 49;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        @media (max-width: 640px) {
          .sidebar-toggle-mobile {
            display: flex;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 51;
            width: 52px;
            height: 52px;
            background-color: var(--color-surface);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            border: 1px solid var(--color-border);
          }

          .sidebar-toggle-mobile:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          }

          .sidebar-toggle-mobile:active {
            transform: scale(0.95);
          }

          /* Ensure content doesn't overlap with sidebar on mobile and has proper z-index */
          .page-transition {
            transition: all 0.3s ease-out;
            position: relative;
            z-index: 1;
          }

          /* When sidebar is open on mobile, dim the content */
          .page-transition.sidebar-open {
            filter: brightness(0.3);
            pointer-events: none;
          }

          /* Prevent body scroll when sidebar is open on mobile */
          body.sidebar-open {
            overflow: hidden;
          }

          /* Mobile-specific sidebar styling */
          .sidebar-container {
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          /* Ensure page content uses full available space */
          .page-transition {
            min-height: 100vh;
            width: 100%;
          }

          .page-transition .w-full {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
          }

          /* Override bento-grid max-width */
          .grid {
            max-width: none !important;
            margin: 0 !important;
            width: 100% !important;
          }

          /* Desktop specific - ensure content fills available space */
          @media (min-width: 641px) {
            .page-transition {
              margin-left: 0;
              width: 100%;
              overflow-y: auto;
              height: 100vh;
            }
          }
        }
      `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update sidebar width when sidebarOpen changes
  useEffect(() => {
    if (!isClient) return;
    toggleSidebar(sidebarOpen);
  }, [sidebarOpen, isClient]);

  // Initialize CSS variables and handle resize
  useEffect(() => {
    if (!isClient) return;

    // Set initial sidebar width based on current state
    toggleSidebar(sidebarOpen);

    // Add listener for window resize events
    const handleResize = () => {
      const isMobile = window.innerWidth <= 640;

      // Auto-collapse sidebar on mobile
      if (isMobile && sidebarOpen) {
        handleToggleSidebar(false);
      } else {
        // Update CSS variables on resize
        toggleSidebar(sidebarOpen);
      }
    };

    // Make sure mobile toggle is visible on mobile
    if (window.innerWidth <= 640) {
      const mobileToggle = document.getElementById("mobile-sidebar-toggle");
      if (mobileToggle instanceof HTMLElement) {
        mobileToggle.style.display = "flex";
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sidebarOpen, isClient, handleToggleSidebar]);

  // Set navigation to always be open and close contact section when sidebar is closed
  useEffect(() => {
    if (!isClient) return;

    // Close contact section when sidebar is closed
    if (!sidebarOpen) {
      if (!navOpen) {
        setNavOpen(true);
      }
    }

    // Apply subtle delay to animations for better visualization
    const navSection = document.querySelector(".nav-section");
    if (navSection instanceof HTMLElement) {
      navSection.style.transitionDelay = "50ms";
    }
  }, [sidebarOpen, navOpen, isClient]);

  // Add animation for sidebar toggle
  useEffect(() => {
    if (!sidebarRef.current || !isClient) return;

    // Skip animation on initial load, but allow it for subsequent toggles
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const sidebar = sidebarRef.current;
    const content = sidebar.querySelector(".sidebar-content");

    if (sidebarOpen) {
      // Opening animation
      gsap.fromTo(
        sidebar,
        {
          width: "60px",
          opacity: 0.8,
        },
        {
          width: "280px",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
      );

      // Animate content
      gsap.fromTo(
        content,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out",
        },
      );
    } else {
      // Closing animation
      gsap.to(sidebar, {
        width: "60px",
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.in",
      });

      // Animate content
      gsap.to(content, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [sidebarOpen, isClient, isInitialLoad]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        id="sidebar-overlay"
        className="sidebar-overlay"
        onClick={() => handleToggleSidebar(false)}
      />

      {/* Floating mobile toggle button */}
      <div
        id="mobile-sidebar-toggle"
        className="hidden sidebar-toggle-mobile cursor-pointer p-3 rounded-full bg-surface border border-overlay/20 shadow-lg transition-all items-center justify-center hover:scale-105 active:scale-95"
        onClick={() => handleToggleSidebar(true)}
      >
        <Menu size={20} className="text-foreground" />
      </div>

      <div
        ref={sidebarRef}
        className={`sidebar-container fixed top-0 left-0 h-screen pt-5 bg-surface border-r border-border transition-all duration-300 z-50 ${
          sidebarOpen ? "w-[85%] sm:w-[280px]" : "w-[60px]"
        }`}
      >
        {/* Header section */}
        {isClient && sidebarOpen && (
          <div className="relative flex w-full items-center justify-center px-2 pb-2 border-b border-overlay/20">
            <div className="flex items-center gap-1">
              {/* Action Icons */}
              <div
                onClick={() => {
                  setActiveView("navigation");
                  console.log("Setting activeView to navigation");
                }}
              >
                <BoxedIcon
                  isActive={activeView === "navigation"}
                  className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${
                    activeView === "navigation" ? "bg-overlay" : ""
                  } hover:bg-overlay`}
                >
                  <HomeOutlined className="text-base text-foreground" />
                </BoxedIcon>
              </div>
              <div
                onClick={() => {
                  setActiveView("themes");
                  console.log("Setting activeView to themes");
                }}
              >
                <BoxedIcon
                  isActive={activeView === "themes"}
                  className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${
                    activeView === "themes" ? "bg-overlay" : ""
                  } hover:bg-overlay`}
                >
                  <Palette className="text-base text-foreground" size={18} />
                </BoxedIcon>
              </div>
              <div
                onClick={() => {
                  setActiveView("contact");
                  console.log("Setting activeView to contact");
                }}
              >
                <BoxedIcon
                  isActive={activeView === "contact"}
                  className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${
                    activeView === "contact" ? "bg-overlay" : ""
                  } hover:bg-overlay`}
                >
                  <Mail className="text-base text-foreground" size={18} />{" "}
                  {/* Using Mail icon */}
                </BoxedIcon>
              </div>
              <div
                onClick={() => handleToggleSidebar(!sidebarOpen)}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <BoxedIcon className="w-9 h-9 cursor-pointer transition-colors duration-150 hover:bg-overlay">
                  <ChevronLeft
                    size={16}
                    className="text-base text-foreground"
                  />
                </BoxedIcon>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {isClient && sidebarOpen && activeView === "navigation" && (
            <SidebarAnimations>
              <div className="px-2 w-full">
                <div className="flex flex-col gap-1">
                  <NavItem
                    href="/"
                    icon={<HomeOutlined size={16} />}
                    collapsed={!sidebarOpen}
                    level={0}
                    isActive={activeView === "navigation" && pathname === "/"}
                  >
                    Home
                  </NavItem>
                  <NavItem
                    href="/stack"
                    icon={<Cog size={16} />}
                    collapsed={!sidebarOpen}
                    level={0}
                    isActive={
                      activeView === "navigation" && pathname === "/stack"
                    }
                  >
                    Stack
                  </NavItem>
                  <NavItem
                    href="#"
                    icon={
                      postsOpen ? (
                        <FolderOpen size={16} />
                      ) : (
                        <Folder size={16} />
                      )
                    }
                    collapsed={!sidebarOpen}
                    isFolder={true}
                    onClick={() => setPostsOpen(!postsOpen)}
                    isOpened={postsOpen}
                    level={0}
                  >
                    Posts
                  </NavItem>
                  {isClient && sidebarOpen && postsOpen && (
                    <div className="ml-4">
                      <NavItem
                        href="/blog"
                        icon={<SquarePen size={16} />}
                        collapsed={!sidebarOpen}
                        level={1}
                        isActive={
                          activeView === "navigation" && pathname === "/blog"
                        }
                      >
                        all posts
                      </NavItem>
                      {posts.map((post) => (
                        <NavItem
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          icon={<SquarePen size={16} />}
                          collapsed={!sidebarOpen}
                          level={1}
                          isActive={
                            activeView === "navigation" &&
                            pathname === `/blog/${post.slug}`
                          }
                        >
                          {post.title}
                        </NavItem>
                      ))}
                    </div>
                  )}
                  <NavItem
                    href="#"
                    icon={<Bookmark size={16} />}
                    collapsed={!sidebarOpen}
                    isFolder={true}
                    onClick={() => setBookmarksOpen(!bookmarksOpen)}
                    isOpened={bookmarksOpen}
                    level={0}
                  >
                    Bookmarks
                  </NavItem>
                  {bookmarksOpen && (
                    <div className="ml-4">
                      {collections.map((col) => (
                        <NavItem
                          key={col._id}
                          href={`/bookmarks/${col._id}`}
                          icon={<Bookmark size={14} />}
                          collapsed={!sidebarOpen}
                          level={1}
                          isActive={pathname === `/bookmarks/${col._id}`}
                        >
                          {col.title}
                        </NavItem>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SidebarAnimations>
          )}

          {isClient && sidebarOpen && activeView === "themes" && (
            <SidebarAnimations>
              <div className="px-2 w-full">
                <ThemeSelector />
              </div>
            </SidebarAnimations>
          )}

          {isClient && sidebarOpen && activeView === "contact" && (
            <SidebarAnimations>
              <div className="px-2 w-full flex flex-col gap-1">
                <NavItem
                  href="https://github.com/yrwq"
                  icon={<GithubFilled />}
                  isExternal
                  collapsed={!sidebarOpen}
                  isActive={false}
                >
                  yrwq
                </NavItem>
                <NavItem
                  href="mailto:yrwq_again@proton.me"
                  icon={<MailPlus />}
                  isExternal
                  collapsed={!sidebarOpen}
                  isActive={false}
                >
                  yrwq_again@proton.me
                </NavItem>
                <NavItem
                  href="https://discord.com/users/925056171197464658"
                  icon={<DiscordFilled />}
                  isExternal
                  collapsed={!sidebarOpen}
                  isActive={false}
                >
                  yrwq_
                </NavItem>
              </div>
            </SidebarAnimations>
          )}
        </div>

        {/* Collapsed sidebar toggle */}
        {isClient && !sidebarOpen && (
          <div className="mb-4 flex flex-col items-center">
            <div
              onClick={() => handleToggleSidebar(!sidebarOpen)}
              title="Expand sidebar"
              className="mt-6 mb-12 relative group cursor-pointer"
            >
              <button className="relative flex items-center justify-center w-10 h-10 bg-overlay shadow-sm rounded-md border border-overlay/10 transition-all duration-200">
                <ChevronRight
                  size={18}
                  className="transition-transform duration-200 relative z-10 text-muted-foreground"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
