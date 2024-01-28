'use client'

import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRightIcon, AtSignIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export const NavigationLink = memo(({ href, label, icon }) => {
  const pathname = usePathname()
  const iconCmp = icon ?? <AtSignIcon size={16} />

  const isInternal = href.startsWith('/')
  if (!isInternal) {
    return (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-menu_hover"
      >
        <span className="inline-flex items-center gap-2 font-medium">
          {iconCmp} {label}
        </span>
      </a>
    )
  }

  let isActive = false
  if (pathname?.length > 0) {
    const splittedPathname = pathname.split('/')
    const currentPathname = splittedPathname[1] ?? ''
    isActive = currentPathname === href.split('/')[1]
  }

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        'group flex items-center justify-between rounded-lg p-2',
        isActive ? 'bg-menu text-menu_fg' : 'hover:bg-menu_hover'
      )}
    >
        <span className="flex items-center gap-2">
          {iconCmp}
        <span className={cn('font-medium', isActive && 'text-menu_fg')}>{label}</span>
      </span>
    </Link>
  )
})
