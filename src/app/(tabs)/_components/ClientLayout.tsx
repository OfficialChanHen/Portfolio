'use client';

import Header from "@/app/(tabs)/_components/Header";
import Footer from "@/app/(tabs)/_components/Footer";
import VoidReveal from "@/app/(tabs)/_components/VoidReveal";
import SpaceBackground from "@/app/(tabs)/_components/space/SpaceBackground";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

export default function ClientTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [boxReady, setBoxReady] = useState(false);
    const barStyle = 'w-screen z-100 bg-background/45 border-white/[0.07] backdrop-blur-xl backdrop-saturate-150 text-[0.75rem] md:text-[1rem]';
    const pathname = usePathname();

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        ScrollTrigger.normalizeScroll(true);
    }, []);

    useGSAP(() => {
        if (!boxReady) return;


        let smoother = ScrollSmoother.get();
        if (!smoother) {
            smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.5,
                smoothTouch: 0.1,
                effects: true,
            });
        }

        requestAnimationFrame(() => {
            smoother.scrollTo(0, false);
            ScrollTrigger.refresh();
        });

        gsap.fromTo("main",
            { opacity: 0 },
            { opacity: 1, duration: 0.7, ease: "power2.out" }
        );


    }, { dependencies: [boxReady, pathname] });

    return (
        <div className="font-mono">
            {/* Lives outside the smooth-scroll wrapper so it stays fixed, and
                persists across tabs so the WebGL scene is built once. */}
            <SpaceBackground />
            <VoidReveal setReady={setBoxReady}/>
            {boxReady && (
                <>
                    <Header className={barStyle}/>

                    <div id="smooth-wrapper">
                        <div id="smooth-content">
                            <main className="flex flex-col justify-center items-center">
                                {children}
                            </main>
                            <Footer className={barStyle}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}