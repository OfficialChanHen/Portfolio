'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [maxBoxes, setMaxBoxes] = useState<number>(0);
    const boxContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const updateSize = () => {
            const cols = Math.floor(window.innerWidth / 100);
            const rows = Math.floor(window.innerHeight / 100);
            setMaxBoxes(cols * rows);
        };

        updateSize(); // Initial
        window.addEventListener('resize', updateSize);
        
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useGSAP(() => {
        if (mounted === true) {
            gsap.to(".box", {
                opacity: 0,
                stagger: {
                    amount: 0.5,
                    from: "center",
                    grid: "auto",
                },
                onComplete: () => {
                    gsap.set(boxContainerRef.current, { display: "none" });
                }
            })
        }
        

    }, { scope: boxContainerRef, dependencies: [maxBoxes] })

    if (mounted === false) {
        return <div className="h-screen w-screen bg-background" />;
    }

    function BoxGrid() {
        return (
            <div 
                className="box-container absolute z-10 h-screen w-screen  
                            grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] 
                            grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-0 overflow-hidden"
                ref={boxContainerRef}
            >
                {Array.from({ length: maxBoxes }).map((_, i) => (
                    <div key={i} className="box bg-background"/>
                ))}
            </div>
        );
    };


    return(
        <div className='relative h-screen w-screen flex flex-col justify-between items-center bg-linear-to-b from-secondary to-highlight'>
            <BoxGrid></BoxGrid>
            <div className='header w-screen h-[4rem] flex flex-row bg-background border-b-1 border-black drop-shadow-sm/50'></div>
            <div className='footer w-screen h-[4rem] flex flex-row bg-background border-t-1 border-black drop-shadow-sm/50'></div>
        </div>
        
    );
}