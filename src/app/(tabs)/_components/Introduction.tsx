'use client';

import { Sparkles, Rocket, Mail, ChevronsDown, ChevronRight, Download } from 'lucide-react';
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import { AiOutlinePython } from "react-icons/ai";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, Dispatch, SetStateAction } from "react";
import Link from 'next/link';
import playOrTrigger from '@/app/utils/playOrTrigger';
import { useNavigationMode } from '@/providers/NavigationModeProvider';
import { useMobile } from '@/providers/MobileProvider';

type IntroductionProps = {
    setIntroDone: Dispatch<SetStateAction<boolean>>
}

export default function Introduction({ 
    setIntroDone 
}: IntroductionProps ) {
    const introContainer = useRef<HTMLDivElement>(null);
    const titles = ["Software Engineer", "Web Developer", "Creative Technologist", "Volleyball Enthusiast", "Horror Connoisseur"];
    const currentIndex = useRef(0);
    const titleRef = useRef<HTMLSpanElement>(null);
    const textContainer = useRef<HTMLDivElement>(null);
    const headshotContainer = useRef<HTMLDivElement>(null);

    const isMobile  = useMobile();

    function cycle() {
        if (!titleRef.current) return;
        const next = titles[(currentIndex.current + 1) % titles.length];

        // Slide current out upward
        gsap.to(titleRef.current, {
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

    function startRotation() {
        if (!headshotContainer.current) return;

        gsap.to(headshotContainer.current, {
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

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.7;
    useGSAP(() => {
        if (!textContainer.current || !titleRef.current || !headshotContainer.current ) return;

        gsap.set(".scroll-down", { opacity: 0 });
        const introTl = gsap.timeline({
            onComplete: () => {
                playOrTrigger(headshotContainer.current as HTMLElement, headshotTl);
            }

        });

        const headshotTl = gsap.timeline({ paused: true });
        headshotTl
            .from(headshotContainer.current, {
                x: 0,
                y: 50,
                opacity: 0,
                duration: 0.75,
                ease: "power2.in",
                onComplete: () => {
                    startRotation()
                    setIntroDone(true);
                }
            })

        introTl
            .fromTo(".rocket",
                { x: 0, y: -30, opacity: 0 },
                {
                    x: 0,
                    y: textContainer.current.offsetHeight,
                    duration: 1.5,
                    ease: "power2.inOut",
                    delay: delayTime,
                    keyframes: {
                        opacity: [0, 1, 1, 0],  // invisible → visible → visible → invisible
                        easeEach: "none"
                    }
                },
                0
            )
            .from(".intro-text", {
                    x: 0,
                    y: -20,
                    opacity: 0,
                    duration: 0.75,
                    ease: "power2.inOut",
                    stagger: {
                        from: "start",
                        amount: 0.75
                    },
                    delay: delayTime + 0.1,
                },
                0
            );

        { isMobile &&
            introTl.fromTo(".scroll-down",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(".scroll-down", {
                            y: 10,          // shorter range feels smoother
                            duration: 0.75,  // slightly slower = more floaty
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut", // ← sine is much smoother than power2 for loops
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
        }
            

        const interval = setInterval(cycle, 3000);
        return () => clearInterval(interval);
    }, { scope: introContainer });

    return(
        <div ref={introContainer} className="max-w-[1080px] w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-0 text-center md:text-left">
            
            {/* Introduction Container */}
            <div ref={textContainer} className="relative flex flex-col justify-center gap-2 ">

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
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem] bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">
                        Chan Hen
                    </span>
                </div>
                
                <div className="overflow-hidden">
                    <span ref={titleRef} className="intro-text inline-block text-[1rem] md:text-[1.5rem] text-white/80">
                        Software Engineer
                    </span>
                </div>
                <span className="intro-text text-[0.75rem] md:text-[1rem] text-white/50">
                    Crafting <span className="bg-gradient-to-t from-white via-highlight to-tertiary bg-clip-text text-transparent">digital experiences</span> across the universe
                </span>

                {/* Intro Buttons */}
                <div className='intro-text flex flex-row justify-center md:justify-start items-center py-3 gap-5 text-[0.75rem] md:text-[1rem]'>
                    <a href="/Official-Resume.pdf" download  className="group inline-flex items-center justify-center w-full px-5 py-3 gap-2 rounded-md cursor-pointer text-white text-nowrap tracking-widest bg-highlight border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:scale-105 transition-all ease-in-out duration-300">
                        <span className="text-white/80">Download Resume</span>
                        <Download className="w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]" />
                    </a>
                    <Link href="/contact">
                        <button className="group inline-flex items-center justify-center w-full px-5 py-3 gap-2 rounded-md cursor-pointer text-white tracking-widest bg-highlight border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:scale-105 transition-all ease-in-out duration-300">
                            <Mail className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]"/>
                            <span>Connect</span>
                        </button>
                    </Link>
                </div>

                {/* Socials */}
                <div className='intro-text flex flex-row justify-center md:justify-start items-center gap-1 text-primary/40'>
                    <Link href="/projects">
                        <button className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md cursor-pointer text-white text-[0.75rem] md:text-[1rem] tracking-widest backdrop-blur-xs bg-primary/40 border-none shadow-[0_0_25px] shadow-tertiary hover:shadow-[0_0_5px,_0_0_25px,_0_0_50px,_0_0_100px] hover:scale-105 text-nowrap transition-all ease-in-out duration-300">
                            <span>View Projects</span>
                            <ChevronRight className="transition-transform duration-300 group-hover:translate-x-2 w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]"/>
                        </button>
                    </Link>
                    <a href="https://github.com/OfficialChanHen" target="_blank" rel="noopener noreferrer" className={`p-2 border-2 ${isMobile ? "border-primary/40" : "border-transparent"} hover:border-primary/40 rounded-md hover:scale-105 transition-all ease-in-out duration-300`}>
                        <FiGithub className='w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]'/>
                    </a>
                    <a href="https://www.linkedin.com/in/chan-hen-13727b233/" target="_blank" rel="noopener noreferrer" className={`p-2 border-2 ${isMobile ? "border-primary/40" : "border-transparent"} hover:border-primary/40 rounded-md hover:scale-105 transition-all ease-in-out duration-300`}>
                        <FiLinkedin className='w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]'/>
                    </a>
                </div>
            </div>
            {isMobile &&
                <div className="z-10 mt-2 scroll-down flex flex-col justify-center items-center gap-2 text-[0.75rem] md:text-[1.25rem] text-center">
                    Scroll Down
                    <ChevronsDown className="w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)]"/>
                </div>
            }
            
            {/* Image */}
            <div ref={headshotContainer} className='m-10'>
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