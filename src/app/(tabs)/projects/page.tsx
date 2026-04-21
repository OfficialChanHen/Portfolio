"use client";

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const images = [
    'https://picsum.photos/seed/alpha/400/600',
    'https://picsum.photos/seed/bravo/400/600',
    'https://picsum.photos/seed/charlie/400/600',
    'https://picsum.photos/seed/delta/400/600',
    'https://picsum.photos/seed/echo/400/600',
    'https://picsum.photos/seed/foxtrot/400/600',
    'https://picsum.photos/seed/golf/400/600',
];

export default function Projects() {
    const [ currentIndex, setCurrentIndex ] = useState(0);

    useGSAP(() => {

    }, { dependencies: [] })

    function handlePrevClick() {
        setCurrentIndex((prev) => {
            if (prev - 1 < 0) {
                return 0;
            }

            return prev - 1;
        })
    }

    function handleNextClick() {
        setCurrentIndex((prev) => {
            if (prev + 1 >= images.length) {
                return images.length - 1;
            }

            return prev + 1
        })
    }

    return(
        <div className="relative w-screen flex flex-col justify-start items-center bg-secondary">
            <StarBackground />
            {/* Intro Page */}

            {/* Projects */}
            <div className="w-screen max-w-[1080px] h-dvh flex flex-col justify-center items-center gap-5 p-10 pt-[106px]">

                <div className="w-[120vw] h-full flex flex-row justify-center items-center gap-4 border border-white/20">
                    <div className="w-[clamp(300px,30vw,400px)] h-[90%] flex flex-col justify-center items-center p-3 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/20 rounded-2xl">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <img src="/TFT.png" alt="TFT image" className="absolute bottom-0 h-full w-[160%] object-cover"/>
                        </div>
                    </div>

                    <div className="w-[clamp(300px,30vw,400px)] h-[90%] flex flex-col justify-center items-center p-3 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/20 rounded-2xl">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <img src="/TFT.png" alt="TFT image" className="absolute bottom-0 h-full w-[160%] object-cover"/>
                        </div>
                    </div>      
                </div>

                {/* Next and Prev buttons */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={handlePrevClick}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronLeft className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>

                    <div className="flex items-center gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`h-2 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === currentIndex ? 'w-8 md:w-15 bg-white' : 'w-2 md:w-3 bg-white/30'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNextClick}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronRight className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>
                </div>

            </div>
        </div>
    )
}