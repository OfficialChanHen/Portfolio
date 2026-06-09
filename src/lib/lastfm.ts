import type { NowPlaying, Track } from "@/lib/music";

const apiKey = process.env.LASTFM_API_KEY!;
const username = process.env.LASTFM_USERNAME!;

const API_ROOT = "https://ws.audioscrobbler.com/2.0/";
const NUM_TRACKS = 5;

// Last.fm returns this hash as the "image" for tracks/albums it has no art for.
const PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

type LastfmImage = { "#text": string; size: string };

type LastfmTopTrack = {
    name: string;
    mbid?: string;
    url: string;
    artist: { name: string };
    image: LastfmImage[];
};

type LastfmRecentTrack = {
    name: string;
    url: string;
    artist: { "#text": string };
    image: LastfmImage[];
    "@attr"?: { nowplaying?: string };
};

// Pick the largest non-placeholder image from a Last.fm image array, or null.
function pickImage(images: LastfmImage[] | undefined): string | null {
    if (!images?.length) return null;
    const url = images[images.length - 1]?.["#text"];
    if (!url || url.includes(PLACEHOLDER_HASH)) return null;
    return url;
}

// Last.fm's per-track art is unreliable, so backfill from the free, key-less
// iTunes Search API. Best-effort: any failure resolves to null so the caller
// can fall back without breaking the widget.
async function fetchArtwork(artist: string, title: string): Promise<string | null> {
    try {
        const term = encodeURIComponent(`${artist} ${title}`);
        const res = await fetch(
            `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
            { next: { revalidate: 60 * 60 * 24 } } // artwork is stable; cache a day
        );
        if (!res.ok) return null;
        const data = await res.json();
        const art: string | undefined = data?.results?.[0]?.artworkUrl100;
        return art ? art.replace("100x100", "600x600") : null;
    } catch {
        return null;
    }
}

async function resolveAlbumImg(
    lastfmImg: string | null,
    artist: string,
    title: string
): Promise<string> {
    if (lastfmImg) return lastfmImg;
    return (await fetchArtwork(artist, title)) ?? "";
}

export async function getTopTracks(): Promise<Track[]> {
    const url =
        `${API_ROOT}?method=user.gettoptracks&user=${username}` +
        `&period=1month&limit=${NUM_TRACKS}&api_key=${apiKey}&format=json`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json();
    const items: LastfmTopTrack[] = data?.toptracks?.track ?? [];

    return Promise.all(
        items.map(async (track) => {
            const artists = track.artist.name;
            return {
                id: track.mbid || `${track.name}-${artists}`,
                title: track.name,
                artists,
                albumImg: await resolveAlbumImg(pickImage(track.image), artists, track.name),
                songUrl: track.url,
            };
        })
    );
}

export async function getNowPlaying(): Promise<NowPlaying> {
    const url =
        `${API_ROOT}?method=user.getrecenttracks&user=${username}` +
        `&limit=1&api_key=${apiKey}&format=json`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { isPlaying: false };

    const data = await res.json();
    const track: LastfmRecentTrack | undefined = data?.recenttracks?.track?.[0];

    if (!track || track["@attr"]?.nowplaying !== "true") {
        return { isPlaying: false };
    }

    const artists = track.artist["#text"];
    return {
        isPlaying: true,
        title: track.name,
        artists,
        albumImg: await resolveAlbumImg(pickImage(track.image), artists, track.name),
        songUrl: track.url,
    };
}
