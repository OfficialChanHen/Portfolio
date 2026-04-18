'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const images = [
    'https://picsum.photos/seed/alpha/400/600',
    'https://picsum.photos/seed/bravo/400/600',
    'https://picsum.photos/seed/charlie/400/600',
    'https://picsum.photos/seed/delta/400/600',
    'https://picsum.photos/seed/echo/400/600',
    'https://picsum.photos/seed/foxtrot/400/600',
    'https://picsum.photos/seed/golf/400/600',
];

export default function CardCarousel() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const currentIndex = useRef(0);
    const isAnimating = useRef(false);

    const CARD_WIDTH = 224; // w-56 = 14rem = 224px
    const GAP = 24;
    const STEP = CARD_WIDTH + GAP;

    const goTo = (index: number) => {
        if (isAnimating.current) return;
        const track = trackRef.current;
        if (!track) return;

        const clamped = Math.max(0, Math.min(index, images.length - 1));
        currentIndex.current = clamped;
        isAnimating.current = true;

        gsap.to(track, {
            x: -clamped * STEP,
            duration: 0.6,
            ease: 'power3.out',
            onComplete: () => { isAnimating.current = false; },
        });

        // update active card styles
        gsap.to('.carousel-card', { scale: 0.85, opacity: 0.5, duration: 0.4 });
        gsap.to(`.carousel-card:nth-child(${clamped + 1})`, { scale: 1, opacity: 1, duration: 0.4 });
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // set initial card states
        gsap.set('.carousel-card', { scale: 0.85, opacity: 0.5 });
        gsap.set('.carousel-card:first-child', { scale: 1, opacity: 1 });

        // scroll-driven navigation
        let lastProgress = 0;
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${images.length * 300}`,
            pin: true,
            scrub: false,
            onUpdate(self) {
                const progress = self.progress;
                const targetIndex = Math.round(progress * (images.length - 1));
                if (targetIndex !== currentIndex.current) {
                    goTo(targetIndex);
                }
                lastProgress = progress;
            },
        });

        ScrollTrigger.refresh();

        return () => trigger.kill();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-w-screen min-h-[calc(100dvh-66px)] flex flex-col justify-between items-center p-10 gap-10 bg-primary overflow-hidden"
        >
            {/* Track */}
            <div className="relative w-full flex justify-center items-center">
                <div
                    ref={trackRef}
                    className="flex gap-6 will-change-transform"
                    style={{ paddingInline: `calc(50vw - ${CARD_WIDTH / 2}px)` }}
                >
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="carousel-card flex-shrink-0 w-56 rounded-2xl overflow-hidden cursor-pointer"
                            style={{ aspectRatio: '9/16' }}
                            onClick={() => goTo(i)}
                        >
                            <img
                                src={src}
                                alt={`Card ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                    onClick={() => goTo(currentIndex.current - 1)}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {/* Dots */}
                <div className="flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                i === currentIndex.current ? 'bg-white w-5' : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={() => goTo(currentIndex.current + 1)}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}