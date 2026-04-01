'use client';

import Header from "@/app/(tabs)/_components/Header";
import Footer from "@/app/(tabs)/_components/Footer";
import BoxFade from "@/app/(tabs)/_components/BoxFade";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ClientTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [boxReady, setBoxReady] = useState(false);
    const barStyle = 'w-full z-100 bg-background/30 border-white/10 backdrop-blur-xs text-[0.75rem] md:text-[1rem]';
    const pathname = usePathname();

    useGSAP(() => {
        gsap.fromTo("main", 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.4, ease: "power1.out" }
        );
    }, { dependencies: [pathname] });
    
    return (
        <div className="min-h-screen max-w-screen z-0 flex flex-col font-mono bg-background/30 ">
            <BoxFade setBoxReady={setBoxReady}/>
            {boxReady && (
                <>
                    <Header className={`${barStyle}`}/>
                    <main className="overflow-hidden h-full w-full flex-1">{children}</main>
                    <Footer className={`${barStyle}`}/>
                </>
            )}
        </div>
    );
}