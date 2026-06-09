import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/lastfm";

export async function GET() {
    return NextResponse.json(await getNowPlaying());
}
