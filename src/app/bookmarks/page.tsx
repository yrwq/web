import Link from 'next/link'

import { ScrollArea } from '@/components/ScrollArea'
import { getCollections } from '@/lib/raindrop'
import { sortByProperty } from '@/lib/utils'

async function fetchData() {
  const collections = await getCollections()
  const sortedCollections = sortByProperty(collections, 'title')
  return { collections: sortedCollections }
}

export default async function Writing() {
  const { collections } = await fetchData()

  return (
    <ScrollArea className="flex flex-col lg:hidden">
      <div>
        {collections.map((collection) => {
          return (
            <Link
              key={collection._id}
              href={`/bookmarks/${collection.slug}`}
              className="flex flex-col gap-1 px-4 py-3 text-sm hover:bg-menu_hover"
            >
              <span className="font-medium">{collection.title}</span>
              <span className="text-slate-500">{collection.count} bookmarks</span>
            </Link>
          )
        })}
      </div>
    </ScrollArea>
  )
}
