import { NextResponse } from "next/server";
import { getRecentCommits } from "@/lib/github";
import { announcements } from "@/lib/announcements";

const LIMIT = 5;

export async function GET() {
    const commits = [...announcements, ...(await getRecentCommits(LIMIT))]
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, LIMIT);

    return NextResponse.json(
        { commits },
        {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
            },
        }
    );
}
