'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import SpinningCircle from "@/app/_components/SpinningCircle";

gsap.registerPlugin(useGSAP, SplitText);

export default function Welcome() {
    const containerRef = useRef<HTMLDivElement>(null);
    let tl = gsap.timeline();
    
    useGSAP(() => {
        let split = SplitText.create(".words",{
            type: "chars, words, lines",
            mask: "lines"
        });

        // Fade in-animation
        gsap.from(split.chars, {
            opacity: 0,
            duration: 4,
            ease: "power2.out",
            stagger: {
                amount: 1.2,
                from: "start"
            }
        });

        split.chars.forEach((char) => {
        const randomFloat = () => {
            gsap.to(char, {
            y: gsap.utils.random(-12, 12),
            x: gsap.utils.random(-6, 6),
            rotation: gsap.utils.random(-8, 8),
            duration: gsap.utils.random(2, 4),
            ease: "sine.inOut",
            onComplete: randomFloat, // recursively calls itself with new random values
            });
        };

        gsap.delayedCall(Math.random() * 2, randomFloat); // stagger the start
        });
    }, {scope: containerRef})
    

    return(
        <div className="h-screen w-screen bg-background flex flex-col justify-center items-center font-mono italics overflow-hidden">
            <div className="relative flex flex-col" ref={containerRef}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg/80
                                w-80 h-80 md:w-120 md:h-120 lg:w-160 lg:h-160">
                    <SpinningCircle
                        duration={20}
                        color="var(--color-secondary)"
                        strokeWidth={5}
                    />
                </div>


                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg/70
                                w-120 h-120 md:w-160 md:h-160 lg:w-200 lg:h-200">
                    <SpinningCircle
                        duration={20}
                        color="var(--color-primary)"
                        strokeWidth={5}
                        initialRotation={180}
                    />
                </div>

                <span className="relative z-10 words text-center text-[2.25rem] tracking-widest md:text-[3rem]">
                    WELCOME<br/>TRAVELER
                </span>
            </div>
        </div>
    );
}