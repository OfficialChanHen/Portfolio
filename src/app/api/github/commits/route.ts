import { NextResponse } from "next/server";
import { getRecentCommits } from "@/lib/github";

export async function GET() {
    const commits = await getRecentCommits(5);

    return NextResponse.json(
        { commits },
        {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
            },
        }
    );
}
