import React from 'react'
import { getPosts } from "@/lib/blog"
import { GradientBg } from "@/components/GradientBg"
import { Sidebar } from "@/components/Sidebar"
import { PlaylistItem } from "@/components/PlaylistItem"

import { useEffect, useState } from "react"; 
import useSound from "use-sound"; 

import { music } from "@/lib/music"

export default async function MusicLayout({ children }) {
  return (
    <main className="lg:flex flex flex-grow lg:max-w-[70%] max-w-[95%] md:max-w-[25%]">
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
      <div className="content-wrapper"> 
        {children}
      </div>
    </main>
  )
}
