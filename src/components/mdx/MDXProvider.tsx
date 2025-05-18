'use client';

import { MDXComponents } from '@/components/mdx/MDXComponents';
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';
import React from 'react';

interface MDXProviderProps {
  children: React.ReactNode;
}

export function MDXProvider({ children }: MDXProviderProps) {
  return (
    <BaseMDXProvider components={MDXComponents}>
      {children}
    </BaseMDXProvider>
  );
}

export default MDXProvider;