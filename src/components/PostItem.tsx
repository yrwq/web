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

export const PostItem = ({ title, description, path }) => {
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <Link
      key={path}
      href={path}
      className={cn(
        'flex flex-col gap-1 rounded-lg p-2 transition-colors duration-300 [&>*]:transition-colors [&>*]:duration-300',
        isActive ? 'bg-menu' : 'hover:bg-menu_hover'
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className={cn('flex items-center gap-2 font-medium',
                                isActive ? 'text-primary-foreground' : "text-secondary-foreground")}>
              <SquarePen size={16} />
              {title}
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  )
}
