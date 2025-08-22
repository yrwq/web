"use client";

import { MDXProvider as BaseMDXProvider } from "@mdx-js/react";
import type React from "react";
import { MDXComponents } from "@/components/mdx/MDXComponents";

interface MDXProviderProps {
	children: React.ReactNode;
}

export function MDXProvider({ children }: MDXProviderProps) {
	return (
		<BaseMDXProvider components={MDXComponents}>{children}</BaseMDXProvider>
	);
}

export default MDXProvider;
