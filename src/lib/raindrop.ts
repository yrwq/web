import 'server-only'

import { COLLECTION_IDS } from '@/lib/consts'

const token = process.env.RAINDROP_ACCESS_TOKEN
if (!token) {
  throw new Error('RAINDROP_ACCESS_TOKEN is not defined in environment variables')
}

// Ensure token has Bearer prefix
const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: authToken
  },
  next: {
    revalidate: 60 * 60 * 24 * 2 // 2 days
  },
  signal: AbortSignal.timeout(30000) // 30 second timeout
}

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'

export const getBookmarkItems = async (id: string, pageIndex = 0) => {
  if (!id) throw new Error('Bookmark ID is required')
  if (typeof pageIndex !== 'number' || pageIndex < 0) {
    throw new Error('Invalid page index')
  }

  try {
    const response = await fetch(
      `${RAINDROP_API_URL}/raindrops/${id}?` +
        new URLSearchParams({
          page: pageIndex.toString(),
          perpage: '50'
        }),
      options
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch bookmark items: ${error.message}`)
    }
    return null
  }
}

export const getBookmarks = async () => {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, options)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const bookmarks = await response.json()
    return bookmarks.items.filter(
      (bookmark: { _id: string | number }) => COLLECTION_IDS.includes(String(bookmark._id))
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to fetch bookmarks: ${error.message}`)
    } else {
      console.error('Unknown error occurred while fetching bookmarks')
    }
    return null
  }
}

export const getBookmark = async (id: string) => {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collection/${id}`, options)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    const data = await response.json()
    return data.item
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching bookmark:', error.message)
    } else {
      console.error('Unknown error occurred')
    }
    throw error
  }
}
