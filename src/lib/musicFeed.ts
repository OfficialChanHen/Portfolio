// Listening-feed orchestration: Spotify is the primary source; Last.fm is the
// fallback used whenever Spotify is unavailable (missing credentials, an
// expired/revoked refresh token, or an API error). Both sources return the same
// normalized Track[] / NowPlaying shapes (see music.ts), so consumers don't care
// which one served the data.
import type { NowPlaying, Track } from "@/lib/music";
import * as spotify from "@/lib/spotify";
import * as lastfm from "@/lib/lastfm";

export async function getTopTracks(): Promise<Track[]> {
    const tracks = await spotify.getTopTracks();
    if (tracks && tracks.length > 0) return tracks;
    return lastfm.getTopTracks();
}

export async function getNowPlaying(): Promise<NowPlaying> {
    // Non-null means Spotify was reachable (whether or not something is playing);
    // only fall back to Last.fm when Spotify itself is unavailable.
    const nowPlaying = await spotify.getNowPlaying();
    if (nowPlaying !== null) return nowPlaying;
    return lastfm.getNowPlaying();
}
