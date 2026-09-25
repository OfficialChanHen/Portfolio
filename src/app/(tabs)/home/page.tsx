'use client';

import Introduction from "@/app/(tabs)/_components/Introduction";
import RecentUpdates from "@/app/(tabs)/_components/RecentUpdates";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";
import playOrTrigger from "@/app/utils/playOrTrigger";

export default function Home() {
    const [introDone, setIntroDone] = useState(false);
    const [updatesReady, setUpdatesReady] = useState(false);
    const jobContainer = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!introDone || !jobContainer.current) return;


        const jobTl = gsap.timeline({
            paused: true,
            // Reveal the updates section only once "Available For Work" has finished animating in.
            onComplete: () => setUpdatesReady(true),
        });
        jobTl.to(jobContainer.current,
            {
                y: 0,
                opacity: 1,
                duration: 0.75,
                ease: "power2.in",
            }
        );
        playOrTrigger(jobContainer.current as HTMLElement, jobTl);


    }, { dependencies: [introDone] })

    return(
        <div className="relative min-h-dvh w-screen flex flex-col justify-start md:justify-center items-center p-10 pt-[106px] gap-5">
            <Introduction setIntroDone={setIntroDone}/>

            {/* Call to action */}
            <div ref={jobContainer} className='glass glass-hover flex flex-col justify-start items-start opacity-0 w-full max-w-[1080px] gap-2 px-6 py-5 rounded-2xl'>
                <span className="flex items-center gap-3 place-self-center md:place-self-start text-[0.95rem] md:text-[1.15rem] text-white">
                    <span className="relative flex w-2.5 h-2.5">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/70 animate-ping" />
                        <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px] shadow-emerald-400/80" />
                    </span>
                    Available For Work
                </span>
                <span className="text-center md:text-left text-[0.75rem] md:text-[0.95rem] leading-relaxed text-white/65">I&apos;m currently available for freelance projects, part-time work, and full-time opportunities. Let&apos;s <em className="text-white/90">launch</em> a project that&apos;s truly out of this world together!</span>
            </div>

            <RecentUpdates reveal={updatesReady} />
        </div>
    );
}