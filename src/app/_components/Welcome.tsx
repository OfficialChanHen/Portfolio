'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import SpinningCircle from "@/app/_components/SpinningCircle";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(SplitText);

type WelcomeProps = {
    setToWarp: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Welcome({ setToWarp }: WelcomeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [phase, setPhase] = useState<"welcome" | "enter">("enter");
    const [isClickLocked, setIsClickLocked] = useState(false); // prevents spam click
    const tl = gsap.timeline();

    // Welcome text faded in and out
    const speed = 1.5;
    useGSAP(() => {
        {/*
        const welcomeSplit = SplitText.create(".welcome", {
            type: "chars, words, lines",
            mask: "lines",
        });
        */}

        tl.from(".circle", {
            opacity: 0,
            duration: speed - 0.5,
            ease: "sine.out",
            stagger: {
                amount: speed - 0.5,
                from: "start"
            }
        })
        const enterSplit = SplitText.create(".enter",{
            type: "chars, words, lines",
            mask: "lines"
        });

        tl.from(enterSplit.chars, {
            opacity: 0,
            duration: speed,
            ease: "power2.out",
            stagger: {
                amount: speed,
                from: "start"
            },
        });

        enterSplit.chars.forEach((char) => {
            gsap.to(char, {
                y: gsap.utils.random(-12, 12),
                x: gsap.utils.random(-6, 6),
                rotation: gsap.utils.random(-8, 8),
                duration: gsap.utils.random(2, 4),
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });
        {/*

        tl.from(welcomeSplit.chars, {
            opacity: 0,
            duration: speed,
            ease: "power2.out",
            stagger: {
                amount: speed,
                from: "start"
            }
        });

        tl.to(welcomeSplit.chars, {
            opacity: 0,
            duration: speed,
            ease: "power2.out",
            stagger: {
                amount: speed,
                from: "end"
            },
            onComplete: () => {
                setPhase("enter");
            },
        });
        */}
    }, { scope: containerRef })
    
    // Enter text appears and floats
    {/*
    useGSAP(() => {
        if(phase === "enter") {
            const enterSplit = SplitText.create(".enter",{
                type: "chars, words, lines",
                mask: "lines"
            });

            gsap.from(enterSplit.chars, {
                opacity: 0,
                duration: speed,
                ease: "power2.out",
                stagger: {
                    amount: speed,
                    from: "start"
                },
            });

            enterSplit.chars.forEach((char) => {
                gsap.to(char, {
                    y: gsap.utils.random(-12, 12),
                    x: gsap.utils.random(-6, 6),
                    rotation: gsap.utils.random(-8, 8),
                    duration: gsap.utils.random(2, 4),
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                });
            });
        };
    }, { dependencies: [phase], scope: containerRef})
    */}

    // Enter texts fades and transition into main screen
    const { contextSafe } = useGSAP({ scope: containerRef });
    const handleEnterClick = contextSafe(() => {
        if (!isClickLocked) {
            setIsClickLocked(true);

            // fade out TAP TO ENTER
            const enterSplit = SplitText.create(".enter", {
                type: "chars, words, lines",
                mask: "lines",
            });

            tl.to(enterSplit.chars, {
                opacity: 0,
                duration: speed,
                ease: "power2.out",
                stagger: { 
                    amount: speed, 
                    from: "end" 
                },
                
            })

            tl.to(".circle", {
                opacity: 0,
                duration: speed - 0.5,
                ease: "sine.out",
                stagger: {
                    amount: speed - 0.5,
                    from: "end"
                },
                onComplete: () => {
                    setToWarp(true);
                },
            })
        }
    });
        
    return(
        <div className="h-screen w-screen bg-background flex flex-col justify-center items-center font-mono italics overflow-hidden">
            <div className="relative flex flex-col" ref={containerRef}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md/90 w-120 h-120 md:w-180 md:h-180 lg:w-220 lg:h-220">
                    <SpinningCircle
                        className="circle"
                        duration={20}
                        color="var(--color-primary)"
                        strokeWidth={5}
                        initialRotation={180}
                    />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-xl/90 w-80 h-80 md:w-120 md:h-120 lg:w-160 lg:h-160">
                    <SpinningCircle
                        className="circle"
                        duration={20}
                        color="var(--color-secondary)"
                        strokeWidth={5}
                    />
                </div>

                <button 
                    className="relative z-10 whitespace-pre text-center text-[2.25rem] tracking-widest md:text-[3rem]"
                    onClick={phase === "enter" ? handleEnterClick : undefined}
                    disabled={phase !== "enter" || isClickLocked}
                >
                    <span className="welcome" style={{ display: phase === "welcome" ? "inline-block" : "none" }}>WELCOME<br/>TRAVELER</span>
                    <span className="enter" style={{ display: phase === "enter" ? "inline-block" : "none" }}>TAP TO ENTER<br/>THE COSMOS</span>
                </button>

                
            </div>
            <Link href="/home" className="z-30 absolute bottom-8 right-8 md:bottom-10 md:right-10">
                <button className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md cursor-pointer text-white tracking-widest backdrop-blur-xs bg-secondary border border-white/10 hover:scale-105 text-nowrap transition-all ease-in-out duration-300">
                    <span className="text-[0.75rem] md:text-[1rem]">Skip</span>
                    <ChevronRight className="transition-transform duration-300 group-hover:translate-x-2 w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]"/>
                </button>
            </Link>
        </div>
    );
}