'use client';

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import Introduction from "@/app/(tabs)/_components/Introduction";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState, useRef } from "react";
import playOrTrigger from "@/app/utils/playOrTrigger";

gsap.registerPlugin(useGSAP);

export default function Home() {
    const [introDone, setIntroDone] = useState(false);
    const jobContainer = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!introDone || !jobContainer.current) return;


        const jobTl = gsap.timeline({ paused: true });
        jobTl.to(jobContainer.current, 
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
        playOrTrigger(jobContainer.current as HTMLElement, jobTl);

        
    }, { dependencies: [introDone] })

    return(
        <div className="relative w-full flex flex-col justify-start md:justify-center items-center p-10 gap-5">
            <StarBackground/>
            <Introduction setIntroDone={setIntroDone}/>

            {/* Call to action */}
            <div ref={jobContainer} className='flex flex-col justify-start items-start opacity-0 w-full max-w-[1080px] gap-2 px-5 py-3 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xs rounded-md'>        
                <span className="text-highlight place-self-center md:place-self-start text-[1rem] md:text-[1.25rem]">Available For Work</span>
                <span className="text-center md:text-left text-[0.75rem] md:text-[1rem]">I'm currently available for freelance projects, part-time work, and full-time opportunities. Let's <em>launch</em> a project that's truly out of this world together!</span>
            </div>
        </div>
    );
}