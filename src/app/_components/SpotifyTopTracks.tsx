"use client";

import { useEffect, useState } from "react";
type Track = {
    id: string,
    title: string,
    artists: string,
    albumImg: string,
    url: string,
}

export default function SpotifyTopTracks() {
    const [data, setData] = useState<Track[] | null>(null);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/spotify/top-tracks");
            const json = await res.json();
            setData(json.tracks ?? []);
        }

        load();
        const interval = setInterval(load, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return <p>Loading Tracks</p>;

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            {data.map((track, index) => (
            <div
                key={track.id}
                className="w-[300px] h-[300px] text-white bg-cover bg-center"
                style={{ backgroundImage: `url(${track.albumImg})` }}
            >
                <a href={track.url} target="_blank" rel="noopener noreferrer">
                #{index + 1} Title: {track.title} — {track.artists}
                </a>
            </div>
            ))}
        </div>
    );
}