'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from "gsap";

type VoidRevealProps = {
    setReady: (value: boolean) => void;
}

// The entrance to the site: one layer of the void over everything, lifting
// slowly while the camera glides in behind it. Replaces the old box grid,
// which stepped and flickered.
export default function VoidReveal({ setReady }: VoidRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        setReady(true);
        const tween = gsap.to(ref.current, {
            opacity: 0,
            duration: 1.4,
            delay: 0.15,
            ease: "power2.inOut",
            onComplete: () => setDone(true),
        });
        return () => { tween.kill(); };
    }, [setReady]);

    if (done) return null;
    return <div ref={ref} aria-hidden="true" className="fixed inset-0 z-200 bg-background pointer-events-none" />;
}
