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
      className={cn(
        "group relative transition-all duration-300 hover:scale-[1.005] h-full rounded-md border border-subtle p-[2px] overflow-hidden",
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
                transparent 70%
              )
            `,
          }}
        />
      </div>

      {/* Background + Content */}
      <div className="relative bg-surface rounded-md h-full w-full overflow-hidden">
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor}20,
                transparent 60%
              )
            `,
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
