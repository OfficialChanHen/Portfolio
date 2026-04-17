"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Track, NowPlaying, CombinedTracksProps, getNowPlaying } from "@/lib/spotify";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SpotifyTopTracks({ initialTracks, initialNowPlaying }: CombinedTracksProps) {
    const [data, setData] = useState<Track[]>(initialTracks);
    const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(initialNowPlaying);
    const containerRef = useRef<HTMLDivElement>(null);
    const tracksRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    // re-run GSAP when cards change (data loads)
    useGSAP(() => {
        if(!containerRef.current || data.length === 0) return;

         // Kill only the previous timeline from this component
        tlRef.current?.kill();

        // --- Fade in lists ---
        gsap.utils.toArray<Element>(".fade-in-list").forEach((list) => {
            gsap.set(list.children, { opacity: 0, y: 30 });
            gsap.fromTo(list.children,
                { y: 30, opacity: 0 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    stagger: { each: 0.3, from: "start" },
                    scrollTrigger: {
                        trigger: list,
                        start: "top 60%",
                        end: () => "bottom 50%",
                        toggleActions: "play none play reverse"
                    },
                }
            );
        });

        const cardEls = gsap.utils.toArray<HTMLAnchorElement>(".card").reverse();
        console.log(cardEls)
        const total = cardEls.length;

        // --- Panel pinning ---
         const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "-66px top",
                end: `+=${containerRef.current.offsetHeight * 3}`,
                scrub: 1.5,
                pin: true,
                pinSpacing: true,
                snap: {
                    snapTo: 'labels', // snap to the closest label in the timeline
                    duration: { min: 0.2, max: 0.4 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                    delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
                    ease: 'power1.inOut' // the ease of the snap animation ("power3" by default)
                }
            }
        });

        

        let rotations = cardEls.map(() => gsap.utils.random(-8, 8, 2));
        rotations = rotations.map((_, i) => {
            const prev = i > 0 ? rotations[i - 1] : 0;
            // flip sign if same direction as previous
            return Math.sign(rotations[i]) === Math.sign(prev) ? (rotations[i] * -1) : rotations[i];
        });

        gsap.set(cardEls, { opacity: 0, y: "100%" });

        cardEls.forEach((card, i) => {
            const start = i / total;
            const duration = 1 / total;

            // Slide up into stacked position
            tl.addLabel(`card-${i}`)
            tl.fromTo(card, 
                {
                    opacity: 0,
                    y: "100%",
                },
                {
                    rotation: rotations[i],
                    y: i % 2 === 0 ? 10 : -10,
                    opacity: 1,
                    duration: duration,
                    ease: "power2.out",
                    immediateRender: false,
                }, 
            start);
        });
        tlRef.current = tl; // ← save reference
    }, { scope: containerRef, dependencies: [data, nowPlaying] });


    // Combine now-playing + top tracks into one list
    const tracks: { id: string; title: string; artists: string; albumImg: string; songUrl: string; label: string }[] = [
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
        <div
            ref={containerRef}
            className="min-w-screen min-h-[calc(100dvh-66px)] flex flex-col justify-center items-center p-10 pb-[66px] gap-10 bg-secondary"
        >
            <div className="fade-in-list relative text-center">
                <h2 className="text-[2.5rem] md:text-[3.5rem]">
                    {"Personal Interests: "}
                    <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">
                        Music
                    </span>
                </h2>
                <span className="text-[1rem] md:text-[1.5rem] text-white/80">
                    Tap the card To listen
                </span>
            </div>

            <div ref={tracksRef} className="relative w-1/2 min-w-[300px] max-w-[1080px] aspect-3/2">
                {tracks.map((track, i) => (
                    <a
                        key={track.id}
                        href={track.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card absolute inset-0 w-full h-full flex flex-col justify-center items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80"
                        style={{
                            backgroundImage: `url(${track.albumImg})`,
                            zIndex: tracks.length - i,
                        }}
                    >
                        <div className="flex flex-col justify-center items-center p-3 bg-gradient-to-br from-white/30 to-white/5 border border-white/10 text-white rounded-xl drop-shadow-lg">
                            <span className="text-[1rem] md:text-[1.5rem] text-center font-bold text-shadow-lg/50">
                                {track.label}
                            </span>
                            <span className="text-[1rem] md:text-[1.5rem] text-center font-bold text-shadow-lg/50">
                                {track.title}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}