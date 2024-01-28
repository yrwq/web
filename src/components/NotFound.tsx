import { ScrollArea } from '@/components/ScrollArea'
import { PageTitle } from '@/components/PageTitle'

export function NotFound() {
  return (
    <ScrollArea className="flex flex-col" hasScrollTitle>
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Not found" />
          <p>broken, deleted, moved.</p>
        </div>
      </div>
    </ScrollArea>
  )
}
