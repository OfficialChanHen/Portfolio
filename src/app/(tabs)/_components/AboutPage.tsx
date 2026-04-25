'use client'

import SpotifyTopTracks from "@/app/(tabs)/_components/SpotifyTopTracks";
import { AppWindow, Database, Wrench, BookOpenText, Rocket, Download, Zap, BugOff, Users, ChevronsDown, ArrowUp, ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigationMode } from "@/providers/NavigationModeProvider";
import TopGames from "../_components/TopGame";
import { CombinedTracksProps } from "@/lib/spotify";
import BackToTopButton from "./BackToTopButton";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function AboutPage({ initialTracks, initialNowPlaying }: CombinedTracksProps) {
    const sectionsContainerRef = useRef<HTMLDivElement>(null);
    const textContainer = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const techStackStyle = "w-full flex flex-col justify-start items-start p-10 gap-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-white rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300";
    const techImg = "place-self-center md:place-self-start md:w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-3 text-[1rem] md:text-[1.25rem]";
    const techTitleStyle = "group-hover:text-highlight transition-color ease-in-out duration-300";
    const techSubListStyle = "list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem] text-white/80 group-hover:text-white transition-color";

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;
    const [resumeOpen, setResumeOpen] = useState(false);
    const sections = ["#resume", "#stack", "#values", "#music", "#games"];

    useEffect(() => {
        const updateNavHeight = () => {
            if (navRef.current) {
                const bottom = navRef.current.getBoundingClientRect().bottom;
                document.documentElement.style.setProperty("--nav-height", `${bottom + 16}px`); // +16px buffer
            }
        };

        updateNavHeight();
        window.addEventListener("resize", updateNavHeight);
        return () => window.removeEventListener("resize", updateNavHeight);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => clearTimeout(timeout);
    }, [resumeOpen]);

    useGSAP(() => {
        if (!textContainer.current || !sectionsContainerRef.current || !navRef.current) return;
        
        ScrollTrigger.create({
            trigger: ".nav-bar",
            start: "top top+=76px",
            end: "max",
            pin: true,
            pinSpacing: false,
        });

        gsap.from(".progress-line", {
            scaleX: 0,
            transformOrigin: "left center",
            markers: true,
            ease: "none",
            scrollTrigger: {
                trigger: ".progress-line",
                start: "top top+=66px",
                end: "max",
                pin: true,
                pinSpacing: false,
                scrub: 1,
            }
        })

        gsap.set(".scroll-down", { opacity: 0 });

        // --- Intro animation ---
        const introTl = gsap.timeline();
        introTl
            .fromTo(".rocket",
                { x: 0, y: -30, opacity: 0 },
                {
                    x: 0,
                    y: textContainer.current.offsetHeight,
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
            )
            .fromTo(".scroll-down",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(".scroll-down", {
                            y: 10,          
                            duration: 0.75,  
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut", 
                        });

                        gsap.fromTo(".scroll-down",
                            { opacity: 1 },
                            {
                                opacity: 0,
                                scrollTrigger: {
                                    trigger: ".scroll-down",
                                    start: "top center",
                                    end: "bottom center",
                                    toggleActions: "play none none reverse",
                                },
                            }
                        );
                    },
                }
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
                        toggleActions: "play none none reverse"
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
                        toggleActions: "play none none reverse"
                    },
                }
            );
        });
    }, { dependencies: [] });

    function handleNavClick(navSection: String) {
        const scroller = ScrollSmoother.get();
        scroller?.scrollTo(navSection, true, "top top+=66");
    }

    function handleResumeButton() {
        setResumeOpen(prev => !prev);
    }

    return (
        <div ref={sectionsContainerRef} className="w-screen flex flex-col justify-start items-center bg-primary">
            {/* Header Page */}
            <section id="resume" className="w-screen min-h-dvh flex flex-col justify-between items-center p-10 pt-[66px] gap-10 bg-primary scroll-mt-[var(--nav-height)]">
                
                <div className="flex flex-col justify-center items-start">
                    {/* Progress Bar */}
                    <div className="progress-line z-20 h-[4px] w-screen bg-highlight"/>

                    {/* Scroll Header */}
                    <div ref={navRef} className="nav-bar z-20 place-self-center inline-flex flex-row justify-center items-center text-[0.75rem] md:text-[1rem] text-center text-white/60 gap-4 px-5 py-3 mt-[6px] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xs rounded-full cursor-pointer">
                        <button className="z-10 hover:text-white hover:underline underline-offset-4 transition-all duration-300 ease-in-out" onClick={() => handleNavClick("#resume")}>Resume</button>
                        <button className="z-10 hover:text-white hover:underline underline-offset-4 transition-all duration-300 ease-in-out" onClick={() => handleNavClick("#stack")}>Stack</button>
                        <button className="z-10 hover:text-white hover:underline underline-offset-4 transition-all duration-300 ease-in-out" onClick={() => handleNavClick("#values")}>Values</button>
                        <button className="z-10 hover:text-white hover:underline underline-offset-4 transition-all duration-300 ease-in-out" onClick={() => handleNavClick("#music")}>Music</button>
                        <button className="z-10 hover:text-white hover:underline underline-offset-4 transition-all duration-300 ease-in-out" onClick={() => handleNavClick("#games")}>Games</button>
                    </div>
                </div>

                <div ref={textContainer} className="text-container relative max-w-[1080px] flex flex-col justify-center items-center text-center gap-2">
                    <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                        <Rocket size={20} />
                    </div>
                    <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <BookOpenText className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]' />
                        <span>Beyond The Surface</span>
                    </div>
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">Discover</span>{" "}Who I Am
                    </h2>
                    <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">
                        Want to know more? Check out <span className="text-gradient">my resume</span> and <span className="text-gradient">continue scrolling</span> down!
                    </span>
                    <div className="intro-text text-[0.75rem] md:text-[1.25rem]">
                        <div 
                            className="flex flex-row justify-center items-center gap-2 px-5 py-3 rounded-md cursor-pointer bg-tertiary border-none shadow-[0_0_25px] shadow-tertiary backdrop-blur-xs hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-tertiary hover:scale-105 text-nowrap transition-all ease-in-out duration-300"
                            onClick={handleResumeButton}
                        >
                            <button className="text-white/80">{resumeOpen ? "Close" : "Open"} Resume</button>
                            <ChevronDown className={`w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)] transition-transform duration-300 ease-in-out ${resumeOpen ? "rotate-180" : "rotate-0"}`}/>
                        </div>
                    </div>
                        
                    { resumeOpen &&
                        <iframe
                            src="/Official-Resume.pdf"
                            className="w-full h-[80dvh] rounded-xl border border-white/10"
                            title="Resume PDF"
                        />
                    }
                </div>

                {/* Scroll Down */}
                <div className="scroll-down flex flex-col justify-center items-center gap-2 text-[0.75rem] md:text-[1.25rem] text-center">
                    Scroll Down
                    <ChevronsDown className="w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)]"/>
                </div>
            </section>

            {/* Tech Page */}
            <section id="stack" className="fade-in-list w-screen min-h-dvh flex flex-col justify-center items-center p-10 pt-[106px] gap-10 bg-secondary scroll-mt-[var(--nav-height)]">
                <h2 className="text-[2.5rem] md:text-[3.5rem] text-center">
                    <span className="text-gradient">Tech Stack</span>
                </h2>
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">
                    
                    <div className="group md:w-full flex flex-col justify-center items-center">
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
                    </div>

                    <div className="group md:w-full flex flex-col justify-center items-center">
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
                    </div>

                    <div className="group md:w-full flex flex-col justify-center items-center">
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
            </section>

            {/* Values Page */}
            <section id="values" className="fade-in-list w-screen min-h-dvh flex flex-col justify-center items-center p-10 pt-[106px] gap-10 bg-primary scroll-mt-[var(--nav-height)]">
                <h2 className="text-[2.5rem] md:text-[3.5rem] text-center">
                    {"What I "}
                    <span className="text-gradient">Value</span>
                </h2>
                <div className="fade-in-list md:w-full max-w-[1080px] flex flex-col md:flex-row justify-center md:items-stretch gap-5">
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-cyan-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <BugOff className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="group-hover:text-cyan-200 transition-color ease-in-out duration-300">Code</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Engineering clean, scalable code designed for growth and built to last.</span>
                    </div>
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-yellow-200 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(64px,8vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <Zap className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="group-hover:text-yellow-200 transition-color ease-in-out duration-300">Performance</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Optimizing every interaction for speed, responsiveness, and a smoother user experience.</span>
                    </div>
                    <div className="group w-full flex flex-col justify-start items-center gap-3 text-[1rem] md:text-[1.5rem]">
                        <div className="relative w-[clamp(60px,8vw,84px)] h-[clamp(60px,8vw,84px)] flex flex-row justify-center items-center p-5 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-purple-300 rounded-xl group-hover:scale-105 transition-transform ease-in-out duration-300">
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(72px,10vw,96px)] h-[clamp(72px,10vw,96px)] flex flex-row justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                            <Users className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,5vw,48px)] h-[clamp(36px,5vw,48px)]" />
                        </div>
                        <span className="group-hover:text-purple-300 transition-color ease-in-out duration-300">Collaboration</span>
                        <span className="text-[0.75rem] md:text-[1rem] text-white/80 text-center group-hover:text-white transition-color ease-in-out duration-300">Working across teams to shape ideas, solve problems, and ship thoughtful digital products.</span>
                    </div>
                </div>
            </section>

            {/* Music Page */}
            <section id="music" className="scroll-mt-[var(--nav-height)]">
                <SpotifyTopTracks initialTracks={initialTracks} initialNowPlaying={initialNowPlaying}/>
            </section>

            {/* Games Page */}
            <section id="games" className="relative scroll-mt-[var(--nav-height)]">
                <TopGames/>
                <div className="z-30 absolute bottom-8 right-8 md:bottom-10 md:right-10 text-[1rem] px-3 rounded-md cursor-pointer text-white tracking-widest backdrop-blur-xs bg-secondary text-nowrap border border-white/10 hover:scale-105 text-nowrap transition-all ease-in-out duration-300">
                    <BackToTopButton onClick={() => handleNavClick("#resume")}/>
                </div>
            </section>
        </div>
    );
}