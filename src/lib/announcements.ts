// Hand-written entries for the home page "Recent Updates" feed, for news that
// isn't a commit to this repo (e.g. launching another project). They're merged
// with the GitHub commits by date, newest first.

import type { Commit } from "@/lib/github";

export const announcements: Commit[] = [
    {
        sha: "announcement-hourelle-launch",
        message: "Launched Hourelle, now live at hourelle.com",
        date: "2026-09-24T12:00:00-05:00",
        url: "https://hourelle.com",
    },
];
