import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export async function GET() {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
        return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    return NextResponse.json({
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists.map((a: { name: string }) => a.name).join(", "),
        songUrl: song.item.external_urls.spotify,
    });
}