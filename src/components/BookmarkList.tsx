'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { ArrowDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BookmarkCard } from '@/components/BookmarkCard'
import { getRaindrops } from '@/lib/raindrop'
import { cn } from '@/lib/utils'

async function fetchDataByPageIndex(id, pageIndex) {
  const raindrops = await getRaindrops(id, pageIndex)
  return raindrops
}

export const BookmarkList = ({ initialData, id }) => {
  const [data, setData] = useState(initialData.items)
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = () => {
    if (!isReachingEnd && !isLoading) setPageIndex((prevPageIndex) => prevPageIndex + 1)
  }

  const fetchInfiniteData = useCallback(async () => {
    setIsLoading(true)
    const newData = await fetchDataByPageIndex(id, pageIndex)
    setData((prevData) => [...prevData, ...newData.items])
    setIsLoading(false)
  }, [id, pageIndex])

  useEffect(() => {
    if (pageIndex > 0) fetchInfiniteData()
  }, [pageIndex, fetchInfiniteData])

  const getChunks = useCallback(() => {
    const firstChunk = []
    const lastChunk = []
    data.forEach((element, index) => {
      if (index % 2 === 0) {
        firstChunk.push(element)
      } else {
        lastChunk.push(element)
      }
    })
    return [[...firstChunk], [...lastChunk]]
  }, [data])

  const chunks = useMemo(() => getChunks(), [getChunks])
  const isReachingEnd = data.length >= initialData.count

  return (
    <div>
      <div className="grid lg:grid-cols-2 m-10 @lg:hidden border-0">
        {data.map((bookmark, bookmarkIndex) => {
          return (
            <div
              key={`bookmark_${bookmarkIndex}`}
              className={cn('grid', 'place-content-start', "m-2")}
            >
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
