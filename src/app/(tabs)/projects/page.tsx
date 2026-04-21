"use client";

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { useNavigationMode } from "@/providers/NavigationModeProvider";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, ChevronsDown, Rocket, Wrench } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";


const images = [1, 2, 3, 4, 5];

export default function Projects() {
    const textContainer = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [projectOpen, setProjectOpen] = useState(false);

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;

    useGSAP(() => {
        if (!textContainer.current) return;

        gsap.set(".scroll-down", { opacity: 0 });

        // --- Intro animation ---
        const introTl = gsap.timeline();
        introTl
            .fromTo(".rocket",
                { x: 0, y: -30, opacity: 0 },
                {
                    x: 0,
                    y: textContainer.current.offsetHeight,
                    duration: 1.6,
                    ease: "power2.inOut",
                    delay: delayTime,
                    keyframes: {
                        opacity: [0, 1, 1, 0],
                        easeEach: "none",
                    },
                },
                0
            )
            .fromTo(".intro-text",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.inOut",
                    delay: delayTime + 0.3,
                    stagger: { from: "start", amount: 0.65 },
                },
                0
            )
            .fromTo(".scroll-down",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.65,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(".scroll-down", {
                            y: 10,          // shorter range feels smoother
                            duration: 0.75,  // slightly slower = more floaty
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut", // ← sine is much smoother than power2 for loops
                        });

                        gsap.fromTo(".scroll-down",
                            { opacity: 1 },
                            {
                                opacity: 0,
                                scrollTrigger: {
                                    trigger: ".scroll-down",
                                    start: "top center",
                                    end: "bottom center",
                                    toggleActions: "play none none reverse",
                                },
                            }
                        );
                    },
                }
            );
            


        // --- Fade in elements ---
        gsap.utils.toArray<Element>(".fade-in").forEach((el) => {
            gsap.set(el, { opacity: 0, y: 30 });
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 60%",
                        end: () => "bottom 50%",
                        toggleActions: "play none none reverse"
                    },
                }
            );
        });

        // --- Fade in lists ---
        gsap.utils.toArray<Element>(".fade-in-list").forEach((list) => {
            gsap.set(list.children, { opacity: 0, y: 30 });
            gsap.fromTo(list.children,
                { y: 30, opacity: 0 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    stagger: { each: 0.3, from: "start" },
                    scrollTrigger: {
                        trigger: list,
                        start: "top 60%",
                        end: () => "bottom 50%",
                        toggleActions: "play none none reverse"
                    },
                }
            );
        });
    }, { dependencies: [] });

    function handleProjectClick() {
        const scroller = ScrollSmoother.get();
        scroller?.scrollTo("#projects", true, "top top");
        const projectOpenTL = gsap.timeline();

        if (!projectOpen) {
            projectOpenTL
                .set(".project", { position: "absolute", zIndex: 50 })
                .to(".project", {
                    width: "100vw",
                    height: "100dvh",
                    borderRadius: 0,
                    ease: "power2.inOut",
                    duration: 0.5,
                });
        } else {
            projectOpenTL
                .to(".project", {
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    ease: "power2.inOut",
                    duration: 0.5,
                })
                .set(".project", { position: "relative", zIndex: "0" });
        }

        setProjectOpen(prev => !prev);
    }

    function handlePrevClick() {
        setCurrentIndex((prev) => {
            if (prev - 1 < 0) {
                return 0;
            }

            return prev - 1;
        })
    }

    function handleNextClick() {
        setCurrentIndex((prev) => {
            if (prev + 1 >= images.length) {
                return images.length - 1;
            }

            return prev + 1
        })
    }
    

    // Charles Patterson inspo
    return(
        <div className="relative w-screen flex flex-col justify-start items-center bg-secondary">
            <StarBackground />
            {/* Intro Page */}

            {/* Intro Page */}
            <section id="intro" className="w-screen min-h-dvh flex flex-col justify-between items-center p-10 pt-[66px] gap-10 bg-primary scroll-mt-[var(--nav-height)]">
                <div>{/* Spacer */}</div>
                
                <div ref={textContainer} className="text-container relative max-w-[1080px] flex flex-col justify-center items-center text-center gap-2">
                    <div className='rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100'>
                        <Rocket size={20} />
                    </div>
                    <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <Wrench className='w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]' />
                        <span>Built For The Stars</span>
                    </div>
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">Explore</span>{" "}My Projects
                    </h2>
                    <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">
                        From <span className="text-gradient">concept to launch</span>, these projects are fueled by <span className="text-gradient">curiosity</span> and a drive to <span className="text-gradient">create something that matters</span>
                    </span>
                </div>

                {/* Scroll Down */}
                <div className="scroll-down flex flex-col justify-center items-center gap-2 text-[0.75rem] md:text-[1.25rem] text-center">
                    Scroll Down
                    <ChevronsDown className="w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)]"/>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="w-screen max-w-[1080px] h-dvh flex flex-col justify-center items-center gap-5 p-10">

                {/* Project Carousel */}
                <div className="projects-carousel w-[clamp(300px,120vw,1400px)] h-full flex flex-row justify-center items-center gap-[clamp(8px,2vw,24px)]">
                    <div 
                        className="relative w-[clamp(300px,40vw,600px)] h-[clamp(300px,90%,800px)] flex flex-col justify-center items-center p-[clamp(8px,1vw,12px)] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/20 rounded-2xl"
                        onClick={handleProjectClick}   
                    >    
                        <div className="project relative w-full h-full rounded-2xl overflow-hidden">
                            <img src="/TFT.png" alt="TFT image" className="absolute bottom-0 h-full w-[160%] object-cover"/>
                        </div>

                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-[clamp(8px,1vw,12px)] px-[clamp(12px,2vw,20px)] bg-linear-to-br from-tertiary to-highlight rounded-lg text-[clamp(0.875rem,2vw,1.5rem)] text-nowrap">
                            Teamfight Tactics
                        </div>
                    </div>      
                </div>

                {/* Next and Prev buttons */}
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${projectOpen ? "z-100 bg-secondary" : "z-0"} flex justify-center items-center p-3 rounded-full gap-4 transition-all ease-in-out duration-400`}>
                    <button
                        onClick={handlePrevClick}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronLeft className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>

                    <div className="flex items-center gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`h-2 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === currentIndex ? 'w-8 md:w-15 bg-white' : 'w-2 md:w-3 bg-white/30'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNextClick}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronRight className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>
                </div>

            </section>
        </div>
    )
}