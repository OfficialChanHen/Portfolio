"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type NowPlaying = {
    isPlaying: boolean;
    title?: string;
    artists?: string;
    albumImg?: string;
    songUrl?: string;
};

type Track = {
    id: string;
    title: string;
    artists: string;
    albumImg: string;
    songUrl: string;
};

export default function SpotifyTopTracks() {
    const [data, setData] = useState<Track[]>([]);
    const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadTopTracks() {
            const res = await fetch("/api/spotify/top-tracks");
            const json = await res.json();
            setData(Array.isArray(json) ? json : json.tracks ?? []);
        }

        async function loadNowPlaying() {
            const res = await fetch("/api/spotify/now-playing");
            const json = await res.json();
            setNowPlaying(json);
        }

        loadTopTracks();
        loadNowPlaying();
        const interval = setInterval(loadNowPlaying, 15000);
        return () => clearInterval(interval);
    }, []);

    // re-run GSAP when cards change (data loads)
    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current.closest(".panel.panel--music"),
                start: "-66px top",
                end: () => `+=${window.innerHeight - 66}`,
                scrub: true,
                snap: {
                    snapTo: 'labels',
                    duration: 0.5,
                    ease: 'power1.inOut'
                },
            }
        });

        const cardEls = gsap.utils.toArray<Element>(".track-card")
        cardEls.forEach((card, i) => {
            if (i === cardEls.length - 1) return;
            const step = 1 / cardEls.length;
            const offset = i * step;

            tl.addLabel(`card ${i}`)
            tl.to(card,
                {
                    x: "-120%",
                    opacity: 0,
                    rotation: -15,
                    ease: "power2.in",
                    duration: step,
                },
                offset
            );
        });

    }, { scope: containerRef, dependencies: [data, nowPlaying] });

    // Combine now-playing + top tracks into one list
    const cards: { id: string; title: string; artists: string; albumImg: string; songUrl: string; label: string }[] = [
        ...(nowPlaying?.isPlaying ? [{
            id: "now-playing",
            title: nowPlaying.title!,
            artists: nowPlaying.artists!,
            albumImg: nowPlaying.albumImg!,
            songUrl: nowPlaying.songUrl!,
            label: "Currently Playing",
        }] : []),
        ...data.map((track, index) => ({
            ...track,
            label: `My #${index + 1} Song`,
        })),
    ];
    
    return (
        <div ref={containerRef} className="relative flex justify-center items-center h-[50vh] w-full max-w-[1080px] h-[clamp(300px,50vw,800px]">
            {cards.map((track, index) => (
                <a key={track.id} href={track.songUrl} target="_blank" rel="noopener noreferrer"
                    className="track-card absolute h-full flex flex-col justify-end items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80 transition-transform duration-300 ease-in-out hover:translate-x-4"
                    style={{
                        backgroundImage: `url(${track.albumImg})`,
                        left: `clamp(0px, ${index * 3}vw, ${index * 20}px)`,
                        width: `calc(90% - clamp(0px, ${(cards.length - 1 - index) * 1.5}vw, ${(cards.length - 1 - index) * 15}px))`,
                        zIndex: cards.length - index,
                    }}
                >
                    <div className="relative w-5/6 rounded-xl bg-primary/80 border border-white/70 backdrop-blur-xs">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[60%] bg-tertiary/90 py-2 px-5 drop-shadow-md drop-shadow-primary rounded-xl text-center">
                            <span className="text-[clamp(0.5rem,3vw,1.5rem)] font-bold">{track.label}</span>
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