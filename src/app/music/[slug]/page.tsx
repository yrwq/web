import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'

import { music } from "@/lib/music"

import { play, createAudioPlayer } from "play-dl"
import SoundCloud from "soundcloud-scraper"
const client = new SoundCloud.Client();

export async function generateStaticParams() {
  return music.map((m) => ({
    slug: m.title.replace(/\s/g, "-")
  }))
}

function download(url, options = {}) {
    return new Promise((resolve, reject) => {
        if (!url || typeof url !== "string") return reject(new Error(`Expected url, received "${typeof url}"!`));
        const request = url.startsWith("http://") ? require("http") : require("https");
        request.get(url, options, res => resolve(res));
    });
}

export default async function CollectionPage({ params }) {
  const unslug = params.slug.replace(/-/g, " ")
  const playlist = client.getPlaylist("https://soundcloud.com/prodexa/sets/" + params.slug)

  return (
    playlist.then(async x => {
      return (
        x.tracks.map(function (tr, idx) {
        var url = "https://soundcloud.com/prodexa/" + tr.title
        return (
          <div key={idx} className="flex">
            {play.stream(url)}
          </div>
        )
      })
      )
    })
  )
}
