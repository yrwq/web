import { getBookmarkItems, getBookmark } from '@/lib/raindrop'
import Link from 'next/link'
import { MagicMainCard } from '@/components/MagicMainCard'
import { Bookmark } from 'lucide-react'
import Image from 'next/image'

interface BookmarkItem {
  _id: string
  title: string
  link: string
  excerpt?: string
  cover?: string
  created: string
}

export default async function BookmarkItemsPage({
  params
}: {
  params: { id: string }
}) {
  const collection = await getBookmark(params.id)
  const items = await getBookmarkItems(params.id)

  if (!collection || !items) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Failed to load bookmarks</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mt-2 text-3xl font-bold">{collection.title}</h1>
        {collection.description && (
          <p className="mt-2 text-gray-600">{collection.description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.items.map((item: BookmarkItem) => (
          <a
            key={item._id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <MagicMainCard
              icon={<Bookmark size={18} />}
              title={item.title}
              className="h-full"
            >
              {item.cover && (
                <div className="mb-3 aspect-video flex justify-center p-6 items-center overflow-hidden rounded-md">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="object-cover h-full w-full rounded-lg"
                  />
                </div>
              )}
              {item.excerpt && (
                <p className="mb-2 text-sm text-muted-foreground line-clamp-3">
                  {item.excerpt}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-auto">
                {new Date(item.created).toLocaleDateString()}
              </div>
            </MagicMainCard>
          </a>
        ))}
      </div>
    </div>
  )
} 