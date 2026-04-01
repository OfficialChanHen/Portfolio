'use client';

import { Sparkles, Rocket, Mail, ArrowBigRight } from 'lucide-react';
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import { AiOutlinePython } from "react-icons/ai";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef } from "react";
import Link from 'next/link';

gsap.registerPlugin(useGSAP, TextPlugin);

export default function Introduction() {
    const introContainer = useRef<HTMLDivElement>(null);
    const titles = ["Software Engineer", "Web Developer", "Creative Technologist", "Volleyball Enthusiast", "Horror Connoisseur"];
    const currentIndex = useRef(0);
    const titleRef = useRef<HTMLSpanElement>(null);
    const textContainer = useRef<HTMLDivElement>(null);
    const tl = gsap.timeline();

    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const isRefresh = navEntry?.type === "reload";

    const wasNavigated = sessionStorage.getItem('introAnimated');
    const hasAnimated = wasNavigated && !isRefresh;

    function startRotation() {
        gsap.to(".headshot-container", {
            rotate: 360,
            duration: 25,
            ease: "none",
            repeat: -1
        });

        gsap.to(".headshot", {
            rotate: "-=360",
            duration: 25,
            ease: "none",
            repeat: -1
        });
    }


    useGSAP(() => {
        if (!titleRef.current || !textContainer.current) return;

        if (!hasAnimated) {
            gsap.fromTo(".rocket",
                { x: 0, y: 0, opacity: 0 },
                {
                    x: 0,
                    y: textContainer.current.offsetHeight,
                    duration: 1.5,
                    ease: "power2.inOut",
                    delay: 1,
                    keyframes: {
                        opacity: [0, 1, 1, 0],  // invisible → visible → visible → invisible
                        easeEach: "none"
                    }
                }
            );

            tl.from(".intro-text", {
                x: 0,
                y: -20,
                opacity: 0,
                duration: 0.75,
                ease: "power2.inOut",
                stagger: {
                    from: "start",
                    amount: 0.75
                },
                delay: 1,
            });

            tl.from(".headshot-container", {
                x: 0,
                y: 50,
                opacity: 0,
                duration: 0.75,
                ease: "power2.in",
                onComplete: () => startRotation()
            })

            sessionStorage.setItem('introAnimated', 'true');
        } else {
            gsap.set(".intro-text", { opacity: 1, y: 0 });
            gsap.set(".headshot-container", { opacity: 1, y: 0 });
            startRotation();
        }   

            
    
        const cycle = () => {
            const next = titles[(currentIndex.current + 1) % titles.length];

            // Slide current out upward
            tl.to(titleRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Swap text and reset position below
                    if (!titleRef.current) return;
                    currentIndex.current = (currentIndex.current + 1) % titles.length;
                    titleRef.current.textContent = next;

                    gsap.fromTo(titleRef.current,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        };


        const interval = setInterval(cycle, 3000);
        return () => clearInterval(interval);
    }, { scope: introContainer });

    return(
        <div ref={introContainer} className="max-w-[1000px] w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-10 text-center md:text-left">
            
            {/* Introduction Container */}
            <div ref={textContainer} className="relative flex flex-col justify-center gap-2">

                {/* Rocket */}
                <div className='rocket absolute top-0 left-[48%] md:-left-8 z-20 rotate-135 opacity-0'>
                    <Rocket size={20}/>
                </div>

                <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                    <Sparkles className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]'/>
                    <span>Welcome To My Space</span>
                </div>
                
                <div className="flex flex-col justify-center items-center md:justify-center md:items-start tracking-tight">
                    <span className="intro-text text-[2rem] md:text-[2.5rem]">Hi, I'm</span>
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-highlight via-tertiary to-highlight bg-clip-text text-transparent">
                        Chan Hen
                    </span>
                </div>
                
                <div className="overflow-hidden">
                    <span ref={titleRef} className="intro-text inline-block text-[1rem] md:text-[1.5rem] text-white/80">
                        Software Engineer
                    </span>
                </div>
                <span className="intro-text text-[0.75rem] md:text-[1rem] text-white/50">
                    Crafting digital experiences across the universe
                </span>

                {/* Intro Buttons */}
                <div className='intro-text flex flex-col md:flex-row justify-center md:justify-start items-center py-3 gap-5 text-[0.7rem] md:text-[1rem]'>
                    <Link href="/projects">
                        <button className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md cursor-pointer text-white tracking-widest transition-[box-shadow] duration-500 bg-primary/40 backdrop-blur-xs border-none shadow-[0_0_25px] shadow-tertiary hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-tertiary active:scale-[0.97] text-nowrap">
                            <span>View Projects</span>
                            <ArrowBigRight className="transition-transform duration-300 group-hover:translate-x-2 w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]"/>
                        </button>
                    </Link>
                    <Link href="/contact">
                        <button className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md cursor-pointer text-white tracking-widest transition-[box-shadow] duration-500 bg-highlight backdrop-blur-xs border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:shadow-highlight active:scale-[0.97]">
                            <Mail className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"/>
                            <span>Connect</span>
                        </button>
                    </Link>
                </div>

                {/* Socials */}
                <div className='intro-text flex flex-row justify-center md:justify-start items-center gap-5 text-highlight'>
                    <a href="https://github.com/OfficialChanHen" target="_blank" rel="noopener noreferrer">
                        <FiGithub className='w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]'/>
                    </a>
                    <a href="https://www.linkedin.com/in/chan-hen-13727b233/" target="_blank" rel="noopener noreferrer">
                        <FiLinkedin className='w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]'/>
                    </a>
                </div>
            </div>
            
            {/* Image */}
            <div className='headshot-container m-10'>
                <div className="relative overflow-visible z-10 w-[clamp(210px,50vw,410px)] h-[clamp(210px,50vw,410px)] p-2 border-t border-b border-highlight/80 rounded-full">
                    <div className="headshot absolute z-20 top-[50%] left-[0%] -translate-x-1/2 -translate-y-1/2 bg-highlight/20 backdrop-blur-xs border border-highlight text-highlight rounded-full p-2">
                        <FaReact className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]' />
                    </div>
                    <div className="headshot absolute z-20 top-[50%] left-[100%] -translate-x-1/2 -translate-y-1/2 bg-highlight/20 backdrop-blur-xs border border-highlight text-highlight rounded-full p-2">
                        <AiOutlinePython className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]' />
                    </div>
                    <div className="headshot w-full h-full rounded-full border-2 border-parchment bg-[url('/headshot.jpg')] bg-cover bg-center"/>
                </div>
            </div>

        </div>
    );
}