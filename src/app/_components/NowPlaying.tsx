"use client";

import { useEffect, useState } from "react";

type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  songUrl?: string;
};

export default function SpotifyNowPlaying() {
    const [data, setData] = useState<NowPlaying | null>(null);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/spotify/now-playing");
            const json = await res.json();
            setData(json);
        }

        load();
        const interval = setInterval(load, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return <p>Loading Spotify…</p>;
    if (!data.isPlaying) return <p>Not playing anything right now</p>;

    return (
        <a href={data.songUrl} target="_blank" rel="noopener noreferrer">
        Now playing: {data.title} — {data.artist}
        </a>
    );
}