'use client';

import Header from "@/app/(tabs)/_components/Header";
import Footer from "@/app/(tabs)/_components/Footer";
import BoxFade from "@/app/(tabs)/_components/BoxFade";
import { useState } from 'react';

export default function ClientTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [boxReady, setBoxReady] = useState(false);
    const barStyle = 'w-full bg-background/30 border-white/10 backdrop-blur-lg text-[0.75rem] md:text-[1rem]';
    
    return (
        <div className="h-screen w-screen flex flex-col font-mono">
            <BoxFade setBoxReady={setBoxReady}/>
            {boxReady && (
                <>
                    <Header className={`fixed top-0 left-0 z-10 ${barStyle}`}/>
                    <main className="flex-1 py-16">{children}</main>
                    <Footer className={`fixed bottom-0 left-0 z-10 ${barStyle}`}/>
                </>
            )}
        </div>
    );
}