import { type NextRequest, NextResponse } from "next/server";
import { COLLECTION_IDS } from "@/lib/utils/consts";

const token = process.env.RAINDROP_ACCESS_TOKEN;
const authToken =
  token && token.startsWith("Bearer ") ? token : `Bearer ${token}`;
const RAINDROP_API_URL = "https://api.raindrop.io/rest/v1";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Filter by COLLECTION_IDS
    const collections = data.items
      .filter((col: any) => COLLECTION_IDS.includes(String(col._id)))
      .map((col: any) => ({ _id: col._id, title: col.title }));

    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 },
    );
  }
}
