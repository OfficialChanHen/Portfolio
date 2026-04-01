'use client';

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loading() {
    const containerRef = useRef<HTMLDivElement>(null);
    const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

    useGSAP(() => {
        gsap.fromTo(".loader-letter",
            { y: 64, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: {
                    each: 0.07,
                    from: "start"
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="flex flex-row justify-center items-center overflow-hidden">
            {letters.map((char) => (
                <span
                    key={char}
                    className={`loader-letter h-12 w-fit text-4xl font-bold opacity-0 ${char === 'I' ? 'mx-[5px]' : ''}`}
                >
                    {char}
                </span>
            ))}
        </div>
    );
}