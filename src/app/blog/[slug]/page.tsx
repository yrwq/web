import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  processMdx,
} from "@/lib/mdx/utils";
import MDXProvider from "@/components/mdx/MDXProvider";

export async function generateStaticParams() {
  const posts = getBlogPostSlugs();
  return posts.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Process MDX without a specific theme - let CSS handle the theming
  const { content } = await processMdx(post.content);

  return (
    <article style={{ padding: "3rem 0 3rem 0", margin: 0 }}>
      <div style={{ padding: "0 1rem", margin: 0 }}>
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-xl text-foreground/65 mt-2 mb-6">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="font-medium bg-foreground/65 text-base px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {post.image && (
          <div className="relative aspect-video mb-10 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        <hr />
        <div className="prose prose-slate max-w-none">
          <MDXProvider>{content}</MDXProvider>
        </div>
      </div>
    </article>
  );
}
