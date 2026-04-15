'use client'

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import SpotifyTopTracks from "@/app/(tabs)/_components/SpotifyTopTracks";
import { AppWindow, Database, Wrench, BookOpenText, Rocket, Download, Zap, BugOff, Users } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigationMode } from "@/providers/NavigationModeProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Game = {
    id: number;
    title: string;
    coverUrl: string;
    company: string;
};

const games: Game[] = [
    { id: 1, title: "Horizon Forbidden West", coverUrl: "horizon.png", company: "Guerrilla Games" },
    { id: 2, title: "Teamfight Tactics", coverUrl: "TFT.png", company: "Riot Games" },
    { id: 3, title: "Terraria", coverUrl: "terraria_cover.jpeg", company: "Re-Logic" },
    { id: 4, title: "League of Legends", coverUrl: "League.png", company: "Riot Games" },
    { id: 5, title: "Ark: Survival Ascended", coverUrl: "Ark.jpg", company: "Studio Wildcard" },
];

export default function About() {
    const textContainer = useRef<HTMLDivElement>(null);
    const gamesRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const techStackStyle = "group w-full flex flex-col justify-start items-start p-10 gap-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white rounded-xl";
    const techImg = "place-self-center md:place-self-start flex flex-col md:flex-row justify-center md:justify-start items-center gap-3 text-[1rem] md:text-[1.25rem] font-bold group-hover:scale-105 transition-transform ease-in-out duration-300";
    const techTitleStyle = "group-hover:text-highlight transition-color ease-in-out duration-300";
    const techSubListStyle = "list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem] text-white/80 group-hover:text-white transition-color group-hover:scale-105 transition-transform ease-in-out duration-300";

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;

    const carouselRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const textContainerEl = textContainer.current;
        if (!textContainerEl) return;

        // --- Intro animation ---
        const introTl = gsap.timeline();
        introTl
            .fromTo(".rocket",
                { x: 0, y: -30, opacity: 0 },
                {
                    x: 0,
                    y: textContainerEl.offsetHeight,
                    duration: 1.6,
                    ease: "power2.inOut",
                    delay: delayTime,
                    keyframes: {
                        opacity: [0, 1, 1, 0],
                        easeEach: "none",
                    },
                },
                0
            )
            .fromTo(".intro-text",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.inOut",
                    delay: delayTime + 0.3,
                    stagger: { from: "start", amount: 0.65 },
                },
                0
            );

        // --- Fade in elements ---
        gsap.utils.toArray<Element>(".fade-in").forEach((el) => {
            gsap.set(el, { opacity: 0, y: 30 });
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 60%",
                        end: () => "bottom 50%",
                    },
                }
            );
        });

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
                    },
                }
            );
        });

        const cardEls = gsap.utils.toArray<HTMLDivElement>(".game-card").reverse();
        const total = cardEls.length;

        // --- Panel pinning ---
         const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".panel-games",
                start: "-66px top",
                end: `+=${total * 600}`,
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
    }, { dependencies: [] });

    return (
        <div className="w-full h-full flex flex-col justify-start md:justify-center items-center">
            <StarBackground />

            {/* Header Page */}
            <div className="min-w-screen min-h-[calc(100vh-66px)] flex flex-col justify-center items-center p-10 gap-10 bg-primary">
                <div ref={textContainer} className="text-container relative flex flex-col justify-center items-center text-center gap-2">
                    <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                        <Rocket size={20} />
                    </div>
                    <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] font-bold bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <BookOpenText className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]' />
                        <span>Beyond The Surface</span>
                    </div>
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">Discover</span>{" "}Who I Am
                    </h2>
                    <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">
                        Want to know more? Check out my resume and continue scrolling down!
                    </span>
                    <div className="intro-text">
                        <div className="flex flex-row justify-center items-center gap-2 px-5 py-3 mt-5 rounded-md cursor-pointer bg-tertiary border-none shadow-[0_0_25px] shadow-tertiary backdrop-blur-xs hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-tertiary hover:scale-105 text-nowrap transition-all ease-in-out duration-300">
                            <a href="/Official-Resume.pdf" download className="text-white/80 font-bold">Download Resume</a>
                            <Download className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Page */}
            <div className="min-w-screen min-h-[calc(100vh-66px)] flex flex-col justify-center items-center p-10 gap-10 bg-secondary">
                <h2 className="fade-in text-[2.5rem] md:text-[3.5rem] text-center">
                    <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">Tech Stack</span>
                </h2>
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <AppWindow className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]" />
                            </div>
                            <span className={techTitleStyle}>Frontend</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Typescript</li><li>React</li><li>Tailwind CSS</li><li>Next.js</li><li>React Native</li>
                        </ul>
                    </div>
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <Database className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]" />
                            </div>
                            <span className={techTitleStyle}>Backend</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Python</li><li>Java</li><li>C</li><li>SQL</li><li>RESTful APIs</li>
                        </ul>
                    </div>
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <Wrench className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]" />
                            </div>
                            <span className={techTitleStyle}>Tools</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Figma</li><li>Git</li><li>Github</li><li>Docker</li><li>Expo Go</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Values Page */}
            <div className="min-w-screen min-h-[calc(100vh-66px)] flex flex-col justify-center items-center p-10 gap-10 bg-primary">
                <h2 className="fade-in text-[2.5rem] md:text-[3.5rem] text-center">
                    {"What I "}
                    <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">Value</span>
                </h2>
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-cyan-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <BugOff className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="font-bold group-hover:text-cyan-200 transition-color ease-in-out duration-300">Code</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Engineering clean, scalable code designed for growth and built to last.</span>
                    </div>
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-yellow-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(64px,8vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <Zap className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="font-bold group-hover:text-yellow-200 transition-color ease-in-out duration-300">Performance</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Optimizing every interaction for speed, responsiveness, and a smoother user experience.</span>
                    </div>
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-purple-300 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <Users className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="font-bold group-hover:text-purple-300 transition-color ease-in-out duration-300">Collaboration</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Working across teams to shape ideas, solve problems, and ship thoughtful digital products.</span>
                    </div>
                </div>
            </div>

            {/* Music Page */}
            <div className="panel--music min-w-screen min- h-[calc(100vh-66px)] flex flex-col justify-center items-center p-10 gap-5 bg-secondary">
                <div className="fade-in-list text-center">
                    <h2 className="fade-in text-[2.5rem] md:text-[3.5rem]">
                        {"Personal Interests: "}
                        <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">Music</span>
                    </h2>
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">Top Spotify Tracks</span>
                </div>
            </div>

            {/* Games Page */}
            <div
                ref={panelRef}
                className="panel-games min-w-screen min-h-[calc(100vh-66px)] flex flex-col justify-center items-center p-10 gap-10 bg-primary"
            >
                <div className="fade-in-list relative text-center">
                    <h2 className="text-[2.5rem] md:text-[3.5rem]">
                        {"Personal Interests: "}
                        <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">Games</span>
                    </h2>
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">Top Video Games</span>
                </div>
                

                {/* Carousel (was TopGames) */}
                <div ref={gamesRef} className="relative w-full max-w-[1080px] aspect-3/2">
                    {games.map((game, index) => (
                        <div
                            key={game.id}
                            className="game-card absolute inset-0 w-full h-full flex flex-col justify-center items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80"
                            style={{
                                backgroundImage: `url(/${game.coverUrl})`,
                                zIndex: games.length - index, // first card on top
                            }}
                        >
                            <div className="flex flex-col justify-center items-center p-3 bg-gradient-to-br from-white/30 to-white/5 border border-white/10 text-white rounded-xl drop-shadow-lg">
                                <span className="text-[1.5rem] md:text-[2rem] text-center font-bold text-shadow-lg/50">
                                    {game.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}