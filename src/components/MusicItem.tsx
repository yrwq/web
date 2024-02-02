"use client"
import Balancer from 'react-wrap-balancer'

import { cn } from '@/lib/utils'

export const MusicItem = ({ title, cover_url, duration, play_count, stream_url, ...rest }) => {
  return (
    <div className={cn('text-xl', className)}>
      {title}
    </div>
  )
}
