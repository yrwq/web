import { del, put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Use Edge Runtime for better performance

// Validate environment variables
if (!process.env.YRWQ_READ_WRITE_TOKEN) {
    throw new Error(
        "YRWQ_READ_WRITE_TOKEN is not defined in environment variables",
    );
}

// Ensure token has correct prefix
const blobToken = process.env.YRWQ_READ_WRITE_TOKEN;
if (!blobToken.startsWith('vercel_blob_rw_')) {
    throw new Error('Invalid YRWQ_READ_WRITE_TOKEN format. Token should start with "vercel_blob_rw_"');
}

export async function POST(request: NextRequest) {
    try {
        const { url, bookmarkId } = await request.json();

        console.log('Received request to store image:', { url, bookmarkId });

        if (!url || !bookmarkId) {
            return NextResponse.json(
                { error: "URL and bookmarkId are required" },
                { status: 400 },
            );
        }

        // Fetch the image with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const imageResponse = await fetch(url, {
                signal: controller.signal,
                cache: "no-store",
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; RaindropBot/1.0)",
                },
            });
            clearTimeout(timeoutId);

            if (!imageResponse.ok) {
                if (imageResponse.status === 403) {
                    console.warn(`Access denied when fetching image from external service (status 403) for bookmark ${bookmarkId}. URL: ${url}`);
                    return NextResponse.json(
                        { error: "Failed to fetch image from external service: Access Denied", url: null },
                        { status: 200 }, // Return 200 to indicate graceful handling, not a server error
                    );
                }
                throw new Error(`Failed to fetch image: ${imageResponse.statusText}. Status: ${imageResponse.status}`);
            }

            const blob = await imageResponse.blob();
            const filename = `bookmark-${bookmarkId}-${Date.now()}.${blob.type.split("/")[1]}`;

            console.log(`Attempting to store image in Vercel Blob with token (first 10 chars): ${blobToken.substring(0, 10)}...`, {
                filename,
                contentType: blob.type,
                size: blob.size,
            });

            // Upload to Vercel Blob
            const { url: blobUrl } = await put(filename, blob, {
                access: "public",
                addRandomSuffix: false,
                token: blobToken,
            });

            console.log('Successfully stored image in Vercel Blob, URL:', blobUrl);
            return NextResponse.json({ url: blobUrl });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                });

                if (error.message.includes("Access denied")) {
                    return NextResponse.json(
                        {
                            error: "Blob storage access denied",
                            details: "Please check your YRWQ_READ_WRITE_TOKEN and ensure it has the correct permissions"
                        },
                        { status: 401 },
                    );
                }
                throw error;
            }
            throw new Error("Unknown error occurred while storing image");
        }
    } catch (error) {
        console.error("Error storing bookmark image (catch block):", error);
        return NextResponse.json(
            {
                error: "Failed to store image",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { url } = await request.json();

        console.log('Received request to delete image:', { url });

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        await del(url, {
            token: blobToken,
        });
        console.log('Successfully deleted image from Vercel Blob:', url);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bookmark image (catch block):", error);
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                {
                    error: "Blob storage access denied",
                    details: "Please check your YRWQ_READ_WRITE_TOKEN and ensure it has the correct permissions"
                },
                { status: 401 },
            );
        }
        return NextResponse.json(
            {
                error: "Failed to delete image",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 },
        );
    }
}
