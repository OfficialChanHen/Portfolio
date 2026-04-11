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

export async function GET() {
    const response = await getTopTracks();

    if (response.status !== 200) {
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
        url: track.external_urls.spotify,
    }))


    return NextResponse.json({
        tracks
    });
}