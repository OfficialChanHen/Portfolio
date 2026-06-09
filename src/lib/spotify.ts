// Dormant: the portfolio currently sources its listening feed from Last.fm
// (see lastfm.ts). This module is kept intact for when Spotify access returns.
// Shared types now live in music.ts; re-exported here for backwards compatibility.
export type { NowPlaying, Track, CombinedTracksProps } from "@/lib/music";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";

export async function getSpotifyAccessToken() {
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

    return res.json();
}

export async function getNowPlaying() {
    const { access_token } = await getSpotifyAccessToken();

    const res = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
    });

    if (res.status === 204 || !res.ok) return null;
    
    return res.json();
}

export async function getTopTracks() {
    const { access_token } = await getSpotifyAccessToken();
    const numTracks = 5;
    
    const res = await fetch(`${TOP_TRACKS_ENDPOINT}?limit=${numTracks}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 60 },
    });
    if (res.status === 204 || !res.ok) return null;
    return res.json();
}