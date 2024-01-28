'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export const ListItem = ({ title, description, path }) => {
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
      <span className={cn('font-medium', isActive && 'text-foreground')}>{title}</span>
      {description && <span className={cn(isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>{description}</span>}
    </Link>
  )
}
