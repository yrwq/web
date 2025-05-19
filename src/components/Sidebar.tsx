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
    <div
      role="button"
      onClick={onClick}
      ref={itemRef}
      className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden p-2 rounded-md group transition-all duration-300 border ${isOpen ? "border-blue/40" : "border-overlay/20"} hover:scale-[1.01] cursor-pointer ${isOpen ? "bg-highlight-low" : ""} ${collapsed ? "justify-center" : ""}`}
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
            opacity: isHovering || !!isOpen ? gradientOpacity : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {/* Background gradient effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: backgroundTemplate,
          opacity: isHovering || !!isOpen ? gradientOpacity * 0.7 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
        <BoxedIcon>{icon}</BoxedIcon>
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
      className="mt-2 block"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <div
        ref={itemRef}
        className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden ${collapsed ? "p-1.5 justify-center" : "p-2"} rounded-md group transition-all duration-300 border border-overlay/20 hover:scale-[1.01] ${collapsed ? "mx-auto" : ""}`}
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
        <BoxedIcon noMargin={collapsed}>{icon}</BoxedIcon>
        {!collapsed && <span className="relative ml-1">{children}</span>}
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div
    className={`transition-all duration-500 ease-in-out flex relative min-h-screen ${sidebarOpen ? "p-8 max-w-[25%] min-w-[25%]" : "p-1 max-w-[80px] min-w-[80px]"} flex-col bg-surface shadow-overlay shadow-xl rounded-r-2xl ${!sidebarOpen ? "items-center" : ""}`}
  >
      <div
        className="absolute right-0 top-96 -mr-3 z-10 cursor-pointer p-1.5 rounded-full bg-surface border border-overlay/20 shadow-md hover:scale-110 transition-all hover:border-blue/40 flex items-center justify-center"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex"
          >
            <h2 className="flex justify-center items-center">
              <Link href={"/"}>
                <BoxedIcon>
                  <HeartOutlined />
                </BoxedIcon>
              </Link>
              yrwq
            </h2>
            <span className="absolute right-1 flex">
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
        className={`${sidebarOpen ? "mt-4 w-full" : "mt-16 w-full flex flex-col items-center justify-center"}`}
      >
        {sidebarOpen && (
          <>
            <NavButton
              onClick={() => setNavOpen(!navOpen)}
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
                  className="mt-2 mb-4 border border-overlay/20 rounded-md p-2 overflow-hidden w-full"
                >
                  <NavItem href="/" icon={<HomeOutlined />} collapsed={false}>
                    Home
                  </NavItem>

                  <NavItem href="/blog" icon={<SquarePen />} collapsed={false}>
                    Posts
                  </NavItem>

                  <NavItem href="/blog" icon={<Bookmark />} collapsed={false}>
                    Bookmarks
                  </NavItem>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {!sidebarOpen && (
          <div className="flex flex-col items-center space-y-1.5 mb-4 w-full">
            <NavItem href="/" icon={<HomeOutlined />} collapsed={true}>
              Home
            </NavItem>

            <NavItem href="/blog" icon={<SquarePen />} collapsed={true}>
              Posts
            </NavItem>

            <NavItem href="/blog" icon={<Bookmark />} collapsed={true}>
              Bookmarks
            </NavItem>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div className="mt-2 w-full">
          <NavButton
            onClick={() => setContactOpen(!contactOpen)}
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
            className="mt-2 mb-2 gap-1 flex flex-col border border-overlay/20 rounded-md p-2 overflow-hidden"
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
  );
}
