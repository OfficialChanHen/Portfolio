'use client';

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import Introduction from "@/app/(tabs)/_components/Introduction";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function Home() {
    const jobContainer = useRef<HTMLDivElement>(null);
    const [introDone, setIntroDone] = useState(false);

    useGSAP(() => {
        if (!introDone) return;

        gsap.to(".job-container", 
            {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(".job-icon", 
                        {
                            backgroundColor: "#9b317f",
                            duration: 2,
                            yoyo: true, 
                            repeat: -1,
                        }
                    );
                }
            }
        );

        
    }, { dependencies: [introDone] })

    return(
        <div className="relative w-full flex flex-col justify-start md:justify-center items-center p-10 gap-5">
            <StarBackground/>
            <Introduction setIntroDone={setIntroDone}/>

            {/* Call to action */}
            <div className='job-container opacity-0 -translate-y-5 w-full max-w-[1080px] px-5 py-3 bg-highlight/20 backdrop-blur-xs text-white/80 text-[0.75rem] md:text-[1rem] border border-highlight rounded-md '>
                <div className='flex flex-row justify-start items-center gap-2 text-highlight mb-2'>
                    <div className='job-icon w-[clamp(10px,2vw,14px)] h-[clamp(10px,2vw,14px)] bg-highlight rounded-full'/>
                    <span>Available For Work</span>
                </div>
                <span>I'm currently available for freelance projects, part-time work, and full-time opportunities. Let's <em>launch</em> a project that's truly out of this world together!</span>
            </div>
        </div>
    );
}