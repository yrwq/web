"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import React, { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.25,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY],
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!e.relatedTarget) {
        document.removeEventListener("mousemove", handleMouseMove);
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
      }
    },
    [handleMouseMove, mouseX, gradientSize, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove);
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [handleMouseMove, mouseX, gradientSize, mouseY]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseOut]);

  useEffect(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className={cn("group relative rounded-[inherit]", className)}
    >
      {/* Gradient border that follows mouse position */}
      <div 
        className="absolute inset-0 rounded-[inherit] z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit] p-px"
          style={{
            background: useMotionTemplate`
              radial-gradient(${gradientSize * 1.5}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom}, 
              ${gradientTo},
              transparent 70%)
            `,
          }}
        />
      </div>
      
      {/* Border to ensure consistent appearance when not hovered */}
      <div className="absolute inset-0 rounded-[inherit] z-0 border border-border/20"></div>
      
      {/* Background gradient effect on hover */}
      <motion.div
        className="absolute inset-0 z-5 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize * 2.5}px circle at ${mouseX}px ${mouseY}px,
            ${gradientColor},
            transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      
      {/* Content container with background (slightly smaller to show border) */}
      <div className="relative z-10 rounded-[inherit] bg-background/90 m-px backdrop-blur-[1px] transition-all duration-500">
        {children}
      </div>
    </div>
  );
}
