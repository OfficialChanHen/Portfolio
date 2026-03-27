'use client';

import Header from "@/app/(tabs)/_components/Header";
import Footer from "@/app/(tabs)/_components/Footer";
import BoxFade from "@/app/(tabs)/_components/BoxFade";

export default function ClientTabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const barStyle = 'w-full bg-background/30 border-white/10 backdrop-blur-lg';
    
    return (
        <div className="h-screen w-screen flex flex-col justify-between font-mono">
            <BoxFade/>
            <Header className={barStyle}/>
            <main className="flex-1">{children}</main>
            <Footer className={barStyle}/>
        </div>
    );
}