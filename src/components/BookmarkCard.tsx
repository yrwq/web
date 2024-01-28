import { Link2Icon } from 'lucide-react'

export const BookmarkCard = ({ bookmark }) => {
  return (
    <a
      key={bookmark._id}
      className="border-2 bg-secondary flex aspect-auto min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl p-4 duration-300 hover:bg-border"
      href={bookmark.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="aspect-[1200/630] overflow-hidden rounded-lg">
        <img
          src={bookmark.cover}
          alt={bookmark.title}
          width={1200}
          height={630}
          loading="lazy"
          className="aspect-[1200/630] animate-reveal rounded-lg bg-[url('/assets/fallback.webp')] bg-cover bg-center bg-no-repeat object-cover"
        />
      </span>
      <div className="flex flex-col gap-1">
        <h3>{bookmark.title}</h3>
        <span className="line-clamp-5 inline-flex items-center gap-1 text-sm text-gray-500">
          <Link2Icon size={16} />
          {bookmark.domain}
        </span>
        <span className="line-clamp-6 text-sm">{bookmark.note}</span>
      </div>
    </a>
  )
}
