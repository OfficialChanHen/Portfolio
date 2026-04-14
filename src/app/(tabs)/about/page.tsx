'use client'

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import SpotifyTopTracks from "@/app/(tabs)/_components/SpotifyTopTracks";
import { AppWindow, Database, Wrench, BookOpenText, Rocket, Download, Zap, BugOff, Users } from "lucide-react";
import { useRef } from 'react';
import TopGames from "../_components/TopGame";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigationMode } from "@/providers/NavigationModeProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
    const textContainer = useRef<HTMLDivElement>(null);
    const techStackStyle = "group opacity-0 w-full flex flex-col justify-start items-start p-10 gap-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white rounded-xl";
    const techImg = "place-self-center md:place-self-start flex flex-col md:flex-row justify-center md:justify-start items-center gap-3 text-[1rem] md:text-[1.25rem] font-bold group-hover:scale-105 transition-transform ease-in-out duration-300";
    const techTitleStyle = "group-hover:text-highlight transition-color ease-in-out duration-300";
    const techSubListStyle = "list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem] text-white/80 group-hover:text-white transition-color group-hover:scale-105 transition-transform ease-in-out duration-300";

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;
    useGSAP(() => {
        const textContainerEl = textContainer.current;
        if (!textContainerEl) return;

        const introTl = gsap.timeline();
        introTl
            .fromTo(".rocket", {
                    x: 0,
                    y: -30,
                    opacity: 0,
                },
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
                    stagger: {
                        from: "start",
                        amount: 0.65,
                    },
                },
                0
            )

        const panels = gsap.utils.toArray<HTMLDivElement>(".panel");
        const panelSize = panels[0]?.offsetHeight ?? 0;
        const endPoint = panelSize;
        panels.forEach((panel, i) => {
            ScrollTrigger.create({
                markers: true,
                trigger: panel,
                start: "-66px top",
                end: () => `+=${endPoint}`,
                pin: true,
                pinSpacing: true,
            });
        });

        const fadeInElements = gsap.utils.toArray<Element>(".fade-in")
        fadeInElements.forEach((fadeInElement) => {
            gsap.fromTo(fadeInElement, 
                {
                    y: 30,
                    opacity: 0,
                },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: fadeInElement,
                        start: "top 60%",
                        end: () => `bottom 50%`,
                        markers: true
                    }
                }
            );
        });

        const fadeInList = gsap.utils.toArray<Element>(".fade-in-list")
        fadeInList.forEach((fadeInList) => {
            gsap.fromTo(fadeInList.children, 
                {
                    y: 30,
                    opacity: 0,
                },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    ease: "power2.out",
                    stagger: {
                        each: 0.3,
                        from: "start",
                    },
                    scrollTrigger: {
                        trigger: fadeInList,
                        start: "top 60%",
                        end: () => `bottom 50%`,
                        markers: true
                    }
                }
            );
        });
    })

    return(
        <div className="w-full h-full flex flex-col justify-start md:justify-center items-center">
            <StarBackground/>
            {/* Header page */}
            <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-10 gap-10 bg-primary">
                {/* Header Info */}
                <div ref={textContainer} className="text-container relative flex flex-col justify-center items-center text-center gap-2">
                    {/* Rocket */}
                    <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                        <Rocket size={20}/>
                    </div>

                    <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] font-bold bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <BookOpenText className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]'/>
                        <span>Beyond The Surface</span>
                    </div>
                    
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">
                            Discover
                        </span>{" "}
                        Who I Am
                    </h2>

                    <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">Want to know more? Check out my resume and continue scrolling down!</span>
                    
                    {/* Resume */}
                    <div className="intro-text">
                        <div className="flex flex-row justify-center items-center gap-2 px-5 py-3 mt-5 rounded-md cursor-pointer bg-tertiary border-none shadow-[0_0_25px] shadow-tertiary backdrop-blur-xs hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-tertiary hover:scale-105 text-nowrap transition-all ease-in-out duration-300">
                            <a href="/Official-Resume.pdf" download className="text-white/80 font-bold">Download Resume</a>
                            <Download className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                        </div>
                    </div>
                    
                </div>
            </div>
            {/* Tech page */}
            <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-10 gap-10 bg-secondary">
                {/* Header */}
                <h2 className="fade-in opacity-0 text-[2.5rem] md:text-[3.5rem]">
                    <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">
                        Tech Stack
                    </span>
                </h2>

                {/* Tech Stack */}
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">
                    {/* Frontend */}
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <AppWindow className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            <span className={techTitleStyle}>Frontend</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Typescript</li>
                            <li>React</li>
                            <li>Tailwind CSS</li>
                            <li>Next.js</li>
                            <li>React Native</li>
                        </ul>
                    </div>

                    {/* Backend */}
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <Database className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            <span className={techTitleStyle}>Backend</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Python</li>
                            <li>Java</li>
                            <li>C</li>
                            <li>SQL</li>
                            <li>RESTful APIs</li>
                        </ul>
                    </div>

                    {/* Tools */}
                    <div className={techStackStyle}>
                        <div className={techImg}>
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 bg-linear-to-br from-tertiary to-highlight text-white rounded-md">
                                <Wrench className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                             <span className={techTitleStyle}>Tools</span>
                        </div>
                        <ul className={techSubListStyle}>
                            <li>Figma</li>
                            <li>Git</li>
                            <li>Github</li>
                            <li>Docker</li>
                            <li>Expo Go</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Values Page */}
            <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-10 gap-10 bg-primary">
                {/* Header */}
                <h2 className="fade-in intro-text text-[2.5rem] md:text-[3.5rem]">
                    {"What I "}
                    <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">
                        Value
                    </span>
                </h2>

                {/* Values */}
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">

                    {/* Code */}
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-cyan-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"/>
                            <BugOff className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]"/>
                        </div>
                        <span className="font-bold group-hover:text-cyan-200 transition-color ease-in-out duration-300">Code</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Engineering clean, scalable code designed for growth and built to last.</span>
                    </div>

                    {/* Performance */}
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-yellow-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(64px,8vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"/>
                            <Zap className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]"/>
                        </div>
                        <span className="font-bold group-hover:text-yellow-200 transition-color ease-in-out duration-300">Performance</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Optimizing every interaction for speed, responsiveness, and a smoother user experience.</span>
                    </div>

                    {/* Collaboration */}
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-purple-300 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"/>
                            <Users className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]"/>
                        </div>
                        <span className="font-bold group-hover:text-purple-300 transition-color ease-in-out duration-300">Collaboration</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Working across teams to shape ideas, solve problems, and ship thoughtful digital products.</span>
                    </div>
                </div>
            </div>

            {/* Music Page */}
            <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-10 gap-10 bg-secondary">
                <SpotifyTopTracks/>
            </div>

            {/* Games Page */}
            <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-10 gap-10 bg-primary">
                <TopGames/>
            </div>
        </div>
    )
}