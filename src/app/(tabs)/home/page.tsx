'use client';

import StarBackground from "../_components/StarBackground";
import { Sparkles } from 'lucide-react';

export default function Home() {
    
    return(
        <div className="relative w-full h-full flex flex-col justify-start items-center p-10">
            <StarBackground/>

            {/* Introduction */}
            <div className="max-w-[1000px] w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 text-center md:text-left">
                {/* Introduction Text */}
                <div className="flex flex-col justify-center gap-2">
                    <div className="w-fit mx-auto md:mx-0 flex flex-row justify-center md:justify-start items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <Sparkles size={20}/>
                        <span>Welcome To My Space</span>
                    </div>
                    <div className="flex flex-col justify-center items-center md:justify-center md:items-start tracking-tight">
                        <span className="text-[2rem] md:text-[2.5rem]">Hi, I'm</span>
                        <span className="text-[2.5rem] md:text-[3.5rem] bg-gradient-to-r from-tertiary via-highlight to-tertiary bg-clip-text text-transparent">
                            Chan Hen
                        </span>
                    </div>
                    
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">Software Engineer</span>
                    <span className="text-[0.75rem] md:text-[1rem] text-white/50">Crafting digital experiences across the universe</span>
                </div>
                
                {/* Image */}
                <div className="max-w-[300px] min-w-[200px] aspect-[1/1] w-1/2 rounded-full border-2 border-parchment bg-[url('/headshot.jpg')] bg-cover bg-center"/>
            </div>
        </div>
    );
}