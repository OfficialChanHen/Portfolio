'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import SpinningCircle from "@/app/_components/SpinningCircle";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(SplitText);

type WelcomeProps = {
    setToWarp: React.Dispatch<React.SetStateAction<boolean>>
};

// How far the pointer's anti-gravity reaches, and the most it moves a letter.
// Small enough that "TAP TO ENTER THE COSMOS" always stays readable.
const REPEL_RADIUS = 150;
const REPEL_MAX = 26;

export default function Welcome({ setToWarp }: WelcomeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const chars = useRef<HTMLElement[]>([]);
    const introTl = useRef<gsap.core.Timeline | null>(null);
    const leaving = useRef(false);

    const speed = 1.5;

    useGSAP(() => {
        if (!textRef.current) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Split once. Re-splitting later would swap in fresh letters mid-animation,
        // which is what used to freeze the intro when it was clicked early.
        // No line masks: letters need to float past their line box without clipping.
        const split = SplitText.create(textRef.current, { type: "chars, words" });
        chars.current = split.chars as HTMLElement[];

        introTl.current = gsap.timeline()
            .from(".circle", { opacity: 0, duration: speed - 0.5, ease: "sine.out", stagger: { amount: speed - 0.5, from: "start" } })
            .from(chars.current, { opacity: 0, duration: speed, ease: "power2.out", stagger: { amount: speed, from: "start" } });

        if (reduced) return;

        // Each letter drifts on its own slow orbit, and is pushed away from the
        // pointer (or finger) as if it were an anti-gravity point, springing back
        // once it passes.
        const state = chars.current.map(() => ({
            phase: Math.random() * Math.PI * 2,
            rate: 0.35 + Math.random() * 0.3,
            cx: 0, cy: 0,      // resting centre on screen
            px: 0, py: 0,      // current push
        }));
        const setX = chars.current.map((c) => gsap.quickSetter(c, "x", "px"));
        const setY = chars.current.map((c) => gsap.quickSetter(c, "y", "px"));
        const setR = chars.current.map((c) => gsap.quickSetter(c, "rotation", "deg"));

        const measure = () => {
            chars.current.forEach((c, i) => {
                const r = c.getBoundingClientRect();
                const x = Number(gsap.getProperty(c, "x")) || 0, y = Number(gsap.getProperty(c, "y")) || 0;
                state[i].cx = r.left + r.width / 2 - x;
                state[i].cy = r.top + r.height / 2 - y;
            });
        };
        measure();
        window.addEventListener("resize", measure);

        const pointer = { x: -9999, y: -9999 };
        const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
        const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
        // A finger lifting ends its push; a mouse keeps pushing where it rests.
        const onUp = (e: PointerEvent) => { if (e.pointerType !== "mouse") onLeave(); };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerdown", onMove);
        window.addEventListener("pointerup", onUp);
        document.addEventListener("pointerleave", onLeave);

        const tick = (time: number) => {
            if (leaving.current) return;
            chars.current.forEach((_, i) => {
                const s = state[i];
                const t = time * s.rate + s.phase;
                const fx = Math.sin(t) * 5, fy = Math.cos(t * 0.8) * 7;

                const dx = s.cx - pointer.x, dy = s.cy - pointer.y;
                const dist = Math.hypot(dx, dy);
                let tx = 0, ty = 0;
                if (dist < REPEL_RADIUS && dist > 0.01) {
                    const push = Math.pow(1 - dist / REPEL_RADIUS, 2) * REPEL_MAX;
                    tx = (dx / dist) * push;
                    ty = (dy / dist) * push;
                }
                s.px += (tx - s.px) * 0.12;
                s.py += (ty - s.py) * 0.12;

                setX[i](fx + s.px);
                setY[i](fy + s.py);
                setR[i](Math.sin(t * 0.7) * 4 + s.px * 0.25);
            });
        };
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("resize", measure);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onMove);
            window.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointerleave", onLeave);
        };
    }, { scope: containerRef });

    // Tap to enter: the letters float off into space, then the rings fade and the
    // warp begins. Starts at once, however far the intro has got.
    function handleEnterClick() {
        if (leaving.current) return;
        leaving.current = true;
        introTl.current?.kill();

        gsap.timeline({ onComplete: () => setToWarp(true) })
            .to(chars.current, {
                x: () => gsap.utils.random(-160, 160),
                y: () => gsap.utils.random(-220, -80),
                rotation: () => gsap.utils.random(-50, 50),
                scale: () => gsap.utils.random(0.6, 1.1),
                opacity: 0,
                duration: 1.8,
                ease: "power1.in",
                stagger: { amount: 0.6, from: "center" },
            })
            .to(containerRef.current?.querySelectorAll(".circle") ?? [], {
                opacity: 0,
                duration: speed - 0.5,
                ease: "sine.out",
                stagger: { amount: 0.5, from: "end" },
            }, 0.6);
    }

    return(
        <div className="h-screen w-screen bg-background flex flex-col justify-center items-center font-mono overflow-hidden">
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
                    className="relative z-10 whitespace-pre text-center text-[2.25rem] tracking-widest md:text-[3rem] cursor-pointer"
                    onClick={handleEnterClick}
                >
                    <span ref={textRef} className="inline-block">TAP TO ENTER<br/>THE COSMOS</span>
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
