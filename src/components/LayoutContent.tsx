"use client";

import { useState, useEffect } from "react";
import { GSAPProvider } from "@/components/GSAPProvider";
import { PageTransition } from "@/components/PageTransition";
import { Sidebar } from "@/components/Sidebar";
import { VimNavigationProvider } from "@/components/VimNavigationProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { getPosts } from "@/lib/actions";

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
      <div className="flex flex-1 h-full">
        <Sidebar collections={collections} />
        <main className="flex-1 min-w-0 h-full">
          <GSAPProvider>
            <PageTransition>{children}</PageTransition>
          </GSAPProvider>
        </main>
      </div>
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
