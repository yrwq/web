"use client";

import { useState, useRef, useEffect } from "react";
import { PaletteIcon, ChevronDown, Check, SunMoon, Monitor, Palette, Moon } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";

// Themes definition with categories and color swatches
const themes = [
  { 
    category: 'Default',
    themes: [
      { name: 'Dark', value: 'dark' as Theme, icon: <Moon className="h-3.5 w-3.5 mr-2" />, colors: ['#0d1117', '#c9d1d9', '#58a6ff', '#f85149'] },
      { name: 'Light', value: 'light' as Theme, icon: <SunMoon className="h-3.5 w-3.5 mr-2" />, colors: ['#ffffff', '#24292f', '#0969da', '#cf222e'] },
      { name: 'System', value: 'system' as Theme, icon: <Monitor className="h-3.5 w-3.5 mr-2" />, colors: ['#ffffff', '#0d1117', '#0969da', '#58a6ff'] },
    ]
  },
  {
    category: 'Gruvbox',
    themes: [
      { name: 'Gruvbox Light', value: 'gruvbox-light' as Theme, icon: <Palette className="h-3.5 w-3.5 mr-2" />, colors: ['#fbf1c7', '#3c3836', '#076678', '#9d0006'] },
      { name: 'Gruvbox Dark', value: 'gruvbox-dark' as Theme, icon: <Palette className="h-3.5 w-3.5 mr-2" />, colors: ['#1d2021', '#ebdbb2', '#83a598', '#fb4934'] },
    ]
  },
  {
    category: 'Rose Pine',
    themes: [
      { name: 'Rose Pine Dawn', value: 'rose-pine-dawn' as Theme, icon: <Palette className="h-3.5 w-3.5 mr-2" />, colors: ['#faf4ed', '#575279', '#907aa9', '#b4637a'] },
      { name: 'Rose Pine Moon', value: 'rose-pine-moon' as Theme, icon: <Palette className="h-3.5 w-3.5 mr-2" />, colors: ['#232136', '#e0def4', '#c4a7e7', '#eb6f92'] },
    ]
  }
];

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [initialRender, setInitialRender] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the current theme name for display
  const getDisplayName = () => {
    // Search through all categories for the theme
    for (const category of themes) {
      const found = category.themes.find(t => t.value === theme);
      if (found) return found.name;
    }
    return "Unknown";
  };
  
  // Find the current theme icon
  const getThemeIcon = () => {
    // Search through all categories for the theme
    for (const category of themes) {
      const found = category.themes.find(t => t.value === theme);
      if (found) return found.icon;
    }
    return <PaletteIcon className="h-4 w-4" />;
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
    const themeClasses = Array.from(htmlClasses).filter(cls => 
      ['gruvbox-light', 'gruvbox-dark', 'rose-pine-dawn', 'rose-pine-moon'].includes(cls)
    );
    
    themeClasses.forEach(cls => htmlClasses.remove(cls));
    
    // Apply the theme class if it's a custom theme
    if (theme !== "light" && theme !== "dark" && theme !== "system") {
      document.documentElement.classList.add(theme);
    }
  }, [theme, initialRender]);

  // Handle theme preview
  useEffect(() => {
    // Skip preview on first render to prevent flashing
    if (!previewTheme || initialRender) return;

    const prevClasses = document.documentElement.className;
    
    // Remove existing theme classes temporarily
    const htmlClasses = document.documentElement.classList;
    const themeClasses = Array.from(htmlClasses).filter(cls => 
      ['light', 'dark', 'gruvbox-light', 'gruvbox-dark', 'rose-pine-dawn', 'rose-pine-moon'].includes(cls)
    );
    
    themeClasses.forEach(cls => htmlClasses.remove(cls));
    
    // Add preview theme class
    if (previewTheme === 'light' || previewTheme === 'dark') {
      document.documentElement.classList.add(previewTheme);
      document.documentElement.style.colorScheme = previewTheme;
    } else {
      // Add both the custom theme and light/dark class
      document.documentElement.classList.add(previewTheme);
      if (['gruvbox-light', 'rose-pine-dawn'].includes(previewTheme)) {
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      }
    }
    
    // Cleanup function to restore original theme
    return () => {
      document.documentElement.className = prevClasses;
    };
  }, [previewTheme]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 flex items-center justify-between bg-surface hover:bg-muted text-foreground transition-colors duration-300 rounded-md w-full"
        aria-label="Select theme"
      >
        <div className="flex items-center gap-2">
          {getThemeIcon()}
          <span className="text-sm">Theme: {getDisplayName()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute left-0 right-0 mt-1 p-1 bg-surface border border-highlight-med rounded-md shadow-lg z-50">
          <div className="max-h-64 overflow-auto">
            {themes.map((category, categoryIndex) => (
              <div key={category.category}>
                {categoryIndex > 0 && (
                  <div className="mx-2 my-1 border-t border-highlight-med"></div>
                )}
                
                <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">
                  {category.category}
                </div>
                
                {category.themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setPreviewTheme(t.value)}
                    onMouseLeave={() => setPreviewTheme(null)}
                    className="flex items-center justify-between w-full p-2 text-sm rounded-md hover:bg-highlight-low transition-colors duration-200"
                  >
                    <span className="flex items-center">
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
                    {theme === t.value && <Check className="h-4 w-4 text-green" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}