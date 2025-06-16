import { del, put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { url, bookmarkId } = await request.json();

        if (!url || !bookmarkId) {
            return NextResponse.json(
                { error: "URL and bookmarkId are required" },
                { status: 400 },
            );
        }

        // Fetch the image
        const imageResponse = await fetch(url);
        if (!imageResponse.ok) {
            throw new Error("Failed to fetch image");
        }

        const blob = await imageResponse.blob();
        const filename = `bookmark-${bookmarkId}-${Date.now()}.${blob.type.split("/")[1]}`;

        // Upload to Vercel Blob
        const { url: blobUrl } = await put(filename, blob, {
            access: "public",
            addRandomSuffix: false,
        });

        return NextResponse.json({ url: blobUrl });
    } catch (error) {
        console.error("Error storing bookmark image:", error);
        return NextResponse.json(
            { error: "Failed to store image" },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        await del(url);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bookmark image:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 },
        );
    }
}
