"use client";

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { useNavigationMode } from "@/providers/NavigationModeProvider";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, ChevronsDown, Rocket, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper";

// --- Project Data ---
const projects = [
    { id: 1, title: "Teamfight Tactics", image: "/TFT.png", tags: ["React", "TypeScript"], description: "A description of the project goes here." },
    { id: 2, title: "Project Two", image: "/TFT.png", tags: ["Next.js", "GSAP"], description: "A description of the project goes here." },
    { id: 3, title: "Project Three", image: "/TFT.png", tags: ["Python", "FastAPI"], description: "A description of the project goes here." },
    { id: 4, title: "Project Four", image: "/TFT.png", tags: ["Three.js", "WebGL"], description: "A description of the project goes here." },
    { id: 5, title: "Project Five", image: "/TFT.png", tags: ["Tailwind", "Framer"], description: "A description of the project goes here." },
];

export default function Projects() {
    const textContainer = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [projectOpen, setProjectOpen] = useState(false);

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;

    // --- GSAP intro + scroll animations (unchanged) ---
    useGSAP(() => {
        if (!textContainer.current) return;

        gsap.set(".scroll-down", { opacity: 0 });
        gsap.set(".project-content", { opacity: 0, y: 20 });

        const introTl = gsap.timeline();
        introTl
            .fromTo(".rocket",
                { x: 0, y: -30, opacity: 0 },
                {
                    x: 0, y: textContainer.current.offsetHeight, duration: 1.6,
                    ease: "power2.inOut", delay: delayTime,
                    keyframes: { opacity: [0, 1, 1, 0], easeEach: "none" },
                }, 0
            )
            .fromTo(".intro-text",
                { y: -20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.65,
                    ease: "power2.inOut", delay: delayTime + 0.3,
                    stagger: { from: "start", amount: 0.65 },
                }, 0
            )
            .fromTo(".scroll-down",
                { y: -20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.65, ease: "power2.out",
                    onComplete: () => {
                        gsap.to(".scroll-down", { y: 10, duration: 0.75, repeat: -1, yoyo: true, ease: "sine.inOut" });
                        gsap.fromTo(".scroll-down", { opacity: 1 }, {
                            opacity: 0,
                            scrollTrigger: {
                                trigger: ".scroll-down",
                                start: "top center", end: "bottom center",
                                toggleActions: "play none none reverse",
                            },
                        });
                    },
                }
            );

        gsap.utils.toArray<Element>(".fade-in").forEach((el) => {
            gsap.set(el, { opacity: 0, y: 30 });
            gsap.fromTo(el, { y: 30, opacity: 0 }, {
                opacity: 1, y: 0, duration: 1, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" },
            });
        });

        gsap.utils.toArray<Element>(".fade-in-list").forEach((list) => {
            gsap.set(list.children, { opacity: 0, y: 30 });
            gsap.fromTo(list.children, { y: 30, opacity: 0 }, {
                opacity: 1, y: 0, duration: 1, ease: "power2.out",
                stagger: { each: 0.3, from: "start" },
                scrollTrigger: { trigger: list, start: "top 60%", toggleActions: "play none none reverse" },
            });
        });
    }, { dependencies: [] });

    // --- Swiper slide change: GSAP parallax on incoming image ---
    function handleSlideChange(swiper: SwiperType) {
        const nextIndex = swiper.realIndex;
        const direction = nextIndex > currentIndex ? 1 : -1;

        // Parallax on incoming card's image
        const slides = swiper.slides;
        const activeSlide = slides[swiper.activeIndex];
        const activeImg = activeSlide?.querySelector("img");
        if (activeImg) {
            gsap.fromTo(activeImg,
                { x: direction * -3 },
                { x: 0, duration: 2, ease: "power2.out" }
            );
        }

        setCurrentIndex(nextIndex);
    }

    // --- Nav button handlers ---
    function handlePrevClick() {
        swiperRef.current?.slidePrev();
    }

    function handleNextClick() {
        swiperRef.current?.slideNext();
    }

    function handleDotClick(i: number) {
        swiperRef.current?.slideTo(i);
    }

    // --- Expand / Collapse ---
    function handleProjectClick() {
        const scroller = ScrollSmoother.get();
        const scrollY = scroller?.scrollTop() ?? window.scrollY;

        if (!projectOpen) {
            const rect = cardRef.current!.getBoundingClientRect();

            gsap.set(overlayRef.current, {
                display: "block",
                position: "absolute",
                top: rect.top + scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: 16,
                zIndex: 50,
                overflow: "hidden",
            });

            scroller?.paused(true);

            gsap.to(overlayRef.current, {
                top: scrollY,
                left: 0,
                width: "100vw",
                height: "100dvh",
                borderRadius: 0,
                ease: "power3.inOut",
                duration: 0.6,
                onComplete: () => {
                    gsap.to(".project-content", {
                        opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "power2.out",
                    });
                }
            });

            setProjectOpen(true);

        } else {
            const rect = cardRef.current!.getBoundingClientRect();
            const scrollY = scroller?.scrollTop() ?? window.scrollY;

            gsap.to(".project-content", {
                opacity: 0, y: 20, duration: 0.2, ease: "power2.in",
                onComplete: () => {
                    gsap.to(overlayRef.current, {
                        top: rect.top + scrollY,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        borderRadius: 16,
                        ease: "power3.inOut",
                        duration: 0.5,
                        onComplete: () => {
                            gsap.set(overlayRef.current, { display: "none" });
                            scroller?.paused(false);
                        }
                    });
                }
            });

            setProjectOpen(false);
        }
    }

    const project = projects[currentIndex];

    return (
        <div className="relative w-screen flex flex-col justify-start items-center bg-secondary">
            <StarBackground />

            {/* Project Overlay */}
            <div ref={overlayRef} style={{ display: "none" }}>
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="relative w-full max-w-[1080px] h-full mx-auto px-10 pb-10 flex flex-col justify-end">
                        <button
                            onClick={handleProjectClick}
                            className="project-content absolute top-[86px] right-10 rounded-full bg-white/10 p-2 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                        >
                            <X className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" />
                        </button>
                        <p className="project-content text-highlight text-sm uppercase tracking-widest mb-2">Featured Project</p>
                        <h2 className="project-content text-4xl md:text-6xl font-bold text-white mb-4">{project.title}</h2>
                        <p className="project-content text-white/70 max-w-xl mb-6">{project.description}</p>
                        <div className="project-content flex gap-3 flex-wrap mb-8">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white">{tag}</span>
                            ))}
                        </div>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="project-content w-fit px-6 py-3 bg-highlight rounded-full text-white font-medium">
                            View Project →
                        </a>
                    </div>
                </div>
            </div>

            {/* Intro Section */}
            <section id="intro" className="w-screen min-h-dvh flex flex-col justify-between items-center p-10 pt-[66px] gap-10 bg-primary scroll-mt-[var(--nav-height)]">
                <div />
                <div ref={textContainer} className="text-container relative max-w-[1080px] flex flex-col justify-center items-center text-center gap-2">
                    <div className="rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100">
                        <Rocket size={20} />
                    </div>
                    <div className="intro-text w-fit mx-auto md:mx-0 flex flex-row justify-center items-center gap-2 px-3 py-2 text-[0.75rem] md:text-[1rem] bg-highlight/20 backdrop-blur-xs text-highlight border border-highlight rounded-full">
                        <Wrench className="w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]" />
                        <span>Built For The Stars</span>
                    </div>
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">Explore</span>{" "}My Projects
                    </h2>
                    <span className="intro-text text-[1rem] md:text-[1.5rem] text-white/80">
                        From <span className="text-gradient">concept to launch</span>, these projects are fueled by{" "}
                        <span className="text-gradient">curiosity</span> and a drive to{" "}
                        <span className="text-gradient">create something that matters</span>
                    </span>
                </div>
                <div className="scroll-down flex flex-col justify-center items-center gap-2 text-[0.75rem] md:text-[1.25rem] text-center">
                    Scroll Down
                    <ChevronsDown className="w-[clamp(24px,2vw,30px)] h-[clamp(24px,2vw,30px)]" />
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="relative w-screen h-dvh flex flex-col justify-center items-center py-10 overflow-hidden">

                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    onSlideChange={handleSlideChange}
                    slidesPerView="auto"
                    centeredSlides={true}
                    spaceBetween={24}
                    grabCursor={true}
                    speed={600}
                    className="w-full"
                >
                    {projects.map((proj, i) => (
                        <SwiperSlide
                            key={proj.id}
                            style={{ width: "clamp(300px, 40vw, 500px)" }}
                            className="h-auto"
                        >
                            {({ isActive }) => (
                                <div
                                    ref={isActive ? cardRef : null}
                                    onClick={() => isActive ? handleProjectClick() : swiperRef.current?.slideTo(i)}
                                    className={`relative w-full h-[clamp(300px,60vh,700px)] flex flex-col justify-center items-center p-3 border rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden
                                        ${isActive
                                            ? "border-highlight/60 bg-gradient-to-br from-white/10 to-white/[0.03] scale-100 opacity-100"
                                            : "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] scale-95 opacity-50"
                                        }`}
                                >
                                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                                        <img
                                            ref={isActive ? imgRef : null}
                                            src={proj.image}
                                            alt={proj.title}
                                            className="absolute bottom-0 h-full w-[140%] object-cover will-change-transform"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-highlight rounded-full text-[clamp(0.75rem,1.5vw,1rem)] text-nowrap font-medium">
                                        {proj.title}
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Nav buttons */}
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-4 transition-opacity duration-300 z-10 ${projectOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <button
                        onClick={handlePrevClick}
                        disabled={currentIndex === 0}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-30 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronLeft className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>
                    <div className="flex items-center gap-2">
                        {projects.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                className={`h-2 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? "w-8 md:w-15 bg-white" : "w-2 md:w-3 bg-white/30"}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNextClick}
                        disabled={currentIndex === projects.length - 1}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-30 transition-all duration-200 cursor-pointer"
                    >
                        <ChevronRight className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,24px)]" />
                    </button>
                </div>

            </section>
        </div>
    );
}