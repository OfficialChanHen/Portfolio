'use client';

import Header from "@/app/(tabs)/_components/Header";
import Footer from "@/app/(tabs)/_components/Footer";
import BoxFade from "@/app/(tabs)/_components/BoxFade";
import { useState, useEffect, useRef } from 'react';
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
    const barStyle = 'w-screen z-100 bg-background/30 border-white/10 backdrop-blur-xs text-[0.75rem] md:text-[1rem]';
    const pathname = usePathname();

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        ScrollTrigger.normalizeScroll(true);
    }, []);

    useGSAP(() => {
        if (!boxReady) return;

        ScrollSmoother.get()?.kill();

        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.5,
            smoothTouch: 0.1,
            effects: true,
        });

        smoother.scrollTo(0, false);

        gsap.fromTo("main",
            { opacity: 0 },
            { 
                opacity: 1, 
                duration: 0.4, 
                ease: "power1.out",
            }
        )

        return () => {
            smoother.kill();
        };

    }, { dependencies: [boxReady, pathname], revertOnUpdate: true });

    return (
        <div className="font-mono bg-background/30">
            <BoxFade setBoxReady={setBoxReady}/>
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