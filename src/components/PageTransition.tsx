'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ 
          opacity: 0,
          scale: 0.98,
          filter: 'blur(8px)',
          y: 10
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0
        }}
        exit={{ 
          opacity: 0,
          scale: 1.02,
          filter: 'blur(8px)',
          y: -10
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          filter: {
            duration: 0.3
          }
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 