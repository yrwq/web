import "server-only";

import { COLLECTION_IDS } from "@/lib/utils/consts";
import { getRedisClient } from './redis';

const token = process.env.RAINDROP_ACCESS_TOKEN;
if (!token) {
  throw new Error(
    "RAINDROP_ACCESS_TOKEN is not defined in environment variables",
  );
}

// Ensure token has Bearer prefix
const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: authToken,
  },
  next: {
    revalidate: 60 * 60 * 24 * 2, // 2 days
  },
  signal: AbortSignal.timeout(30000), // 30 second timeout
};

const RAINDROP_API_URL = "https://api.raindrop.io/rest/v1";

interface BookmarkItem {
  _id: string;
  title: string;
  link: string;
  excerpt?: string;
  cover?: string;
  created: string;
  media?: { link?: string; src?: string }[];
  thumbnail?: string;
}

// Function to store bookmark image
async function storeBookmarkImage(imageUrl: string, bookmarkId: string) {
  try {
    if (!imageUrl) return null;

    // Only upload to blob if not already on a trusted CDN
    const trustedDomains = [
      "raindrop.io",
      "rdl.ink",
      "vercel-storage.com",
      "vercel.app",
      "unsplash.com",
      "images.unsplash.com",
      "cdn.jsdelivr.net",
      "githubusercontent.com",
    ];
    try {
      const parsed = new URL(imageUrl);
      if (trustedDomains.some(domain => parsed.hostname.endsWith(domain))) {
        return imageUrl;
      }
    } catch (e) {
      // If URL parsing fails, fallback to uploading
    }

    // --- Redis logic ---
    const cacheKey = `bookmark-blob-url:${bookmarkId}`;
    const redis = await getRedisClient();
    const cachedUrl = await redis.get(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Now store the image in Vercel Blob
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const storeResponse = await fetch(`${baseUrl}/api/bookmark-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl, bookmarkId }),
      cache: "no-store",
    });

    if (!storeResponse.ok) {
      return imageUrl;
    }

    const storeData = await storeResponse.json();
    await redis.set(cacheKey, storeData.url);

    return storeData.url;
  } catch (error) {
    console.error("Error storing bookmark image:", error);
    return imageUrl;
  }
}

export const getBookmarkItems = async (id: string, pageIndex = 0) => {
  if (!id) throw new Error("Bookmark ID is required");
  if (typeof pageIndex !== "number" || pageIndex < 0) {
    throw new Error("Invalid page index");
  }

  try {
    const response = await fetch(
      `${RAINDROP_API_URL}/raindrops/${id}?${new URLSearchParams({
        page: pageIndex.toString(),
        perpage: "50",
      })}`,
      options,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    const data = await response.json();

    // Store images for each bookmark item
    const itemsWithStoredImages = await Promise.all(
      data.items.map(async (item: BookmarkItem) => {
        try {
          // Use the cover or fallback to another field if needed
          const storedImageUrl = await storeBookmarkImage(
            item.cover || item.media?.[0]?.link || item.media?.[0]?.src || item.thumbnail || "",
            item._id,
          );
          if (storedImageUrl) {
            return { ...item, cover: storedImageUrl };
          }
          return item;
        } catch (error) {
          console.error(
            `Failed to store image for bookmark ${item._id}:`,
            error,
          );
          return item;
        }
      }),
    );

    return { ...data, items: itemsWithStoredImages };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch bookmark items: ${error.message}`, {
        error,
        stack: error.stack,
      });
    }
    return null;
  }
};

export const getBookmarks = async () => {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    const bookmarks = await response.json();
    return bookmarks.items.filter((bookmark: { _id: string | number }) =>
      COLLECTION_IDS.includes(String(bookmark._id)),
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to fetch bookmarks: ${error.message}`);
    } else {
      console.error("Unknown error occurred while fetching bookmarks");
    }
    return null;
  }
};

export const getBookmark = async (id: string) => {
  try {
    const response = await fetch(
      `${RAINDROP_API_URL}/collection/${id}`,
      options,
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Raindrop API error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }
    const data = await response.json();
    console.log("Received collection data:", {
      id: data.item?._id,
      title: data.item?.title,
    });
    return data.item;
  } catch (error: unknown) {
    return null;
  }
};
