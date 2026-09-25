'use client';

import { Sparkles, Rocket, Mail, ChevronsDown, Download, ArrowRight } from 'lucide-react';
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

        // The scroll hint only exists on mobile.
        if (isMobile) gsap.set(".scroll-down", { opacity: 0 });
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

        if (isMobile) {
            introTl.fromTo(".scroll-down",
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

                <div className="intro-text eyebrow mx-auto md:mx-0 mb-2">
                    <Sparkles className='w-3.5 h-3.5 md:w-4 md:h-4'/>
                    <span>Welcome To My Space</span>
                </div>
                
                <div className="flex flex-col justify-center items-center md:justify-center md:items-start tracking-tight">
                    <span className="intro-text text-[1.75rem] md:text-[2.25rem] text-white/85">Hi, I&apos;m</span>
                    <span className="intro-text text-[3rem] md:text-[4.25rem] leading-[1.05] tracking-tight text-gradient pb-1">
                        Chan Hen
                    </span>
                </div>
                
                <div className="overflow-hidden">
                    <span ref={titleRef} className="intro-text inline-block text-[1rem] md:text-[1.5rem] text-white/90">
                        Software Engineer
                    </span>
                </div>
                <span className="intro-text text-[0.8rem] md:text-[1rem] text-white/60 mb-3">
                    Crafting <span className="text-gradient">digital experiences</span> across the universe
                </span>

                {/* Socials + Projects */}
                <div className='intro-text flex flex-row justify-center md:justify-start items-stretch gap-3 text-white'>
                    <Link href="/projects" className="group btn-ghost text-[0.75rem] md:text-[0.95rem]">
                        <span>View Projects</span>
                        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5 w-4 h-4 md:w-5 md:h-5"/>
                    </Link>
                    <a href="https://github.com/OfficialChanHen" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="btn-ghost px-3!">
                        <FiGithub className='w-5 h-5'/>
                    </a>
                    <a href="https://www.linkedin.com/in/chan-hen-13727b233/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn-ghost px-3!">
                        <FiLinkedin className='w-5 h-5'/>
                    </a>
                </div>

                {/* Intro Buttons */}
                <div className='intro-text flex flex-row justify-center md:justify-start items-center pt-3 pb-5 gap-3 md:gap-4 text-[0.75rem] md:text-[0.95rem]'>
                    <a href="/Chan_Hen_Resume.pdf" download className="relative btn-primary">
                        <span>Download Resume</span>
                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                        <span className='absolute -bottom-6 left-0 right-0 text-center text-[0.6rem] md:text-[0.7rem] tracking-normal text-white/45'>Embedded on the About page</span>
                    </a>
                    <Link href="/contact" className="btn-primary">
                        <Mail className="w-4 h-4 md:w-5 md:h-5"/>
                        <span>Connect</span>
                    </Link>
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
                <div className="relative overflow-visible z-10 w-[clamp(210px,50vw,410px)] h-[clamp(210px,50vw,410px)] p-3 rounded-full border border-white/10 bg-[conic-gradient(from_210deg,transparent_0deg,color-mix(in_oklab,var(--highlight)_55%,transparent)_70deg,transparent_140deg,transparent_220deg,color-mix(in_oklab,var(--tertiary)_70%,transparent)_290deg,transparent_360deg)] shadow-[0_0_90px_-20px] shadow-highlight/50">
                    <div className="headshot absolute z-20 top-[50%] left-[0%] -translate-x-1/2 -translate-y-1/2 eyebrow p-2! rounded-full!">
                        <FaReact className='w-[clamp(16px,2vw,22px)] h-[clamp(16px,2vw,22px)]' />
                    </div>
                    <div className="headshot absolute z-20 top-[50%] left-[100%] -translate-x-1/2 -translate-y-1/2 eyebrow p-2! rounded-full!">
                        <AiOutlinePython className='w-[clamp(16px,2vw,22px)] h-[clamp(16px,2vw,22px)]' />
                    </div>
                    <div className="headshot w-full h-full rounded-full ring-1 ring-white/20 bg-[url('/headshot.jpg')] bg-cover bg-center shadow-[inset_0_0_40px_rgba(9,1,15,0.35)]"/>
                </div>
            </div>

        </div>
    );
}