import React from 'react'
import { getPosts } from "@/lib/blog"
import { GradientBg } from "@/components/GradientBg"
import { Sidebar } from "@/components/Sidebar"
import { PlaylistItem } from "@/components/PlaylistItem"

import { music } from "@/lib/music"

export default async function MusicLayout({ children }) {
  return (
    <main className="flex">
      <div className="min-h-screen">
        <Sidebar title="albums" href="/music" isInner  >
          {music.map((m) => {
            return (
              <PlaylistItem
                key={m.title}
                title={m.title}
                count={m.count}
                cover={m.cover}
                date={m.date}
                genre={m.genre}
              />
            )
          })}
        </Sidebar>
      </div>
      <div className="content content-wrapper">{children}</div>
    </main>
  )
}
