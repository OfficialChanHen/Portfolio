import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/musicFeed";
import type { Track } from "@/lib/music";

let cachedTracks: Track[] | null = null;
let cachedAt = 0;

const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
    const now = Date.now();

    if (cachedTracks && now - cachedAt < CACHE_TTL) {
        return NextResponse.json(
            { tracks: cachedTracks, cached: true },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
                },
            }
        );
    }

    const tracks = await getTopTracks();

    cachedTracks = tracks;
    cachedAt = now;

    return NextResponse.json(
        { tracks },
        {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
            },
        }
    );
}
