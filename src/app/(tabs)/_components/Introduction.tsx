'use client';

import { Sparkles, FileBracesCorner, Computer, Rocket } from 'lucide-react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, TextPlugin);

export default function Introduction() {
    const introContainer = useRef<HTMLDivElement>(null);
    const titles = ["Software Engineer", "Web Developer", "Creative Technologist", "Volleyball Enthusiast", "Horror Connoisseur"];
    const currentIndex = useRef(0);
    const titleRef = useRef<HTMLSpanElement>(null);
    const textContainer = useRef<HTMLDivElement>(null);
    const tl = gsap.timeline();

    useGSAP(() => {
        if (!titleRef.current || !textContainer.current) return;

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
            ease: "power2.in",
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
            onComplete: () => {
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
                })
            }
        })

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

            {/* Introduction Text */}
            <div ref={textContainer} className="relative flex flex-col justify-center gap-2">
                {/* Rocket */}
                <div className='rocket absolute top-0 left-[48%] md:-left-8 z-20 rotate-135'>
                    <Rocket size={20}/>
                </div>

                <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                    <Sparkles size={20}/>
                    <span>Welcome To My Space</span>
                </div>
                
                <div className="flex flex-col justify-center items-center md:justify-center md:items-start tracking-tight">
                    <span className="intro-text text-[2rem] md:text-[2.5rem]">Hi, I'm</span>
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-tertiary via-highlight to-tertiary bg-clip-text text-transparent">
                        Chan Hen
                    </span>
                </div>
                
                <div className="overflow-hidden">
                    <span ref={titleRef} className="intro-text inline-block text-[1rem] md:text-[1.5rem] text-white/80">
                        Software Engineer
                    </span>
                </div>
                <span className="intro-text text-[0.75rem] md:text-[1rem] text-white/50">Crafting digital experiences across the universe</span>
            </div>
            
            {/* Image */}
            <div className='headshot-container overflow-hidden p-10'>
                <div className="relative z-10 w-[clamp(200px,30vw,400px)] aspect-[1/1] w-1/2 p-2 border-t border-b border-highlight/80 rounded-full">
                    <div className="headshot absolute z-20 top-[50%] left-[0%] -translate-x-1/2 -translate-y-1/2 bg-highlight/20 backdrop-blur-xs border border-highlight text-highlight rounded-full p-2">
                        <FileBracesCorner size={20} />
                    </div>
                    <div className="headshot absolute z-20 top-[50%] left-[100%] -translate-x-1/2 -translate-y-1/2 bg-highlight/20 backdrop-blur-xs border border-highlight text-highlight rounded-full p-2">
                        <Computer size={20} />
                    </div>
                    <div className="headshot w-full h-full rounded-full border-2 border-parchment bg-[url('/headshot.jpg')] bg-cover bg-center"/>
                </div>
            </div>
            
        </div>
    );
}