"use client";
import { BoxedIcon } from "@/components/BoxedIcon";
import ThemeSelector from "@/components/ThemeSelector";
import {
  DiscordFilled,
  GithubFilled,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailPlus,
  Menu,
  SquarePen,
  Palette,
  Folder,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getPosts } from "@/lib/actions";
import clsx from "clsx";
import { usePathname } from "next/navigation"; // Import usePathname

function NavItem({
  href,
  children,
  icon,
  isExternal = false,
  collapsed = false,
  isFolder = false,
  onClick,
  isOpened = false,
  level = 0, // Add level for indentation
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
        "flex items-center relative overflow-hidden rounded transition-colors duration-100 text-foreground hover:bg-overlay/30",
        collapsed ? "w-10 h-10 mx-auto justify-center" : "py-1",
        isFolder ? 'cursor-pointer' : '',
        isActive ? 'bg-overlay' : '' // Apply bg-overlay class if active
      )}
      style={
        collapsed
          ? {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
            }
          : { paddingLeft: `${(level * 12) + 12}px`, paddingRight: '12px' }
      }
      onClick={isFolder ? onClick : undefined} // Only handle click if it's a folder
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
      {!collapsed && <span className="relative text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap ml-4">{children}</span>}

      {/* Chevron for folders (last flex item, only in expanded view) */}
      {!collapsed && isFolder && (
          <ChevronRight size={14} className={`ml-auto text-muted-foreground transition-transform duration-200 ${isOpened ? 'rotate-90' : ''}`} />
      )}
    </div>
  );

  if (isFolder) {
    return (
      <div className={`${collapsed ? "mt-4 block w-10 mx-auto" : "block w-full"} nav-item group`}>
        {content}
      </div>
    );
  } else {
    return (
      <Link
        href={href}
        className={`${collapsed ? "mt-4 block w-10 mx-auto" : "block w-full"} nav-item group`}
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
        : "25%"
    : "76px";

  // Update CSS variables
  document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
  document.documentElement.style.setProperty("--content-margin", sidebarWidth);

  // Update main content layout
  const mainContent = document.querySelector("main");

  if (mainContent instanceof HTMLElement) {
    if (isMobile) {
      if (open) {
        mainContent.style.marginLeft = "0";
        mainContent.style.width = "100%";
      } else {
        mainContent.style.marginLeft = "0";
        mainContent.style.width = "100%";
      }
    } else {
      mainContent.style.marginLeft = sidebarWidth;
      mainContent.style.width = `calc(100% - ${sidebarWidth})`;
      mainContent.style.padding = "1rem";
    }
  }

  // Handle mobile overlay
  const overlay = document.getElementById("sidebar-overlay");
  if (overlay instanceof HTMLElement) {
    overlay.style.opacity = isMobile && open ? "1" : "0";
    overlay.style.pointerEvents = isMobile && open ? "auto" : "none";
  }

  // Toggle mobile menu button visibility
  const mobileToggle = document.getElementById("mobile-sidebar-toggle");
  if (mobileToggle instanceof HTMLElement && isMobile) {
    mobileToggle.style.display = open ? "none" : "flex";
  }

  // Add body scroll lock on mobile when sidebar is open
  if (isMobile) {
    document.body.style.overflow = open ? "hidden" : "";
  }
};

export function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-collapse on mobile
    if (typeof window !== "undefined") {
      return window.innerWidth > 640;
    }
    return true;
  });
  const [activeView, setActiveView] = useState<'navigation' | 'themes' | 'contact'>('navigation'); // 'navigation', 'themes', 'contact'
  const [postsOpen, setPostsOpen] = useState(false); // State for Posts folder
  const [posts, setPosts] = useState<Array<{ slug: string; title: string }>>([]);
  const [bookmarksOpen, setBookmarksOpen] = useState(false); // State for Bookmarks folder
  const [collections, setCollections] = useState<Array<{ _id: string | number; title: string }>>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const pathname = usePathname(); // Get current path

  console.log('Sidebar render:', { sidebarOpen, activeView, postsOpen });

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
        console.error('Error fetching posts:', error);
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
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 15;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        @media (max-width: 640px) {
          .sidebar-toggle-mobile {
            display: flex;
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 25;
            width: 48px;
            height: 48px;
            background-color: var(--color-surface);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

  // Fetch collections client-side
  useEffect(() => {
    const fetchCollections = async () => {
      setCollectionsLoading(true);
      try {
        const res = await fetch("/api/collections");
        if (!res.ok) throw new Error("Failed to fetch collections");
        const data = await res.json();
        setCollections(data);
      } catch (e) {
        setCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };
    if (bookmarksOpen && collections.length === 0 && !collectionsLoading) {
      fetchCollections();
    }
  }, [bookmarksOpen]);

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
        className="hidden sidebar-toggle-mobile cursor-pointer p-2 rounded-full bg-surface border border-overlay/20 shadow-md transition-all items-center justify-center"
        onClick={() => handleToggleSidebar(true)}
      >
        <Menu size={20} />
      </div>

      <div
        className={`sidebar-container flex h-screen ${sidebarOpen ? "w-[var(--sidebar-width,300px)]" : "w-[76px]"} flex-col bg-surface ${!sidebarOpen ? "items-center" : ""} overflow-y-auto fixed top-0 left-0 z-20 custom-sidebar-scroll no-scrollbar`}
        style={{
          padding: sidebarOpen ? "2rem" : "1rem 0",
          boxSizing: "border-box",
        }}
        id="sidebar"
      >
        {/* Header section */}
        {isClient && sidebarOpen && (
          <div className="relative flex w-full items-center justify-center px-2 pb-2 border-b border-overlay/20">
            <div className="flex items-center gap-1">
              {/* Action Icons */}
              <div
                onClick={() => {
                  setActiveView('navigation');
                  console.log('Setting activeView to navigation');
                }}
              >
                <BoxedIcon isActive={activeView === 'navigation'} className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${activeView === 'navigation' ? 'bg-overlay' : ''} hover:bg-overlay`}>
                  <HomeOutlined className="text-base text-foreground" />
                </BoxedIcon>
              </div>
              <div
                onClick={() => {
                  setActiveView('themes');
                  console.log('Setting activeView to themes');
                }}
              >
                <BoxedIcon isActive={activeView === 'themes'} className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${activeView === 'themes' ? 'bg-overlay' : ''} hover:bg-overlay`}>
                  <Palette className="text-base text-foreground" size={18} />
                </BoxedIcon>
              </div>
              <div
                onClick={() => {
                  setActiveView('contact');
                  console.log('Setting activeView to contact');
                }}
              >
                <BoxedIcon isActive={activeView === 'contact'} className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${activeView === 'contact' ? 'bg-overlay' : ''} hover:bg-overlay`}>
                  <Mail className="text-base text-foreground" size={18} /> {/* Using Mail icon */}
                </BoxedIcon>
              </div>
              <div
                onClick={() => handleToggleSidebar(!sidebarOpen)}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <BoxedIcon className="w-9 h-9 cursor-pointer transition-colors duration-150 hover:bg-overlay">
                  <ChevronLeft size={16} className="text-base text-foreground" />
                </BoxedIcon>
              </div>
            </div>
          </div>
        )}

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

        {/* Main content area */}
        <div className={`flex-1 overflow-y-auto ${!sidebarOpen ? 'w-full flex flex-col items-center' : ''}`}>
          {isClient && sidebarOpen && activeView === 'navigation' && (
            <>
              <div className="mt-6 px-2 w-full">
                <div
                  className={`nav-section ${navOpen ? "open" : "closed"} mt-2 mb-4 rounded-md p-0 w-full relative border-0`}
                >
                  <NavItem
                    href="/"
                    icon={<HomeOutlined size={16} />}
                    collapsed={false}
                    level={0}
                    isActive={activeView === 'navigation' && pathname === '/'}
                  >
                    Home
                  </NavItem>
                  <NavItem
                    href="#"
                    icon={postsOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                    collapsed={false}
                    isFolder={true}
                    onClick={() => setPostsOpen(!postsOpen)}
                    isOpened={postsOpen}
                    level={0}
                  >
                    Posts
                  </NavItem>
                  {isClient && sidebarOpen && activeView === 'navigation' && postsOpen && (
                    <div className="ml-4">
                      <NavItem
                        href="/blog"
                        icon={<SquarePen size={16} />}
                        collapsed={false}
                        level={1}
                        isActive={activeView === 'navigation' && pathname === '/blog'}
                      >
                        All Posts
                      </NavItem>
                      {posts.map((post) => (
                        <NavItem
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          icon={<SquarePen size={16} />}
                          collapsed={false}
                          level={1}
                          isActive={activeView === 'navigation' && pathname === `/blog/${post.slug}`}
                        >
                          {post.title}
                        </NavItem>
                      ))}
                    </div>
                  )}
                  <NavItem
                    href="#"
                    icon={<Bookmark size={16} />}
                    collapsed={false}
                    isFolder={true}
                    onClick={() => setBookmarksOpen(!bookmarksOpen)}
                    isOpened={bookmarksOpen}
                    level={0}
                  >
                    Bookmarks
                  </NavItem>
                  {bookmarksOpen && (
                    <div className="ml-4">
                      {collectionsLoading ? (
                        <div className="text-xs text-muted-foreground px-4 py-2">Loading...</div>
                      ) : (
                        collections.map((col) => (
                          <NavItem
                            key={col._id}
                            href={`/bookmarks/${col._id}`}
                            icon={<Bookmark size={14} />}
                            collapsed={false}
                            level={1}
                            isActive={pathname === `/bookmarks/${col._id}`}
                          >
                            {col.title}
                          </NavItem>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

            </>
          )}

          {isClient && sidebarOpen && activeView === 'themes' && (
            <div className="mt-6 px-2 w-full"><ThemeSelector /></div>
          )}

          {isClient && sidebarOpen && activeView === 'contact' && (
            <div className="mt-2 w-full px-2 flex flex-col gap-1"> {/* Corrected typo w-2full to w-full */}
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
          )}
        </div>

      </div>
    </>
  );
}
