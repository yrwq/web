"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  const code = ""; // Temporarily set code to empty string

  const copyToClipboard = async () => {
    try {
      setIsLoading(true);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the theme class based on the current theme
  const getThemeClass = () => {
    const themeMap: Record<string, string> = {
      'gruvbox-dark': 'gruvbox-dark-hard',
      'gruvbox-light': 'gruvbox-light-hard',
      'rose-pine-moon': 'rose-pine-moon',
      'rose-pine-dawn': 'rose-pine-dawn',
      'dark': 'github-dark',
      'light': 'github-light'
    };

    return themeMap[theme] || (resolvedTheme === 'dark' ? 'github-dark' : 'github-light');
  };

  // Format language for display
  const formatLanguage = (lang: string | undefined) => {
    // Handle common language names that might be different from class names
    const languageMap: { [key: string]: string } = {
      js: 'JavaScript',
      ts: 'TypeScript',
      jsx: 'JSX',
      tsx: 'TSX',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      bash: 'Bash',
      markdown: 'Markdown',
      mdx: 'MDX',
      python: 'Python',
      rust: 'Rust',
      go: 'Go',
      shell: 'Shell',
      yaml: 'YAML',
      toml: 'TOML',
      sql: 'SQL',
    };
    return lang ? (languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)) : 'Text';
  };

  // Function to recursively process children and remove className from <code>
  const processChildren = (nodes: React.ReactNode): React.ReactNode => {
    if (!nodes) return null;

    return React.Children.map(nodes, (node) => {
      // Check if the node is a valid React element before accessing properties
      if (React.isValidElement(node)) {
        // If it's a code element, remove the className
        if (node.type === 'code') {
          const { className, ...restProps } = node.props as any;
          return React.cloneElement(node, restProps);
        }

        // If it has children, process them recursively
        if ((node.props as any).children) {
          return React.cloneElement(node, {
            ...(node.props as any),
            children: processChildren((node.props as any).children),
          });
        }

        // Return other elements as is
        return node;
      }
      // Return non-element nodes (strings, numbers, etc.) as is
      return node;
    });
  };

  return (
    <div className={cn('relative my-6 rounded-lg overflow-hidden group', className, getThemeClass())}> {/* Apply original className and theme class here */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface text-foreground text-sm border-b border-border">
        <span className="text-subtle font-medium">{formatLanguage(language)}</span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md hover:bg-overlay transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface"
          title="Copy code"
          disabled={isLoading}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
          ) : (
            <Copy className="w-4 h-4 text-subtle hover:text-foreground transition-colors" aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="relative">
        {/* Add a div for the line number column */}
        <div className="absolute left-0 top-0 w-12 h-full bg-surface/50 border-r border-border" />
        {/* Render the highlighted code directly with necessary padding and overflow */}
        <pre className={cn(
          "bg-base py-4 pl-16 pr-5 overflow-x-auto text-sm font-mono",
          "shiki",
          getThemeClass()
        )}>
          {/* Render processed children */}
          {processChildren(children)}
        </pre>
      </div>
    </div>
  );
}

// Helper component to recursively clean and render code elements - REMOVED
// function CleanCode({ children }: { children: React.ReactNode }) {
// ... existing code ...
// }

export default CodeBlock;