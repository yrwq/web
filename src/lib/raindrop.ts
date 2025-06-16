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

interface BookmarkItem {
  _id: string;
  title: string;
  link: string;
  excerpt?: string;
  cover?: string;
  created: string;
}

// Function to store bookmark image
async function storeBookmarkImage(url: string, bookmarkId: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // First try to get the image URL from Raindrop API
    const response = await fetch(`${RAINDROP_API_URL}/raindrop/${bookmarkId}`, {
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bookmark: ${response.statusText}`);
    }

    const data = await response.json();
    // Try to get image from various possible fields
    const imageUrl = data.item.cover ||
      data.item.media?.[0]?.link ||
      data.item.media?.[0]?.src ||
      data.item.thumbnail ||
      url;

    if (!imageUrl) {
      console.warn(`No image found for bookmark ${bookmarkId}`);
      return null;
    }

    // Now store the image in Vercel Blob
    const storeResponse = await fetch(`${baseUrl}/api/bookmark-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl, bookmarkId }),
      cache: 'no-store', // Disable caching for this request
    });

    if (!storeResponse.ok) {
      console.warn(`Failed to store image for bookmark ${bookmarkId}: ${storeResponse.statusText}`);
      return imageUrl; // Return original URL if storage fails
    }

    const storeData = await storeResponse.json();
    return storeData.url;
  } catch (error) {
    console.error('Error storing bookmark image:', error);
    return url; // Return original URL if storage fails
  }
}

export const getBookmarkItems = async (id: string, pageIndex = 0) => {
  if (!id) throw new Error('Bookmark ID is required')
  if (typeof pageIndex !== 'number' || pageIndex < 0) {
    throw new Error('Invalid page index')
  }

  try {
    console.log('Fetching bookmarks for collection:', id);
    const response = await fetch(
      `${RAINDROP_API_URL}/raindrops/${id}?${new URLSearchParams({
        page: pageIndex.toString(),
        perpage: '50'
      })}`,
      options
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Raindrop API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('Received bookmarks data:', {
      total: data.items?.length || 0,
      firstItem: data.items?.[0] ? {
        id: data.items[0]._id,
        title: data.items[0].title,
        hasCover: !!data.items[0].cover
      } : null
    });

    // Store images for each bookmark item
    const itemsWithStoredImages = await Promise.all(
      data.items.map(async (item: BookmarkItem) => {
        try {
          // Always try to get the image, even if cover is not set
          const storedImageUrl = await storeBookmarkImage(item.cover || '', item._id);
          if (storedImageUrl) {
            return { ...item, cover: storedImageUrl };
          }
          return item;
        } catch (error) {
          console.error(`Failed to store image for bookmark ${item._id}:`, error);
          return item;
        }
      })
    );

    return { ...data, items: itemsWithStoredImages };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch bookmark items: ${error.message}`, {
        error,
        stack: error.stack
      });
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
    console.log('Fetching collection details for:', id);
    const response = await fetch(`${RAINDROP_API_URL}/collection/${id}`, options)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Raindrop API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    const data = await response.json()
    console.log('Received collection data:', {
      id: data.item?._id,
      title: data.item?.title
    });
    return data.item
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching bookmark:', error.message, {
        error,
        stack: error.stack
      });
    } else {
      console.error('Unknown error occurred', error);
    }
    return null
  }
}
