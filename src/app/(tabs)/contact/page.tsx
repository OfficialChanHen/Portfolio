'use client';

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { MessagesSquare } from 'lucide-react';

export default function contacts() {
    return(
        <div className="relative w-full h-full flex flex-col justify-start md:justify-center items-center p-10">
            <StarBackground/>

            {/* Contact Intro */}
            <div className="flex flex-col justify-center items-center text-center">
                <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                    <MessagesSquare className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]'/>
                    <span>Let's Connect</span>
                </div>
                
                <div className="flex flex-row justify-center items-center md:justify-center md:items-start tracking-tight gap-[2ch]">
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem]">Get In</span>
                    <span className="intro-text text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-highlight via-tertiary to-highlight bg-clip-text text-transparent">
                        Touch
                    </span>
                </div>

                <span className="text-[1rem] md:text-[1.5rem] text-white/80">Have a project in mind or just want to chat? I'd love to hear from you!</span>
            </div>

            {/* Email */}
            <div className="flex flex-col xl:flex-row">
                <div className="flex">test</div>
                <div>test2</div>
            </div>
        </div>
    );
}