import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'

import { music } from "@/lib/music"

export async function generateStaticParams() {
  return music.map((m) => ({
    slug: m.title.replace(/\s/g, "-")
  }))
}

export default async function CollectionPage({ params }) {
  const unslug = params.slug.replace(/-/g, " ")
  return (
    <>
    {music.map((m, idx) => {
      if (m.title == unslug) {
        return (
          <div key={idx}>
            <PageTitle title={m.title}/>

            {m.tracks[0].map((t, idx) => {
              return (
                <div key={idx}>
                  {t.title}
                </div>
              )
            })}

          </div>
        )
      }
    })}
    </>
  )
}
