"use client"

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Game = {
    id: number,
    title: string,
    coverUrl: string,
    company: string,
}

export default function TopGames() {
    const games: Game[] = [
        { id: 1, title: "Horizon Forbidden West", coverUrl: "horizon.png", company: "Guerrilla Games" },
        { id: 2, title: "Teamfight Tactics", coverUrl: "TFT.png", company: "Riot Games" }, 
        { id: 3, title: "Terraria", coverUrl: "terraria_cover.jpeg", company: "Re-Logic" },
        { id: 4, title: "League of Legends", coverUrl: "League.png", company: "Riot Games" },
        { id: 5, title: "Ark: Survival Ascended", coverUrl: "Ark.jpg", company: "Studio Wildcard" },
    ];
    
    const containerRef = useRef<HTMLDivElement>(null);
    const gamesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if(!containerRef.current || games.length === 0) return;

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
                        toggleActions: "play none none reverse"
                    },
                }
            );
        });

        const cardEls = gsap.utils.toArray<HTMLDivElement>(".card").reverse();
        const total = cardEls.length;

        // --- Panel pinning ---
         const tl = gsap.timeline({
            scrollTrigger: {
                id: "games-deck", // looked up by the About page's section nav
                trigger: containerRef.current,
                start: "top top",
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
        gsap.set(".games-hint", { opacity: 0, y: 20 });

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
                }, 
            start);
        });

        // Where the first card has fully landed; the section nav scrolls here so
        // the deck is never empty when jumped to.
        tl.addLabel("first-card", 1 / total);

        // Reveal the "Top Video Games" subtitle as the first card slides in (position 0).
        // Added after the card loop so it doesn't shift the snap labels placed above.
        tl.fromTo(".games-hint",
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1 / total,
                ease: "power2.out",
                immediateRender: false,
            },
        0);
    }, { scope: containerRef, dependencies: [] });

    return(
        <div
            ref={containerRef}
            className="w-screen min-h-dvh flex flex-col justify-center items-center p-10 pt-[106px] gap-10"
        >
            <div className="relative text-center">
                <div className="fade-in-list">
                    <h2 className="text-[2.5rem] md:text-[3.5rem]">
                        {"Personal Interests: "}
                        <span className="text-gradient">Games</span>
                    </h2>
                </div>
                <span className="games-hint block opacity-0 text-[1rem] md:text-[1.35rem] text-white/60">Top Video Games</span>
            </div>
            

            {/* Carousel (was TopGames) */}
            <div ref={gamesRef} className="relative w-1/3 min-w-[300px] max-w-[1080px] aspect-3/2">
                {games.map((game, index) => (
                    <div
                        key={game.id}
                        className="card absolute inset-0 w-full h-full flex flex-col justify-end items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl ring-1 ring-white/15 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.95)] overflow-hidden"
                        style={{
                            backgroundImage: `url(/${game.coverUrl})`,
                            zIndex: games.length - index, // first card on top
                        }}
                    >
                        <div className="relative flex flex-col justify-center items-center px-4 py-2.5 bg-black/35 border border-white/15 backdrop-blur-md text-white rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                            <span className="text-[0.95rem] md:text-[1.35rem] text-center font-bold text-shadow-lg/50">
                                {game.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}