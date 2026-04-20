"use client";

import StarBackground from "@/app/(tabs)/_components/StarBackground";
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

            <div className="w-screen max-w-[1080px] h-dvh flex flex-col justify-center items-center gap-5 p-10 pt-[106px]">

                <div className="w-full flex-1 flex flex-row justify-start items-stretch">
                    <div className="w-full flex-1 flex flex-col md:flex-row justify-start items-stretch bg-gradient-to-br from-white/5 to-white/[0.02] bg-primary rounded-2xl drop-shadow-lg/60">
                        {/* Image — 1/3 */}
                        <div
                            className="basis-1/3 md:basis-1/2 shrink-0 bg-cover bg-center rounded-2xl"
                            style={{ backgroundImage: `url(/TFT.png)` }}
                        />

                        {/* Content — 2/3 */}
                        <div className="basis-2/3 md:basis-1/2">
                            {/* your content here */}
                        </div>
                    </div>    
                </div>
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