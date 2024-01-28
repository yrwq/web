import React from 'react'
import { getPosts } from "@/lib/blog"
import { GradientBg } from "@/components/GradientBg"
import { Sidebar } from "@/components/Sidebar"
import { PostItem } from "@/components/PostItem"

export default async function Blog({ children }) {
  const posts = await getPosts()
  return (
    <main className="flex">
      <div className="min-h-screen">
        <Sidebar title="Posts" href="/blog" isInner  >
          {posts.map((post) => {
            return (
              <PostItem
                key={post.slug}
                path={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
              />
            )
          })}
        </Sidebar>
      </div>
      <div className="content content-wrapper">{children}</div>
    </main>
  )
}

