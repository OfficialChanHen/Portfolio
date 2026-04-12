"use client";

import { useEffect, useState } from "react";
type Track = {
    id: string,
    title: string,
    artists: string,
    albumImg: string,
    songUrl: string,
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

    if (!data) return(
        <div className="w-full max-w-[1080px] h-[80vh] flex flex-col justify-center items-center bg-secondary gap-4 p-5 text-white rounded-2xl drop-shadow-xl drop-shadow-white/20 text-[1.5rem] md:text-[2rem] font-bold text-center">
            Loading Spotify…
        </div>
    );

    return (
        <div className="relative flex justify-center items-center" style={{ height: `calc(80vh + ${(data.length - 1) * 40}px)`, width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {data.map((track, index) => (
                <a key={track.id} href={track.songUrl} target="_blank" rel="noopener noreferrer"
                    className="absolute h-[80vh] flex flex-col justify-end items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80 transition-transform duration-300 ease-in-out hover:translate-x-3"
                    style={{
                        backgroundImage: `url(${track.albumImg})`,
                        left: `clamp(0px, ${index * 3}vw, ${index * 20}px)`,
                        width: `calc(90% - clamp(0px, ${(data.length - 1 - index) * 3}vw, ${(data.length - 1 - index) * 20}px))`,
                        zIndex: data.length - index,
                    }}
                >
                    <div className="relative w-5/6 rounded-xl bg-primary/80 border border-white/70 backdrop-blur-xs">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[60%] bg-tertiary/90 py-2 px-5 drop-shadow-md drop-shadow-primary rounded-xl text-center">
                            <span className="text-[clamp(0.5rem,3vw,1.5rem)] font-bold">My #{index + 1} Song</span>
                        </div>

                        <div className="relative z-10 flex flex-col justify-center items-center gap-2 px-5 pb-3 pt-8 md:pt-10 text-center rounded-xl">
                            <span className="text-[1.5rem] md:text-[2rem] font-bold">{track.title}</span>
                            <span className="text-[1rem] md:text-[1.5rem] text-white/80">{track.artists}</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}