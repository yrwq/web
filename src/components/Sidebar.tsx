'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { ScrollArea } from '@/components/ScrollArea'
import { Button } from '@/components/ui/button.jsx'
import { cn } from '@/lib/utils'

export const Sidebar = ({ children, title, href, isInner }) => {
  const router = useRouter()

  return (
    <ScrollArea
      className={cn(
        'hidden bg-secondary lg:flex lg:flex-col lg:border-r',
        isInner ? 'lg:w-80 xl:w-96' : 'lg:w-60 xl:w-72'
      )}
    >
      {title && (
        <div className="sticky top-0 z-10 border-b bg-secondary px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">
              {href ? <Link href={href}>{title}</Link> : <span>{title}</span>}
            </div>
          </div>
        </div>
      )}
      <div className="bg-secondary p-3">{children}</div>
    </ScrollArea>
  )
}
