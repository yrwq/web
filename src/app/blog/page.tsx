import { getAllBlogPosts } from "@/lib/mdx/utils";
import { BlogCard } from "@/components/BlogCard";

export const metadata = {
  title: "blog@yrwq",
  description: "Read my thoughts on programming, design, and more",
};

export default async function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="flex flex-col justify-center items-center gap-6 my-8" style={{padding: 0, margin: 0}}>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
