"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BlogPostProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  excerpt?: string;
  tags?: string[];
}

export function BlogCard({ post }: { post: BlogPostProps }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Card className="p-0 w-full shadow-none border-none transition-all duration-300">
      <MagicCard
        gradientFrom={isLight ? "#0969da" : "#58a6ff"}
        gradientTo={isLight ? "#cf222e" : "#f85149"}
        gradientSize={200}
        gradientOpacity={0.08}
        gradientColor={isLight ? "#0969da10" : "#58a6ff20"}
        className="p-0 overflow-hidden transition-all duration-500 hover:shadow-md rounded-lg"
      >
        <CardHeader className="border-b border-border/30 p-4 [.border-b]:pb-4">
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{`Published on ${post.date}`}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {post.excerpt || post.description}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue hover:text-red transition-colors"
            >
              Read more →
            </Link>
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border/30 [.border-t]:pt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            {post.tags && (
              <span className="flex gap-1">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-highlight-low px-1.5 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </CardFooter>
      </MagicCard>
    </Card>
  );
}
