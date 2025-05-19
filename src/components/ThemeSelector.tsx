"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PaletteIcon,
  SunMoon,
  Monitor,
  Palette,
  Moon,
  Plus,
  Minus,
} from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import { BoxedIcon } from "./BoxedIcon";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

// Simple flat list of themes
const themes = [
  {
    name: "System",
    value: "system" as Theme,
    icon: <Monitor className="h-3.5 w-3.5 mr-2" />,
    colors: ["#ffffff", "#0d1117", "#0969da", "#58a6ff"],
  },
  {
    name: "Dark",
    value: "dark" as Theme,
    icon: <Moon className="h-3.5 w-3.5 mr-2" />,
    colors: ["#0d1117", "#c9d1d9", "#58a6ff", "#f85149"],
  },
  {
    name: "Light",
    value: "light" as Theme,
    icon: <SunMoon className="h-3.5 w-3.5 mr-2" />,
    colors: ["#ffffff", "#24292f", "#0969da", "#cf222e"],
  },
  {
    name: "Gruvbox Light",
    value: "gruvbox-light" as Theme,
    icon: <Palette className="h-3.5 w-3.5 mr-2" />,
    colors: ["#fbf1c7", "#3c3836", "#076678", "#9d0006"],
  },
  {
    name: "Gruvbox Dark",
    value: "gruvbox-dark" as Theme,
    icon: <Palette className="h-3.5 w-3.5 mr-2" />,
    colors: ["#1d2021", "#ebdbb2", "#83a598", "#fb4934"],
  },
  {
    name: "Rose Pine Dawn",
    value: "rose-pine-dawn" as Theme,
    icon: <Palette className="h-3.5 w-3.5 mr-2" />,
    colors: ["#faf4ed", "#575279", "#907aa9", "#b4637a"],
  },
  {
    name: "Rose Pine Moon",
    value: "rose-pine-moon" as Theme,
    icon: <Palette className="h-3.5 w-3.5 mr-2" />,
    colors: ["#232136", "#e0def4", "#c4a7e7", "#eb6f92"],
  },
];

// Button with gradient hover effect
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
      className={`flex items-center text-foreground dark:text-foreground relative overflow-hidden p-2 rounded-md group transition-all duration-300 ${isOpen ? "" : ""} hover:scale-[1.01] cursor-pointer ${isOpen ? "" : ""}`}
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
          opacity: isHovering || !!isOpen ? gradientOpacity * 0.0 : 0,
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

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [initialRender, setInitialRender] = useState(true);

  // Find the current theme
  const getCurrentTheme = () => {
    return themes.find((t) => t.value === theme) || themes[0];
  };

  // Apply extra theme class
  useEffect(() => {
    // Skip first render to prevent flashing during hydration
    if (initialRender) {
      setInitialRender(false);
      return;
    }

    // Remove existing extra theme classes
    const htmlClasses = document.documentElement.classList;
    const themeClasses = Array.from(htmlClasses).filter((cls) =>
      [
        "gruvbox-light",
        "gruvbox-dark",
        "rose-pine-dawn",
        "rose-pine-moon",
      ].includes(cls),
    );

    themeClasses.forEach((cls) => htmlClasses.remove(cls));

    // Apply the theme class if it's a custom theme
    if (theme !== "light" && theme !== "dark" && theme !== "system") {
      document.documentElement.classList.add(theme);
    }
  }, [theme, initialRender]);

  return (
    <div className="">
      <div className="flex items-center justify-between text-foreground rounded-md w-full relative">
        <div className="w-full">
          <NavButton
            onClick={() => setShowMenu(!showMenu)}
            icon={<PaletteIcon />}
            isOpen={showMenu}
          >
            <span>Themes</span>
          </NavButton>
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-1.5 bg-surface rounded-md mt-2 mb-4 overflow-hidden"
          >
            <div className="space-y-1">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center w-full p-2 text-sm rounded-md transition-colors duration-150
                  ${theme === t.value ? "bg-highlight-med text-foreground font-medium" : "hover:bg-highlight-low"}`}
                >
                  <span className="flex items-center flex-1">
                    {t.icon}
                    <span className="mr-2 flex gap-0.5">
                      {t.colors?.map((color, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    {t.name}
                  </span>
                  {theme === t.value && (
                    <span className="h-2 w-2 rounded-full bg-foreground"></span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
