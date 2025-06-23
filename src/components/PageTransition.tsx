"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Initial state
    gsap.set(contentRef.current, {
      filter: "blur(10px)",
      scale: 0.98,
    });

    // Smooth pop-in animation
    gsap.to(contentRef.current, {
      filter: "blur(0px)",
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [pathname]);

  return (
    <div
      ref={contentRef}
      className="page-transition w-full h-full overflow-y-auto"
    >
      {children}
    </div>
  );
}
