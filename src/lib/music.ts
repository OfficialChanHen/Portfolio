// Shared music-widget types, decoupled from any single provider so the active
// data source (currently Last.fm — see lastfm.ts) and the dormant Spotify
// integration (spotify.ts) can both depend on them.

export type NowPlaying = {
    isPlaying: boolean;
    title?: string;
    artists?: string;
    albumImg?: string;
    songUrl?: string;
};

export type Track = {
    id: string;
    title: string;
    artists: string;
    albumImg: string;
    songUrl: string;
};

export type CombinedTracksProps = {
    initialTracks: Track[];
    initialNowPlaying: NowPlaying;
};
