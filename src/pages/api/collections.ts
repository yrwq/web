import type { NextApiRequest, NextApiResponse } from 'next'
import { COLLECTION_IDS } from '@/lib/consts'

const token = process.env.RAINDROP_ACCESS_TOKEN
const authToken = token && token.startsWith('Bearer ') ? token : `Bearer ${token}`
const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
    })
    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({ error: errorText })
    }
    const data = await response.json()
    // Filter by COLLECTION_IDS
    const collections = data.items
      .filter((col: any) => COLLECTION_IDS.includes(String(col._id)))
      .map((col: any) => ({ _id: col._id, title: col.title }))
    res.status(200).json(collections)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
} 