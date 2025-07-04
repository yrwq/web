"use client";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils/utils";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({
  children,
  className,
  language,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [, copy] = useCopyToClipboard();

  // Helper function to recursively extract text content from React elements
  const extractTextContent = (element: any): string => {
    if (typeof element === "string" || typeof element === "number") {
      return String(element);
    }

    if (React.isValidElement(element)) {
      if (element.props.children) {
        return React.Children.toArray(element.props.children)
          .map(extractTextContent)
          .join("");
      }
    }

    if (Array.isArray(element)) {
      return element.map(extractTextContent).join("");
    }

    return "";
  };

  const copyToClipboard = async () => {
    try {
      setIsLoading(true);
      const code = React.Children.toArray(children)
        .filter((child) => React.isValidElement(child) && child.type === "code")
        .map((child) => {
          const codeElement = child as React.ReactElement;
          return extractTextContent(codeElement.props.children);
        })
        .join("\n");

      await copy(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the theme class based on the current theme
  const getThemeClass = () => {
    const themeMap: Record<string, string> = {
      "gruvbox-dark": "gruvbox-dark-hard",
      "gruvbox-light": "gruvbox-light-hard",
      "rose-pine-moon": "rose-pine-moon",
      "rose-pine-dawn": "rose-pine-dawn",
      dark: "github-dark",
      light: "github-light",
    };

    return (
      themeMap[theme] ||
      (resolvedTheme === "dark" ? "github-dark" : "github-light")
    );
  };

  // Format language for display
  const formatLanguage = (lang: string | undefined) => {
    if (!lang) return "text";

    // Convert to lowercase first
    const lowercaseLang = lang.toLowerCase();

    // Handle common language names that might be different from class names
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      ts: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      html: "html",
      css: "css",
      json: "json",
      bash: "bash",
      markdown: "markdown",
      mdx: "mdx",
      python: "python",
      rust: "rust",
      go: "go",
      shell: "shell",
      yaml: "yaml",
      toml: "toml",
      sql: "sql",
    };

    return languageMap[lowercaseLang] || lowercaseLang;
  };

  return (
    <div
      className={cn(
        "relative my-6 rounded-lg overflow-hidden group max-w-fit",
        className,
        getThemeClass(),
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-surface text-foreground text-sm border-b border-border">
        <span className="text-subtle font-medium">
          {formatLanguage(language)}
        </span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="p-1.5 rounded-md hover:bg-overlay transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface"
          title="Copy code"
          disabled={isLoading}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
          ) : (
            <Copy
              className="w-4 h-4 text-subtle hover:text-foreground transition-colors"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      <div className="relative bg-surface p-4">
        <pre
          className={cn(
            "py-4 overflow-x-auto text-sm font-mono",
            "shiki",
            getThemeClass(),
          )}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
