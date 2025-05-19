"use client";
import Image from "next/image";
import { BoxedIcon } from "@/components/BoxedIcon";
import {
  HeartOutlined,
  DiscordFilled,
  GithubFilled,
  HomeOutlined,
} from "@ant-design/icons";
import { TextGenerateEffect } from "@/components/TextGen";
import {
  ChevronLeft,
  ChevronRight,
  SquarePen,
  Bookmark,
  Mail,
  MailPlus,
  Menu,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSelector from "@/components/ThemeSelector";
import { cn } from "@/lib/utils";

// Button with simple hover effect for section toggles
function NavButton({
  children,
  icon,
  onClick,
  isOpen,
  collapsed = false,
}: {
  children?: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  isOpen?: boolean;
  collapsed?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden ${
        collapsed ? "p-2 w-8 h-8" : "p-2 mb-1"
      } rounded-md border ${
        collapsed ? "border-overlay/10" : "border-overlay/20"
      } cursor-pointer select-none transition-colors duration-150`}
    >
      <BoxedIcon
        noMargin={collapsed}
        className={`${collapsed ? "mx-auto w-6 h-6" : ""}`}
      >
        {icon}
      </BoxedIcon>
      {!collapsed && <span className="relative ml-1 flex-1">{children}</span>}
      {isOpen !== undefined && (
        <span className="relative ml-1">
          <ChevronDown
            size={15}
            className={`rotate-icon ${isOpen ? "down" : ""}`}
          />
        </span>
      )}
    </div>
  );
}

// Navigation menu item with gradient hover effect that supports collapsed mode
// Navigation item with simple hover effects
function NavItem({
  href,
  children,
  icon,
  isExternal = false,
  collapsed = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isExternal?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${collapsed ? "mt-4 block w-10 mx-auto" : "mt-2 block"} nav-item`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <div
        className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden ${
          collapsed ? "p-2 w-10 h-10 mx-auto" : "p-2"
        } rounded-md transition-colors duration-150 border ${
          collapsed
            ? "border-overlay/10"
            : "border-overlay/20 hover:border-blue/30"
        } hover:bg-overlay/30`}
        style={
          collapsed
            ? {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
              }
            : {}
        }
      >
        <BoxedIcon
          noMargin={collapsed}
          className={`${collapsed ? "mx-auto w-10 h-10 flex items-center justify-center bg-overlay shadow-sm rounded-md border-0" : ""}`}
        >
          {icon}
        </BoxedIcon>
        {!collapsed && <span className="relative ml-1">{children}</span>}
      </div>
    </Link>
  );
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

  if (mainContent) {
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
  if (overlay) {
    overlay.style.opacity = isMobile && open ? "1" : "0";
    overlay.style.pointerEvents = isMobile && open ? "auto" : "none";
  }

  // Toggle mobile menu button visibility
  const mobileToggle = document.getElementById("mobile-sidebar-toggle");
  if (mobileToggle && isMobile) {
    mobileToggle.style.display = open ? "none" : "flex";
  }

  // Add body scroll lock on mobile when sidebar is open
  if (isMobile) {
    document.body.style.overflow = open ? "hidden" : "";
  }
};

export function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-collapse on mobile
    if (typeof window !== "undefined") {
      return window.innerWidth > 640;
    }
    return true;
  });

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set initial CSS variables and ensure UI elements load
  useEffect(() => {
    if (!isClient) return;

    toggleSidebar(sidebarOpen);

    // Make sure navigation is open by default
    setNavOpen(true);
  }, [isClient, sidebarOpen]);

  // Function to update state and toggle sidebar
  const handleToggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
    toggleSidebar(open);
  };

  // Add CSS for custom sidebar scrollbar and overlay with improved performance
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        /* Sidebar animations */
        .sidebar-container {
          transition: width 0.15s ease-out;
        }

        .nav-item {
          transition: all 0.15s ease-out;
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
          border-right: 1px solid rgba(0,0,0,0.1);
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
          margin: 0 auto;
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
      if (mobileToggle) {
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
      if (contactOpen) {
        setContactOpen(false);
      }
      if (!navOpen) {
        setNavOpen(true);
      }
    }

    // Apply subtle delay to animations for better visualization
    const navSection = document.querySelector(".nav-section");
    if (navSection) {
      navSection.style.transitionDelay = "50ms";
    }
  }, [sidebarOpen, contactOpen, navOpen, isClient]);

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
        {isClient &&
          (sidebarOpen ? (
            <div className="relative flex w-full">
              <h2 className="flex justify-center items-center">
                <Link href={"/"}>
                  <BoxedIcon>
                    <HeartOutlined />
                  </BoxedIcon>
                </Link>
                yrwq
              </h2>
              <span className="absolute right-0 top-0 flex">
                <div
                  onClick={() => handleToggleSidebar(!sidebarOpen)}
                  title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <BoxedIcon>
                    <ChevronLeft size={16} />
                  </BoxedIcon>
                </div>
              </span>
            </div>
          ) : (
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
          ))}

        {isClient && sidebarOpen && (
          <div className="mt-10 flex gap-8">
            <div className="w-52 drop-shadow-2xl rounded-xl saturate-150 shadow-pine dark:shadow-dark-pine">
              <Image
                alt="me"
                src={"/gun.jpg"}
                width={150}
                height={100}
                className="rounded-xl shadow-2xl drop-shadow-2xl shadow-muted"
                priority
              />
            </div>
            <span className="text-foreground dark:text-foreground">
              <TextGenerateEffect
                words={"hello, im yrwq"}
                className="text-2xl font-bold"
              />
              a designer and engineer based in hungary.
            </span>
          </div>
        )}

        {isClient && sidebarOpen && (
          <div className="mt-6">
            <ThemeSelector />
          </div>
        )}

        <div
          className={`${sidebarOpen ? "mt-4 w-full" : "mt-4 w-full flex flex-col items-center"}`}
        >
          {isClient && sidebarOpen ? (
            <>
              <NavButton
                onClick={() => {
                  setNavOpen(!navOpen);
                }}
                icon={<Menu />}
                isOpen={navOpen}
              >
                Navigation
              </NavButton>

              <div
                className={`nav-section ${navOpen ? "open" : "closed"} mt-2 mb-4 rounded-md p-2 w-full bg-surface relative border-0`}
              >
                <NavItem
                  href="/"
                  icon={<HomeOutlined size={sidebarOpen ? 16 : 20} />}
                  collapsed={false}
                >
                  Home
                </NavItem>

                <NavItem
                  href="/blog"
                  icon={<SquarePen size={sidebarOpen ? 16 : 20} />}
                  collapsed={false}
                >
                  Posts
                </NavItem>

                <NavItem
                  href="/blog"
                  icon={<Bookmark size={sidebarOpen ? 16 : 20} />}
                  collapsed={false}
                >
                  Bookmarks
                </NavItem>
              </div>

              <div className="mt-2 w-full">
                <NavButton
                  onClick={() => {
                    setContactOpen(!contactOpen);
                  }}
                  icon={<Mail />}
                  isOpen={contactOpen}
                >
                  Contact
                </NavButton>
              </div>

              <div
                className={`nav-section ${contactOpen ? "open" : "closed"} mt-2 mb-2 gap-1 flex flex-col rounded-md p-2 overflow-hidden bg-surface relative border-0`}
              >
                <NavItem
                  href="https://github.com/yrwq"
                  icon={<GithubFilled />}
                  isExternal
                  collapsed={!sidebarOpen}
                >
                  yrwq
                </NavItem>

                <NavItem
                  href="mailto:yrwq_again@proton.me"
                  icon={<MailPlus />}
                  isExternal
                  collapsed={!sidebarOpen}
                >
                  yrwq_again@proton.me
                </NavItem>

                <NavItem
                  href="https://discord.com/users/925056171197464658"
                  icon={<DiscordFilled />}
                  isExternal
                  collapsed={!sidebarOpen}
                >
                  yrwq_
                </NavItem>
              </div>
            </>
          ) : isClient ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 w-full">
              <NavItem
                href="/"
                icon={<HomeOutlined size={20} style={{ margin: "0 auto" }} />}
                collapsed={true}
              >
                Home
              </NavItem>

              <NavItem
                href="/blog"
                icon={<SquarePen size={20} style={{ margin: "0 auto" }} />}
                collapsed={true}
              >
                Posts
              </NavItem>

              <NavItem
                href="/blog"
                icon={<Bookmark size={20} style={{ margin: "0 auto" }} />}
                collapsed={true}
              >
                Bookmarks
              </NavItem>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
