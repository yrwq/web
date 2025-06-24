import { NextResponse } from "next/server";
import { getBookmarks } from "@/lib/raindrop";

export async function GET() {
  const bookmarks = await getBookmarks();
  return NextResponse.json(bookmarks || []);
} 