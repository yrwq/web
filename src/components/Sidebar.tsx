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
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Cog,
  Mail,
  MailPlus,
  Menu,
  Palette,
  Plus,
  Minus,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import ThemeSelector from "@/components/ThemeSelector";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

// Button with gradient hover effect for section toggles
function NavButton({
  onClick,
  children,
  icon,
  isOpen,
  collapsed = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  isOpen?: boolean;
  collapsed?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const itemRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Get CSS variables for theme colors
  const getCSSVariable = (name: string): string => {
    if (typeof window === "undefined") {
      return resolvedTheme === "dark" ? "#58a6ff" : "#0969da"; // Default for SSR
    }
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${name}`)
      .trim();
  };

  // Make sure the main content doesn't overlap with the sidebar
  if (typeof window !== "undefined") {
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.style.marginLeft = "25%";
      mainContent.style.width = "calc(100% - 25%)";
    }
  }

  const gradientFrom = getCSSVariable("blue");
  const gradientTo = getCSSVariable("red");
  const gradientColor = getCSSVariable("blue");
  const gradientOpacity = 0.4;

  // Pre-create motion templates to avoid conditional hook calls
  const backgroundTemplate = useMotionTemplate`
    radial-gradient(
      150px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      transparent 80%
    )
  `;

  const borderTemplate = useMotionTemplate`
    radial-gradient(
      200px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      transparent 85%
    )
  `;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      role="button"
      onClick={onClick}
      ref={itemRef}
      className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden ${collapsed ? "p-2 justify-center w-12 h-12 mx-auto" : "p-2"} rounded-md group transition-all duration-300 ${isOpen ? "border-0 bg-surface" : "border border-overlay/20 hover:border-blue/30"} hover cursor-pointer hover:bg-overlay/30`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient border */}
      <div className="absolute -inset-[1px] z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: borderTemplate,
            opacity: isHovering ? gradientOpacity : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: backgroundTemplate,
          opacity: isHovering ? gradientOpacity * 0.7 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <BoxedIcon
        noMargin={collapsed}
        className={`${collapsed ? "mx-auto w-6 h-6" : ""}`}
      >
        {icon}
      </BoxedIcon>
      {!collapsed && children && (
        <span className="relative ml-1 flex-1">{children}</span>
      )}
      {isOpen !== undefined && !collapsed && (
        <span className="ml-2">
          {isOpen ? (
            <Minus className="h-5 w-5 text-subtle" />
          ) : (
            <Plus className="h-5 w-5 text-subtle" />
          )}
        </span>
      )}
    </div>
  );
}

// Navigation menu item with gradient hover effect that supports collapsed mode
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
  // Add styles for collapsed mode directly within the component
  const { resolvedTheme } = useTheme();
  const itemRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Get CSS variables for theme colors
  const getCSSVariable = (name: string): string => {
    if (typeof window === "undefined") {
      return resolvedTheme === "dark" ? "#58a6ff" : "#0969da"; // Default for SSR
    }
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${name}`)
      .trim();
  };

  const gradientFrom = getCSSVariable("blue");
  const gradientTo = getCSSVariable("red");
  const gradientColor = getCSSVariable("blue");
  const gradientOpacity = 0.25;

  // Pre-create motion templates to avoid conditional hook calls
  const backgroundTemplate = useMotionTemplate`
    radial-gradient(
      120px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 80%
    )
  `;

  const borderTemplate = useMotionTemplate`
    radial-gradient(
      180px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      transparent 80%
    )
  `;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <Link
      href={href}
      className={`${collapsed ? "mt-4 block w-10 mx-auto" : "mt-2 block"}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <div
        ref={itemRef}
        className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden ${collapsed ? "p-2 w-10 h-10 mx-auto" : "p-2"} rounded-md group transition-all duration-300 border ${collapsed ? "border-overlay/10" : "border-overlay/20 hover:border-blue/30"} hover:bg-overlay/30`}
        onMouseEnter={collapsed ? undefined : handleMouseEnter}
        onMouseMove={collapsed ? undefined : handleMouseMove}
        onMouseLeave={collapsed ? undefined : handleMouseLeave}
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
        {/* Gradient border - always shown for non-collapsed items */}
        {!collapsed && (
          <div className="absolute -inset-[1px] z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background: borderTemplate,
                opacity: isHovering ? gradientOpacity : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Background gradient effect - always shown for non-collapsed items */}
        {!collapsed && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
            style={{
              background: backgroundTemplate,
              opacity: isHovering ? gradientOpacity * 0.7 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}
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
      mainContent.style.marginLeft = "0";
      mainContent.style.width = "100%";
      mainContent.style.padding = "1rem";
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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-collapse on mobile
    if (typeof window !== "undefined") {
      return window.innerWidth > 640;
    }
    return true;
  });

  // Set initial CSS variables
  useEffect(() => {
    toggleSidebar(sidebarOpen);
  }, []);

  // Function to update state and toggle sidebar
  const handleToggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
    toggleSidebar(open);
  };

  // Add CSS for custom sidebar scrollbar and overlay
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: var(--color-muted);
          border-radius: 20px;
        }
        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--color-muted) transparent;
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
                  transform: none !important;
                }
                
                .custom-sidebar-scroll.items-center a:hover {
                  transform: none !important;
                }

               @keyframes gradient-x {
                 0% { background-position: 0% 50%; }
                 50% { background-position: 100% 50%; }
                 100% { background-position: 0% 50%; }
               }
               
               @keyframes gradient-shift {
                 0% { background: linear-gradient(90deg, var(--color-blue) 0%, var(--color-purple) 50%, var(--color-red) 100%); }
                 50% { background: linear-gradient(90deg, var(--color-red) 0%, var(--color-blue) 50%, var(--color-purple) 100%); }
                 100% { background: linear-gradient(90deg, var(--color-purple) 0%, var(--color-red) 50%, var(--color-blue) 100%); }
               }


               @keyframes subtle-bounce {
                 0%, 100% { transform: translateY(0); }
                 50% { transform: translateY(-2px); }
               }
               
               .animate-gradient-x {
                 background-size: 200% 200%;
                 animation: none;
                 background-image: none;
               }

               .animate-glow {
                 animation: none;
               }
               
               .animate-subtle-bounce {
                 animation: none;
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
                                transform: none !important;
                              }
                              
                              .custom-sidebar-scroll.items-center a:hover .w-10.h-10 {
                                transform: none !important;
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
          transition: opacity 0.3s ease;
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

  // Update document with CSS variables for the sidebar width
  useEffect(() => {
    toggleSidebar(sidebarOpen);
  }, [sidebarOpen]);

  // Initialize CSS variables and handle resize
  useEffect(() => {
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
    if (typeof window !== "undefined" && window.innerWidth <= 640) {
      setTimeout(() => {
        const mobileToggle = document.getElementById("mobile-sidebar-toggle");
        if (mobileToggle) {
          mobileToggle.style.display = "flex";
        }
      }, 100);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sidebarOpen]);

  // Set navigation to always be open and close contact section when sidebar is closed
  useEffect(() => {
    if (!sidebarOpen) {
      if (contactOpen) {
        setContactOpen(false);
      }
      if (!navOpen) {
        setNavOpen(true);
      }
    }
  }, [sidebarOpen, contactOpen, navOpen, setNavOpen]);

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
        className={`transition-all duration-300 ease-in-out flex h-screen ${sidebarOpen ? "w-[var(--sidebar-width,25%)]" : "w-[76px]"} flex-col bg-surface ${!sidebarOpen ? "items-center" : ""} overflow-y-auto fixed top-0 left-0 z-20 custom-sidebar-scroll`}
        style={{
          padding: sidebarOpen ? "2rem" : "1rem 0",
          boxSizing: "border-box",
        }}
        id="sidebar"
      >
        {/* Header section */}
        {sidebarOpen ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex w-full"
            >
              <h2 className="flex justify-center items-center">
                <Link href={"/"}>
                  <BoxedIcon>
                    <HeartOutlined />
                  </BoxedIcon>
                </Link>
                yrwq
              </h2>
              <span className="absolute right-0 top-0 flex">
                <a
                  href="https://discord.com/users/925056171197464658"
                  target="_blank"
                >
                  <BoxedIcon>
                    <DiscordFilled />
                  </BoxedIcon>
                </a>
                <a href="https://github.com/yrwq" target="_blank">
                  <BoxedIcon>
                    <GithubFilled />
                  </BoxedIcon>
                </a>
                <div
                  onClick={() => handleToggleSidebar(!sidebarOpen)}
                  title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <BoxedIcon>
                    <ChevronLeft size={16} />
                  </BoxedIcon>
                </div>
              </span>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="mb-4 flex flex-col items-center">
            <div 
              onClick={() => handleToggleSidebar(!sidebarOpen)} 
              title="Expand sidebar" 
              className="mt-6 mb-12 relative group cursor-pointer"
            >
              <button className="relative flex items-center justify-center w-10 h-10 bg-overlay shadow-sm rounded-md border border-overlay/10 transition-all duration-300 ease-in-out">
                <ChevronRight
                  size={18}
                  className="transition-all duration-300 relative z-10 text-muted-foreground"
                />
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex gap-8"
            >
              <div className="w-52 drop-shadow-2xl rounded-xl saturate-150 shadow-pine dark:shadow-dark-pine">
                <Image
                  alt="me"
                  src={"/gun.jpg"}
                  width={150}
                  height={100}
                  className="rounded-xl shadow-2xl drop-shadow-2xl shadow-muted"
                />
              </div>
              <span className="text-foreground dark:text-foreground">
                <TextGenerateEffect
                  words={"hello, im yrwq"}
                  className="text-2xl font-bold"
                />
                <TextGenerateEffect
                  words={" a designer and engineer based in hungary. "}
                  className=""
                />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <ThemeSelector />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`${sidebarOpen ? "mt-4 w-full" : "mt-4 w-full flex flex-col items-center"}`}
        >
          {sidebarOpen ? (
            <>
              <NavButton
                onClick={() => {
                  setNavOpen(!navOpen);
                  // Ensure layout updates after state change
                  setTimeout(() => handleToggleSidebar(sidebarOpen), 0);
                }}
                icon={<Menu />}
                isOpen={navOpen}
              >
                Navigation
              </NavButton>

              <AnimatePresence>
                {navOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 mb-4 rounded-md p-2 overflow-hidden w-full bg-surface relative border-0"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
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
          )}
        </div>

        {sidebarOpen && (
          <div className="mt-2 w-full">
            <NavButton
              onClick={() => {
                setContactOpen(!contactOpen);
                // Ensure layout updates after state change
                setTimeout(() => handleToggleSidebar(sidebarOpen), 0);
              }}
              icon={<Mail />}
              isOpen={contactOpen}
            >
              Contact
            </NavButton>
          </div>
        )}

        <AnimatePresence>
          {contactOpen && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 mb-2 gap-1 flex flex-col rounded-md p-2 overflow-hidden bg-surface relative border-0"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
