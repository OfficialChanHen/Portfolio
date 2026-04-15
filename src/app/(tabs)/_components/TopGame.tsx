"use client"


import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current.closest(".panel-games"),
                start: `${(window.innerHeight - (66 * 2))}px top`,
                end: () => `+=${window.innerHeight - 66}`,
                scrub: true,
                snap: {
                    snapTo: 'labels',
                    duration: 0.5,
                    ease: 'power1.inOut'
                
                },
                markers: true
            }
        });

        const cardEls = gsap.utils.toArray<Element>(".game-card")
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

    }, { scope: containerRef });

    return(
        <div ref={containerRef} className="w-full max-w-[1080px] flex flex-col justify-center items-center gap-4 ">
            {games.map((game, index) => (
                <div
                    key={game.id}
                    className="game-card relative h-64 w-full flex flex-col justify-center items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80"
                    style={{
                        backgroundImage: `url(/${game.coverUrl})`,
                    }}
                >
                    <div className="w-2/3 flex flex-col justify-center items-center p-5 bg-gradient-to-br from-white/30 to-white/5 border border-white/10 text-white rounded-xl drop-shadow-lg">
                        <span className="text-[2rem] md:text-[2.5rem] text-center font-bold text-shadow-lg">{game.title}</span>
                    </div>
                </div>
            ))}
            {/*
            <div className="relative w-5/6 rounded-xl bg-primary/80 border border-white/70 backdrop-blur-xs">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[60%] bg-tertiary/90 py-2 px-5 drop-shadow-md drop-shadow-primary rounded-xl text-center">
                    <span className="text-[clamp(0.5rem,3vw,1.5rem)] font-bold">Favorite Games</span>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center gap-2 px-5 pb-3 pt-8 md:pt-10 text-center rounded-xl">
                    <span className="text-[1.5rem] md:text-[2rem] font-bold">{game.title}</span>
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">Made by {game.company}</span>
                </div>
            </div>
            */}
        </div>    
    );
}