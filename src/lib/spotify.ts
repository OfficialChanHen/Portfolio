const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

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

    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
    });
}