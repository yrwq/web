import Link from 'next/link'

import { NavigationLink } from '@/components/NavigationLink'
import { EXTLINKS, LINKS } from '@/lib/sidebar'

export const SidebarContent = () => {
  return (
    <div className="flex w-full flex-col text-sm">
      <div className="flex flex-col gap-1">
        {LINKS.map((link, linkIndex) => (
          <NavigationLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <span className="px-2 pt-4 text-xs font-medium leading-relaxed text-gray-600">more</span>
        <div className="flex flex-col gap-1">
          {Object.values(EXTLINKS).map((ext) => (
            <NavigationLink key={ext.url} href={ext.url} label={ext.title} icon={ext.icon} />
          ))}
        </div>
      </div>
    </div>
  )
}
