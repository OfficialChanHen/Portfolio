import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/musicFeed";

export async function GET() {
    return NextResponse.json(await getNowPlaying());
}
