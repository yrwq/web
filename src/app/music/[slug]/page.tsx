import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'

import { music } from "@/lib/music"
import { MusicItem } from "@/components/MusicItem"

import fetch from "node-fetch"

import SoundCloud from "soundcloud-scraper"
import Music from '../page'
const client = new SoundCloud.Client();

export async function generateStaticParams() {
  return music.map((m) => ({
    slug: m.title.replace(/\s/g, "-")
  }))
}

export default async function CollectionPage({ params }) {
  const unslug = params.slug.replace(/-/g, " ")
  const playlist = client.getPlaylist("https://soundcloud.com/prodexa/sets/" + params.slug);
  const client_id = "zy0ijES9ACCAxntrQj4MN4wKRlluii0I"

  return (
    playlist.then(async pl => {
      return (
        <>
          <PageTitle title={pl.title} className="mb-4"/>

          {pl.tracks.map(async (tr, idx) => {
            const resp = await fetch(tr.trackURL + "?client_id=" + client_id, {
            })
            const data = await resp.json()
            return (
              <div key={idx} className="min-w-full">
                <MusicItem 
                title={tr.title}
                cover_url={tr.thumbnail}
                duration={tr.duration}
                />
              </div>
            )
          })}

        </>
      )
    })
  )
}
