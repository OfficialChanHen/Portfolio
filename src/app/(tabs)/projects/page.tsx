"use client";

import { useNavigationMode } from "@/providers/NavigationModeProvider";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsDown, Rocket, Undo2, Wrench, X } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper";
import { useMobile } from "@/providers/MobileProvider";
import ProjectMedia from "@/app/(tabs)/_components/ProjectMedia";
import { projects } from "@/lib/projects";

export default function Projects() {
    const textContainer = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [projectOpen, setProjectOpen] = useState(false);
    const isMobile = useMobile();

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;

    const navButtonStyle = "btn-ghost w-11 h-11 p-0! rounded-full! disabled:opacity-30 disabled:pointer-events-none";

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

        const scroller = ScrollSmoother.get();
        return () => scroller?.paused(false);
    }, { dependencies: [] });

    // --- Swiper slide change: GSAP parallax on incoming card media ---
    function handleSlideChange(swiper: SwiperType) {
        const nextIndex = swiper.realIndex;
        const direction = nextIndex > currentIndex ? 1 : -1;

        // Parallax on incoming card's media
        const slides = swiper.slides;
        const activeSlide = slides[swiper.activeIndex];
        const activeMedia = activeSlide?.querySelector(".project-media");
        if (activeMedia) {
            gsap.fromTo(activeMedia,
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

            const tlOverlayEnter = gsap.timeline();
            tlOverlayEnter.to(overlayRef.current, {
                top: scrollY,
                left: 0,
                width: "100vw",
                height: "100dvh",
                borderRadius: 0,
                ease: "power3.inOut",
                duration: 0.6,
            })
            .to(".project-content", {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "power2.out",
            });

            setProjectOpen(true);

        } else {
            const rect = cardRef.current!.getBoundingClientRect();
            const scrollY = scroller?.scrollTop() ?? window.scrollY;

            const tlOverlayExit = gsap.timeline();
            tlOverlayExit.to(".project-content", {
                opacity: 0, y: 20, duration: 0.2, ease: "power2.in",
                onComplete: () => {
                    gsap.set(".scroll-more", { opacity: 1, y: 0 });
                }
            })
            .to(overlayRef.current, {
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

            setProjectOpen(false);
        }
    }

    const project = projects[currentIndex];

    return (
        <div className="relative w-screen flex flex-col justify-start items-center">

            {/* Project Overlay */}
            <div ref={overlayRef} style={{ display: "none" }} className="fixed inset-0">
                {/* Fixed background layers */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Scrollable layer */}
                <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto no-scrollbar">
                    <div className="flex flex-col items-center pb-10 px-10 min-h-full">

                        {/* Overlay Container */}
                        <div className="relative w-full max-w-[1080px] pt-[50dvh] flex-1 flex flex-col justify-end items-center gap-3">

                            {/* Close Button */}
                            <div className="project-content absolute top-[86px] self-end z-50">
                                <button
                                    onClick={handleProjectClick}
                                    aria-label="Close project"
                                    className="btn-ghost p-2.5! rounded-full!"
                                >
                                    <X className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" />
                                </button>
                            </div>
                            

                            {isMobile && (
                                <div className="project-content eyebrow z-10">
                                    Scroll For More
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="project-content glass z-20 w-full flex flex-col justify-start items-start gap-3 p-8 md:p-10 rounded-3xl">

                                {/* Header */}
                                <p className="project-content text-highlight text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.22em]">Featured Project</p>
                                <h2 className="project-content text-3xl md:text-6xl font-bold tracking-tight text-white">{project.title}</h2>

                                {/* Tags */}
                                <div className="project-content flex gap-3 flex-wrap">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/[0.06] border border-white/12 rounded-full text-xs md:text-sm text-white/80">{tag}</span>
                                    ))}
                                </div>

                                <p className="project-content text-md md:text-lg leading-relaxed text-white/70 max-w-2xl mb-4">{project.description}</p>

                                {/* Buttons */}
                                <div className="project-content flex flex-wrap text-nowrap gap-3 text-sm md:text-md">
                                    {project.github && (
                                        <div className="project-content">
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-ghost"
                                            >
                                                Source Code
                                            </a>
                                        </div>
                                    )}
                                    {project.link && (
                                        <div className="project-content">
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="group btn-primary">
                                                <span>View Project</span>
                                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5 w-4 h-4 md:w-5 md:h-5" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {isMobile && (
                                    <div className="project-content text-nowrap text-sm md:text-md">
                                        <button
                                            onClick={handleProjectClick}
                                            className="btn-ghost"
                                        >
                                            <span>Return Back</span>
                                            <Undo2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {
                                
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Intro Section */}
            <section id="intro" className="w-screen min-h-dvh flex flex-col justify-between items-center p-10 pt-[66px] gap-10 scroll-mt-[var(--nav-height)]">
                <div />
                <div ref={textContainer} className="text-container relative max-w-[1080px] flex flex-col justify-center items-center text-center gap-2">
                    <div className="rocket absolute top-0 left-[48%] z-20 rotate-135 opacity-100">
                        <Rocket size={20} />
                    </div>
                    <div className="intro-text eyebrow mx-auto mb-2">
                        <Wrench className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>Built For The Stars</span>
                    </div>
                    <h2 className="intro-text text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">Explore</span>{" "}My Projects
                    </h2>
                    <span className="intro-text max-w-[46ch] text-[1rem] md:text-[1.35rem] text-white/70">
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
            <section id="projects" className="relative w-screen h-dvh flex flex-col justify-center items-center py-10 gap-5 overflow-hidden">
                <div className="fade-in-list relative text-center">
                    <h2 className="text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">
                            Personal
                        </span>
                        {" Projects"}
                    </h2>
                    <span className="text-[1rem] md:text-[1.35rem] text-white/60">
                        Tap the card to learn more
                    </span>
                </div>

                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    onSlideChange={handleSlideChange}
                    slidesPerView="auto"
                    centeredSlides={true}
                    spaceBetween={24}
                    grabCursor={true}
                    speed={800}
                    parallax={true}
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
                                    className={`relative w-full h-[clamp(300px,60vh,700px)] rounded-3xl ring-1 cursor-pointer transition-all duration-500 overflow-hidden
                                        ${isActive
                                            ? "scale-100 opacity-100 ring-white/25 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95),0_0_60px_-20px_color-mix(in_oklab,var(--highlight)_45%,transparent)]"
                                            : "scale-95 opacity-45 ring-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]"
                                        }`}
                                >
                                    <ProjectMedia project={proj} active={isActive} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/30 border border-white/15 backdrop-blur-md rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-[clamp(0.75rem,1.5vw,0.95rem)] text-nowrap font-medium tracking-wide">
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
                        className={navButtonStyle}
                    >
                        <ChevronLeft className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,20px)]" />
                    </button>
                    <div className="flex items-center gap-2">
                        {projects.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-500 cursor-pointer ${i === currentIndex ? "w-8 md:w-12 bg-gradient-to-r from-highlight to-[#f3d6ea] shadow-[0_0_12px] shadow-highlight/70" : "w-1.5 md:w-2 bg-white/30 hover:bg-white/60"}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNextClick}
                        disabled={currentIndex === projects.length - 1}
                        className={navButtonStyle}
                    >
                        <ChevronRight className="w-[clamp(16px,2vw,20px)] h-[clamp(16px,2vw,24px)]" />
                    </button>
                </div>

            </section>
        </div>
    );
}