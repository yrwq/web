import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sorts an array of objects based on the specified property in ascending order.
 * The function compares the property values in a case-insensitive manner.
 * @param arr The array to be sorted.
 * @param prop The property name used for sorting the objects.
 * @returns The sorted array in ascending order based on the specified property.
 */
export const sortByProperty = (arr, prop) => {
  return arr.sort((a, b) => {
    const itemA = a[prop].toUpperCase()
    const itemB = b[prop].toUpperCase()

    if (itemA < itemB) {
      return -1
    } else if (itemA > itemB) {
      return 1
    }

    return 0
  })
}

/**
 * Sorts an array of blog post objects based on their date field (only for old blog posts) or publication dates in descending order.
 * The function compares the 'date' property of each post or 'firstPublishedAt' property from the 'sys' object.
 * The posts are sorted by creating Date objects from the publication dates and comparing them.
 * @param posts The array of blog post objects to be sorted.
 * @returns The sorted array of blog posts in descending order based on their publication dates.
 */
export const getSortedPosts = (posts) => {
  return posts.sort((a, b) => {
    const dateA = a.date || a.sys.firstPublishedAt
    const dateB = b.date || b.sys.firstPublishedAt
    return new Date(dateB) - new Date(dateA)
  })
}
