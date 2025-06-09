import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate the main bookmarks page (collections)
  revalidatePath('/bookmarks');

  // Revalidate all individual bookmark collection pages (wildcard for dynamic routes)
  revalidatePath('/bookmarks/[id]', 'page');

  return NextResponse.json({ revalidated: true, now: Date.now() });
} 