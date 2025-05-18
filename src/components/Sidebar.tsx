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
import { useCallback, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

// Button with gradient hover effect for section toggles
function NavButton({
  onClick,
  children,
  icon,
  isOpen,
}: {
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  isOpen?: boolean;
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
      className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden p-2 rounded-md group transition-all duration-300 border ${isOpen ? "border-blue/40" : "border-overlay/20"} hover:scale-[1.01] cursor-pointer ${isOpen ? "bg-highlight-low" : ""}`}
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
      <span className="relative ml-1 flex-1">{children}</span>
      {isOpen !== undefined && (
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

// Navigation menu item with gradient hover effect
function NavItem({
  href,
  children,
  icon,
  isExternal = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isExternal?: boolean;
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
        className="flex items-center text-foreground dark:text-foreground relative overflow-hidden p-2 rounded-md group transition-all duration-300 border border-overlay/20 hover:scale-[1.01]"
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
        <BoxedIcon>{icon}</BoxedIcon>
        <span className="relative ml-1">{children}</span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="p-8 flex relative min-h-screen max-w-[25%] min-w-[25%] flex-col bg-surface shadow-overlay shadow-xl rounded-r-2xl">
      <div className="relative flex">
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
      </div>
      <span className="mt-10 flex gap-8">
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
      </span>

      <div className="mt-6">
        <ThemeSelector />
      </div>

      <div className="mt-4">
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
              className="mt-2 mb-4 border border-overlay/20 rounded-md p-2 overflow-hidden"
            >
              <NavItem href="/" icon={<HomeOutlined />}>
                Home
              </NavItem>

              <NavItem href="/blog" icon={<SquarePen />}>
                Posts
              </NavItem>

              <NavItem href="/blog" icon={<Bookmark />}>
                Bookmarks
              </NavItem>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2">
        <NavButton
          onClick={() => setContactOpen(!contactOpen)}
          icon={<Mail />}
          isOpen={contactOpen}
        >
          Contact
        </NavButton>
      </div>
      <AnimatePresence>
        {contactOpen && (
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
            >
              yrwq
            </NavItem>

            <NavItem
              href="mailto:yrwq_again@proton.me"
              icon={<MailPlus />}
              isExternal
            >
              yrwq_again@proton.me
            </NavItem>

            <NavItem
              href="https://discord.com/users/925056171197464658"
              icon={<DiscordFilled />}
              isExternal
            >
              yrwq_
            </NavItem>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
