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

  const { content } = await processMdx(post.content);

  return (
    <article style={{padding: "3rem 0 3rem 0", margin: 0}}>
      <div style={{maxWidth: "768px", padding: "0 1rem", margin: 0}}>
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to blog
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-slate-100 text-slate-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-xl text-slate-600 mt-2 mb-6">
              {post.description}
            </p>
          )}

          <div className="flex items-center text-sm text-slate-500 border-b border-slate-200 pb-6">
            {post.author && <span className="mr-2">{post.author}</span>}
            <span className="mx-2">·</span>
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

        <div className="prose prose-slate max-w-none">
          <MDXProvider>{content}</MDXProvider>
        </div>
      </div>
    </article>
  );
}
