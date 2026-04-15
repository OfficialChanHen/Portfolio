import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

type SpotifyArtist = { 
    name: string 
};
type SpotifyTrack = {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: { images?: { url: string }[] };
    external_urls: { spotify: string };
};

let cachedTracks: any[] | null = null;
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

    const response = await getTopTracks();

    if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") ?? "30";

        return NextResponse.json(
            {
                error: "Spotify rate limit hit",
                retryAfter: Number(retryAfter),
            },
            {
                status: 429,
                headers: {
                    "Retry-After": retryAfter,
                },
            }
        );
    }

    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
            {   
                error: "Failed to fetch top tracks", 
                details: errorText 
            },
            { 
                status: response.status 
            }
        );
    }

    const data = await response.json();
    const tracks = data.items.map((track: SpotifyTrack) => ({
        id: track.id,
        title: track.name,
        artists: track.artists.map((artist) => artist.name).join(", "),
        albumImg: track.album.images?.[0]?.url ?? null,
        songUrl: track.external_urls.spotify,
    }))

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