// Recent-commits feed for the home page "Recent Updates" section.
// Reads the public repo, so no auth is required; an optional GITHUB_TOKEN
// raises the rate limit (60/hr unauthenticated -> 5000/hr) if ever needed.

const REPO = "OfficialChanHen/Portfolio";
const token = process.env.GITHUB_TOKEN;

export type Commit = {
    sha: string;
    message: string; // first line of the commit message
    date: string;    // ISO timestamp
    url: string;     // link to the commit on GitHub
};

export async function getRecentCommits(limit = 5): Promise<Commit[]> {
    const res = await fetch(
        `https://api.github.com/repos/${REPO}/commits?per_page=${limit}`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { revalidate: 3600 }, // refresh at most hourly
        }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((c) => ({
        sha: c.sha,
        message: (c.commit?.message ?? "").split("\n")[0],
        date: c.commit?.author?.date ?? c.commit?.committer?.date ?? "",
        url: c.html_url,
    }));
}
