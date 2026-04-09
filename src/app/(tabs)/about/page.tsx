import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { Mail } from "lucide-react";

export default function About() {
    return(
        <div className="w-full h-full flex flex-col justify-start md:justify-center items-center">
            <StarBackground/>
            <div className="min-w-screen min-h-[calc(100vh-64px)] flex flex-col justify-center items-center p-10 border border-white">
                {/* Tech Stack */}
                <div className="w-full max-w-[1080px] flex flex-col md:flex-row justify-center items-stretch gap-5 border border-blue-400">

                    {/* Frontend */}
                    <div className="w-full flex flex-col justify-start items-start bg-primary/60 rounded-xl backdrop-blur-xs p-10 gap-5">
                        <div className="flex flex-row justify-start items-center gap-3 text-[1rem] md:text-[1.25rem]">
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 border border-highlight bg-tertiary text-highlight rounded-md">
                                <Mail className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            Frontend
                        </div>
                        <ul className="list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem]">
                            <li>Typescript</li>
                            <li>React</li>
                            <li>Tailwind CSS</li>
                            <li>Next.js</li>
                            <li>GSAP</li>
                            <li>React Three Fiber</li>
                            <li>React Native</li>
                        </ul>
                    </div>

                    {/* Backend */}
                    <div className="w-full flex flex-col justify-start items-start bg-primary/60 rounded-xl backdrop-blur-xs p-10 gap-5">
                        <div className="flex flex-row justify-start items-center gap-3 text-[1rem] md:text-[1.25rem]">
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 border border-highlight bg-tertiary text-highlight rounded-md">
                                <Mail className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            Backend
                        </div>
                        <ul className="list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem]">
                            <li>Python</li>
                            <li>Java</li>
                            <li>C</li>
                            <li>SQL</li>
                            <li>RESTful APIs</li>
                            <li>GSAP</li>
                            <li>React Three Fiber</li>
                        </ul>
                    </div>

                    {/* Tools */}
                    <div className="w-full flex flex-col justify-start items-start bg-primary/60 rounded-xl backdrop-blur-xs p-10 gap-5">
                        <div className="flex flex-row justify-start items-center gap-3 text-[1rem] md:text-[1.25rem]">
                            <div className="relative w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)] flex flex-row justify-center items-center p-5 border border-highlight bg-tertiary text-highlight rounded-md">
                                <Mail className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[clamp(18px,2vw,20px)] h-[clamp(18px,2vw,20px)]"/>
                            </div>
                            Tools & Others
                        </div>
                        <ul className="list-disc marker:text-highlight pl-5 space-y-2 text-[0.75rem] md:text-[1rem]">
                            <li>Figma</li>
                            <li>Git</li>
                            <li>Github</li>
                            <li>Docker</li>
                            <li>R</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="min-w-screen min-h-[calc(100vh-64px)] bg-tertiary/60">test2</div>
        </div>
    )
}