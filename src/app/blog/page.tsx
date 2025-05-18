import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/mdx/utils';
import { formatDate, readingTime } from '@/lib/utils';

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on programming, design, and more',
};

export default async function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Blog
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Thoughts, tutorials, and insights on programming, web development, and technology.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.slug}`} className="block h-full">
              {post.image ? (
                <div className="relative aspect-video">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-slate-100 aspect-video flex items-center justify-center">
                  <span className="text-slate-400">No image</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-800 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold mb-2 text-slate-900">{post.title}</h2>
                
                {post.description && (
                  <p className="text-slate-600 mb-4 line-clamp-2">{post.description}</p>
                )}
                
                <div className="flex items-center text-sm text-slate-500 mt-auto pt-2 border-t border-slate-100">
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className="mx-2">·</span>
                  <span>{readingTime(post.description || '')} min read</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-slate-700">No posts yet</h2>
          <p className="text-slate-500 mt-2">Check back soon for new content</p>
        </div>
      )}
    </div>
  );
}