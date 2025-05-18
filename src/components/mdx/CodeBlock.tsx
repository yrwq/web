import React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div className={cn('relative my-6 rounded-lg overflow-hidden', className)}>
      <div className="bg-slate-900 text-slate-50 py-4 px-5 overflow-x-auto text-sm">
        {children}
      </div>
    </div>
  );
}

export default CodeBlock;