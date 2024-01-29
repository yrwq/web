'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SquarePen } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from '@/lib/utils'

import moment from "moment";

import Image from 'next/image'

export const PlaylistItem = ({ title, count, cover, date, genre}) => {
  const pathname = usePathname()

  const sl = title.replace(/\s/g, "-")

  const isActive = pathname === "/music/" + sl

  return (
    <Link
      key={title}
      href={"/music/" + sl}
      className={cn(
        'my-2 flex gap-2 rounded-lg p-2 transition-colors duration-300 [&>*]:transition-colors [&>*]:duration-300',
        isActive ? 'bg-menu' : 'hover:bg-menu_hover'
      )}
    >

      {cover &&
        <Image
          src={cover}
          width={50}
          height={40}
          alt={title}
        />
      }

      <div className="flex flex-col ml-2">
        <span className={cn('flex items-center gap-2 font-medium', isActive ? 'text-primary-foreground' : "text-secondary-foreground")}>
          {title}
        </span>

        <div className="flex flex-row">
          {count && <span className={cn(isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>{count} tracks</span>}
          {date && <span className={cn("absolute right-6", isActive ? 'text-primary-foreground' : 'text-muted-foreground')}> {moment(date).format("DD MMM, YYYY")} </span>}
        </div>
      </div>

    </Link>
  )
}
