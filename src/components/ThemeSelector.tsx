"use client";

import { useState, useEffect, useRef } from "react";
import {
  PaletteIcon,
  SunMoon,
  Monitor,
  Palette,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import { BoxedIcon } from "./BoxedIcon";
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

// Button with simple hover effect
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
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div
      role="button"
      onClick={onClick}
      ref={itemRef}
      className="flex items-center text-foreground dark:text-foreground relative overflow-hidden p-2 rounded-md group transition-all duration-150 cursor-pointer hover:bg-overlay/30"
    >
      {/* Simple hover effect */}
      <BoxedIcon>{icon}</BoxedIcon>
      <span className="relative ml-1 flex-1">{children}</span>
      {isOpen !== undefined && (
        <span className="ml-2">
          <ChevronDown 
            className={`h-4 w-4 text-subtle transition-transform duration-150 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </span>
      )}
    </div>
  );
}

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Find the current theme
  const getCurrentTheme = () => {
    return themes.find((t) => t.value === theme) || themes[0];
  };

  // Apply CSS for menu animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .theme-menu {
        transition: max-height 0.15s ease-out, opacity 0.15s ease-out;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
      
      .theme-menu.visible {
        max-height: 300px;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Update menu visibility with CSS class
  useEffect(() => {
    if (!menuRef.current) return;
    
    if (showMenu) {
      menuRef.current.classList.add('visible');
    } else {
      menuRef.current.classList.remove('visible');
    }
  }, [showMenu]);

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

      <div ref={menuRef} className="theme-menu p-1.5 bg-surface rounded-md mt-2 mb-4">
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
      </div>
    </div>
  );
}