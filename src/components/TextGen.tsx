"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsArray = words.split(" ");
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const spans = containerRef.current.querySelectorAll('span');
    
    spans.forEach((span, index) => {
      // Add CSS transition for smooth effect
      span.style.transition = `opacity ${duration}s ease, filter ${duration}s ease`;
      span.style.transitionDelay = `${index * 0.075}s`;
      
      // Trigger animation after a small delay to ensure CSS is applied
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.filter = filter ? 'blur(0px)' : 'none';
      }, 10);
    });
  }, [duration, filter]);

  return (
    <div className={cn("", className)}>
      <div className="mt-1">
        <div 
          ref={containerRef}
          className="text-foreground leading-snug tracking-wide"
        >
          {wordsArray.map((word, idx) => (
            <span
              key={word + idx}
              className="text-foreground inline-block"
              style={{
                opacity: 0,
                filter: filter ? "blur(4px)" : "none",
              }}
            >
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
