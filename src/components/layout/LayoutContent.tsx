"use client";

import { useState, useEffect } from "react";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import { PageTransition } from "@/components/features/PageTransition";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { VimNavigationProvider } from "@/components/features/navigation/VimNavigationProvider";
import { CommandPalette } from "@/components/features/navigation/CommandPalette";
import { useCommandPalette } from "@/hooks/ui/useCommandPalette";
import { getPosts } from "@/lib/utils/actions";

interface LayoutContentProps {
  children: React.ReactNode;
  collections: Array<{ _id: string | number; title: string }>;
}

export function LayoutContent({ children, collections }: LayoutContentProps) {
  const { isOpen, close, quickMode } = useCommandPalette();
  const [posts, setPosts] = useState<Array<{ slug: string; title: string }>>(
    [],
  );

  // Fetch posts for command palette
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts for command palette:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 h-full">
        <main className="flex-1 min-w-0 h-full">
          <GSAPProvider>
            <PageTransition>{children}</PageTransition>
          </GSAPProvider>
        </main>
      </div>

      {/* Mobile Layout */}
      <main className="md:hidden w-full h-full">
        <GSAPProvider>
          <PageTransition>{children}</PageTransition>
        </GSAPProvider>
      </main>

      <MobileNavigation
        collections={collections}
        posts={posts}
        navigationStyle="clean"
      />
      <VimNavigationProvider />
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        collections={collections}
        posts={posts}
        quickMode={quickMode}
      />
    </>
  );
}
