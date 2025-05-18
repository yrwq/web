"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useState, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface MagicMainCardProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  icon: React.ReactNode;
  gradientSize?: number;
  gradientOpacity?: number;
}

export function MagicMainCard({
  children,
  className,
  title,
  icon,
  gradientSize = 250,
  gradientOpacity = 0.3,
}: MagicMainCardProps) {
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
  const gradientColor = getCSSVariable("red");

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Pre-create motion templates to avoid conditional hook calls
  const backgroundTemplate = useMotionTemplate`
    radial-gradient(
      500px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 20%
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
      className={cn(
        "group relative transition-all duration-300 hover:scale-[1.005] h-full rounded-md border border-overlay/20 p-[2px] overflow-hidden",
        className,
      )}
    >
      {/* Gradient border */}
      <div className="absolute -inset-[1px] z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientFrom},
                ${gradientTo},
                transparent 80%
              )
            `,
            opacity: gradientOpacity,
          }}
        />
      </div>

      {/* Background + Content */}
      <div className="relative bg-surface rounded-md h-full w-full overflow-hidden">
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: backgroundTemplate,
            opacity: isHovering ? gradientOpacity * 0.7 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Content */}
        <div className="relative p-2 h-full flex flex-col">
          <h1 className="p-2 gap-2 text-foreground flex items-center text-base font-medium">
            {icon}
            {title}
          </h1>
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
