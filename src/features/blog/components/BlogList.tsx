import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPosts } from "@/features/blog/api/blogIndex";
import type { BlogPostMeta } from "@/features/blog/types/blog";
import { cn } from "@/lib/utils/cn";

export function BlogList() {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-accent text-xs uppercase tracking-[0.25em]">Posts</h2>
      <ul className="flex flex-col gap-1 list-none overflow-y-auto pr-1">
        {posts.map((post) => (
          <li key={post.slug} className="flex gap-2 items-baseline text-[13px]">
            <Link
              to={`/blog/${post.slug}`}
              className={cn(
                "hover:text-accent hover:underline underline-offset-4 decoration-dotted truncate block leading-tight",
                slug === post.slug ? "text-accent" : "text-foreground"
              )}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
