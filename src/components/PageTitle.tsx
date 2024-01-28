import Balancer from 'react-wrap-balancer'

import { cn } from '@/lib/utils'

export const PageTitle = ({ title, subtitle, className, ...rest }) => {
  return (
    <div className={cn('text-2xl', className)}>
      <Balancer as="h1" {...rest}>
        {title}
      </Balancer>
      {subtitle}
    </div>
  )
}
