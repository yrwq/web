"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  // Get the code content for copying by recursively traversing children
  const getCodeContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getCodeContent).join('');
    if (React.isValidElement(node) && node.props.children) {
      return getCodeContent(node.props.children);
    }
    return '';
  };

  const code = getCodeContent(children);

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
    if (theme === 'gruvbox-dark-hard') {
      return 'gruvbox-dark-hard';
    }
    if (theme === 'gruvbox-light-hard') {
      return 'gruvbox-light-hard';
    }
    return resolvedTheme === 'dark' ? 'dark' : 'light';
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
        <pre className={cn("bg-base text-foreground py-4 pl-16 pr-5 overflow-x-auto text-sm font-mono", "shiki", getThemeClass())}> {/* Apply shiki and theme classes here */}
           {children}
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;