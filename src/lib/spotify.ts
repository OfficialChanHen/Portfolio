// Spotify is the primary listening-feed source. These functions return normalized
// Track[] / NowPlaying (the same shapes as lastfm.ts), or `null` when Spotify is
// unavailable — missing credentials, an expired/revoked refresh token, or an API
// error — so callers can fall back to Last.fm. See musicFeed.ts for the
// primary/fallback orchestration.
import type { NowPlaying, Track } from "@/lib/music";
export type { NowPlaying, Track, CombinedTracksProps } from "@/lib/music";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

// The parts of Spotify's track object we read.
type SpotifyArtist = { name: string };
type SpotifyTrack = {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album?: { images?: { url: string }[] };
    external_urls?: { spotify?: string };
};

async function getAccessToken(): Promise<string | null> {
    if (!clientId || !clientSecret || !refreshToken) return null;

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
        cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.access_token ?? null;
}

// null => Spotify unavailable (fall back to Last.fm). Otherwise the top tracks.
export async function getTopTracks(): Promise<Track[] | null> {
    try {
        const token = await getAccessToken();
        if (!token) return null;

        const res = await fetch(`${TOP_TRACKS_ENDPOINT}?limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;

        const data = await res.json();
        const items: SpotifyTrack[] = data?.items ?? [];
        return items.map((t) => ({
            id: t.id,
            title: t.name,
            artists: t.artists.map((a) => a.name).join(", "),
            albumImg: t.album?.images?.[0]?.url ?? "",
            songUrl: t.external_urls?.spotify ?? "",
        }));
    } catch {
        return null;
    }
}

// null => Spotify unavailable (fall back). { isPlaying: false } => reachable, nothing playing.
export async function getNowPlaying(): Promise<NowPlaying | null> {
    try {
        const token = await getAccessToken();
        if (!token) return null;

        const res = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (res.status === 204) return { isPlaying: false };
        if (!res.ok) return null;

        const song: { is_playing: boolean; item?: SpotifyTrack } = await res.json();
        if (!song?.item) return { isPlaying: false };

        return {
            isPlaying: song.is_playing,
            title: song.item.name,
            artists: song.item.artists.map((a) => a.name).join(", "),
            albumImg: song.item.album?.images?.[0]?.url ?? "",
            songUrl: song.item.external_urls?.spotify ?? "",
        };
    } catch {
        return null;
    }
}
