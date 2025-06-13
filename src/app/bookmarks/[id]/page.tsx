import { getBookmarkItems, getBookmark } from "@/lib/raindrop";
import Link from "next/link";
import { MagicMainCard } from "@/components/MagicMainCard";
import { Bookmark } from "lucide-react";
import Image from "next/image";

interface BookmarkItem {
  _id: string;
  title: string;
  link: string;
  excerpt?: string;
  cover?: string;
  created: string;
}

export default async function BookmarkItemsPage({
  params,
}: {
  params: { id: string };
}) {
  const collection = await getBookmark(params.id);
  const items = await getBookmarkItems(params.id);

  if (!collection || !items) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Failed to load bookmarks</p>
      </div>
    );
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
              title={item.title}
              icon={<Bookmark size={18} />}
              className="h-full transition-transform duration-200 hover:-translate-y-1"
            >
              {item.cover && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    quality={75}
                  />
                </div>
              )}
              <h2 className="mb-2 line-clamp-2 text-lg font-semibold">
                {item.title}
              </h2>
              {item.excerpt && (
                <p className="line-clamp-2 text-sm text-gray-600">
                  {item.excerpt}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {new Date(item.created).toLocaleDateString()}
              </p>
            </MagicMainCard>
          </a>
        ))}
      </div>
    </div>
  );
}
