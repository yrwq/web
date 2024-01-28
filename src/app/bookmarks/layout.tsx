import { Suspense } from 'react'

import { Sidebar } from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ListItem } from '@/components/ListItem'
import { getCollections } from '@/lib/raindrop'
import { sortByProperty } from '@/lib/utils'
import { GradientBg } from '@/components/GradientBg'

export const revalidate = 60 * 60 * 24 * 2 // 2 days

async function fetchData() {
  const collections = await getCollections()
  const sortedCollections = sortByProperty(collections, 'title')
  return { collections: sortedCollections }
}

export default async function BookmarksLayout({ children }) {
  const { collections } = await fetchData()

  return (
    <div className="flex w-full" suppressHydrationWarning>
      <GradientBg />
      <Sidebar title="Bookmarks" href="/bookmarks" isInner>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="flex flex-col gap-1 text-sm">
            {collections.map((collection) => {
              return (
                <ListItem
                  key={collection._id}
                  path={`/bookmarks/${collection.slug}`}
                  title={collection.title}
                  description={`${collection.count} bookmarks`}
                />
              )
            })}
          </div>
        </Suspense>
      </Sidebar>
      <div className="lg:bg-grid flex-1">{children}</div>
    </div>
  )
}
