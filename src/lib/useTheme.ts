import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  // Use state to track both the user's preference and the actual applied theme
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize on mount, check localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')) {
      setTheme(storedTheme as Theme);
    }

    // Initial calculation of the resolved theme
    updateResolvedTheme(storedTheme as Theme || 'system');
  }, []);

  // Update resolved theme based on current theme setting and system preference
  const updateResolvedTheme = (currentTheme: Theme) => {
    if (currentTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      return systemTheme;
    } else {
      setResolvedTheme(currentTheme as 'light' | 'dark');
      return currentTheme as 'light' | 'dark';
    }
  };

  // Effect to watch for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
        
        // Update the document
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Effect to apply theme to document
  useEffect(() => {
    const newResolvedTheme = updateResolvedTheme(theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newResolvedTheme);
  }, [theme]);

  // Function to set theme preference
  const setThemePreference = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemePreference,
  };
}