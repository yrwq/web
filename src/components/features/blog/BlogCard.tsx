"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useState, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface BlogPostProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  excerpt?: string;
  tags?: string[];
}

export function BlogCard({ post }: { post: BlogPostProps }) {
  const { resolvedTheme } = useTheme();

  // Get CSS variables for theme colors
  const getCSSVariable = (name: string): string => {
    if (typeof window === "undefined") {
      return resolvedTheme === "dark" ? "#58a6ff" : "#0969da"; // Default for SSR
    }
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${name}`)
      .trim();
  };

  // Use theme colors for gradients
  const gradientFrom = getCSSVariable("blue");
  const gradientTo = getCSSVariable("red");
  const gradientColor = getCSSVariable("blue");

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Pre-create motion templates to avoid conditional hook calls
  const backgroundTemplate = useMotionTemplate`
    radial-gradient(
      400px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 60%
    )
  `;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative transition-all duration-300 hover:scale-[1.005] rounded-lg border border-overlay/20 p-[2px] overflow-hidden w-full shadow-none"
    >
      {/* Gradient border */}
      <div className="absolute -inset-[1px] z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                250px circle at ${mouseX}px ${mouseY}px,
                ${gradientFrom},
                ${gradientTo},
                transparent 80%
              )
            `,
            opacity: 0.3,
          }}
        />
      </div>

      {/* Background + Content */}
      <div className="relative bg-surface rounded-lg h-full w-full overflow-hidden">
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: backgroundTemplate,
            opacity: isHovering ? 0.2 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col">
          <div className="border-b border-border/30 p-4 pb-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-muted-foreground">{`Published on ${post.date}`}</p>
          </div>
          <div className="p-4 flex-1">
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                {post.excerpt || post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue hover:text-red transition-colors"
              >
                Read more →
              </Link>
            </div>
          </div>
          <div className="p-4 border-t border-border/30 pt-4">
            <div className="flex items-center text-xs text-muted-foreground">
              {post.tags && (
                <span className="flex gap-1">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-highlight-low px-1.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
