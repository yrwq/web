"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useRef } from "react";
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
  const gradientFrom = resolvedTheme === "dark" ? "#58a6ff" : "#0969da";
  const gradientTo = resolvedTheme === "dark" ? "#f85149" : "#cf222e";
  const gradientColor = resolvedTheme === "dark" ? "#58a6ff" : "#0969da";

  // For CSS variable
  const gradientRgb = resolvedTheme === "dark" ? "88, 166, 255" : "9, 105, 218";

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--card-spotlight-color': gradientRgb
      } as React.CSSProperties}
      className={cn(
        "group relative transition-all duration-300 hover:scale-[1.005] border border-overlay/20 rounded-md h-full",
        className
      )}
    >
      {/* Gradient border container */}
      <div className="absolute -inset-[0.5px] rounded-md overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                500px circle at ${mouseX}px ${mouseY}px,
                ${gradientFrom},
                ${gradientTo},
                transparent 75%
              )
            `,
          }}
        />
      </div>

      {/* Inner container with background and content */}
      <div className="relative rounded-[5px] m-[1px] bg-surface overflow-hidden h-full">
        {/* Gradient background that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor}25,
                transparent 60%
              )
            `,
          }}
        />

        {/* Content container */}
        <div className="relative p-2 transition-all duration-300 group-hover:shadow-md h-full flex flex-col">
          <h1 className="p-2 gap-2 text-foreground flex items-center text-base font-medium">
            {icon}
            {title}
          </h1>
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
