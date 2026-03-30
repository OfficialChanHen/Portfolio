'use client';

import StarBackground from "../_components/StarBackground";

export default function Home() {
    
    return(
        <div className="relative flex flex-col justify-between items-start p-10">
            <StarBackground/>
            <div className="w-full flex flex-col gap-2 p-5 bg-background/60 border border-black rounded">
                <div>Hi, I'm Chan Hen</div>
                <div>Software Engineer crafting digital experiences across the (web) universe</div>
                <div>I build exceptional web applications with modern technologies. From concept to deployment, I transform ideas into stellar digital solutions.</div>
            </div>
            
        </div>
    );
}