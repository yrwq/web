import Balancer from 'react-wrap-balancer'

import { cn } from '@/lib/utils'

export const PageTitle = ({ title, subtitle, className, ...rest }) => {
  return (
    <div className={cn('flex lg:text-2xl text-xs m-6 justify-center', className)}>
      <Balancer as="h3" {...rest}>
        {title}
      </Balancer>
      {subtitle}
    </div>
  )
}
