"use client";

import { useEffect, useState } from "react";

type NowPlaying = {
    isPlaying: boolean;
    title?: string;
    artists?: string;
    albumImg?: string;
    songUrl?: string;
};

export default function SpotifyNowPlaying() {
    const [track, setTrack] = useState<NowPlaying | null>(null);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/spotify/now-playing");
            const json = await res.json();
            setTrack(json);
        }

        load();
        const interval = setInterval(load, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!track) return <p>Loading Spotify…</p>;
    if (!track.isPlaying) return <p>Not playing anything right now</p>;

    return (
        <a  href={track.songUrl} target="_blank" rel="noopener noreferrer"
            className="w-full max-w-[1080px] h-[80vh] flex flex-col justify-end items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-white/20 hover:scale-105 transition-transform ease-in-out duration-300"
            style={{ backgroundImage: `url(${track.albumImg})` }}
        >
            <div className="relative w-5/6 rounded-xl bg-primary/80 border border-white/70 backdrop-blur-xs">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-3/4 bg-tertiary/90 py-2 px-5 drop-shadow drop-shadow-primary rounded-xl text-center">
                    <span className="text-[1rem] md:text-[1.5rem] font-bold text-nowrap">Currently Playing</span>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center gap-2 px-5 pb-3 pt-8 md:pt-10 text-center rounded-xl">
                    <span className="text-[1.5rem] md:text-[2rem] font-bold">{track.title}</span>
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">{track.artists}</span>
                </div>
            </div>
        </a>
    );
}