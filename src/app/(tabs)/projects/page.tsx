"use client";

import StarBackground from "@/app/(tabs)/_components/StarBackground";
import { useNavigationMode } from "@/providers/NavigationModeProvider";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsDown, Rocket, Undo2, Wrench, X } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper";
import { useMobile } from "@/providers/MobileProvider";

// --- Project Data ---
const projects = [
    {
        id: 1,
        title: "Legacy Portfolio",
        image: "/legacy-portfolio.png",
        tags: ["React", "TypeScript", "TailwindCSS", "Next.js", "Web App"],
        description:
        "My first personal portfolio website, a static page built to showcase my projects and resume early in my development journey.",
        github: "https://github.com/OfficialChanHen/PersonalPage",
        link: "https://portfolio-five-blue.vercel.app/",
    },
    {
        id: 2,
        title: "Intraday Momentum Backtester",
        image: "/trading.png",
        tags: ["Python", "Data Analysis"],
        description:
        "A Python trading strategy script that runs a momentum-based backtest for any stock, and outputs an interactive HTML chart image with buy/sell signals.",
        github: "https://github.com/OfficialChanHen/StockTrader",
    },
    {
        id: 3,
        title: "TANKS!",
        image: "/Tank-Thumbnail.png",
        tags: ["Unity", "C#", "Game Development"],
        description:
        "TANKS! is a local multiplayer arena battle game built in Unity, including a first-to-three win format, powerups, multiple tank types, and a player select screen.",
        github: "https://github.com/OfficialChanHen/TANKS",
        link: "https://play.unity.com/api/v1/games/game/94d9e7c0-b608-42aa-be14-75f5d990b8d1/build/latest/frame",
    },
    {
        id: 4,
        title: "Sketchpad",
        image: "/sketch_example.png",
        tags: ["JavaScript", "CSS", "Web App"],
        description:
        "Draw freely on a canvas, pick any color, adjust brush size, and erase mistakes.",
        github: "https://github.com/OfficialChanHen/sketch-pad",
        link: "https://sketch-k8rcnsc1e-officialchanhens-projects.vercel.app/",
    },
    {
        id: 5,
        title: "TBD Project",
        image: "/coming-soon.jpg",
        tags: ["TBD"],
        description: "Upcoming project to be announced. Check back here for updates!",
    },
];

export default function Projects() {
    const textContainer = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [projectOpen, setProjectOpen] = useState(false);
    const isMobile = useMobile();

    const navigationMode = useNavigationMode();
    const delayTime = navigationMode === "soft" ? 0.4 : 0.6;

    const navButtonStyle = "flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-white hover:bg-white/20 disabled:opacity-30 transition-all duration-200 cursor-pointer";

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
        <div className="relative w-screen flex flex-col justify-start items-center bg-secondary">
            <StarBackground />

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
                                    className="rounded-full bg-highlight p-2 border border-white/20 text-white flex items-center justify-center backdrop-blur-xs hover:bg-tertiary transition-all cursor-pointer"
                                >
                                    <X className="w-[clamp(20px,2vw,24px)] h-[clamp(20px,2vw,24px)]" />
                                </button>
                            </div>
                            

                            {isMobile && (
                                <div className="project-content z-10 px-4 py-3 w-fit rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-center text-[1rem] md:text-[1.25rem] ">
                                    Scroll For More
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="project-content z-20 w-full flex flex-col justify-start items-start gap-3 p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl">

                                {/* Header */}
                                <p className="project-content text-highlight text-sm md:text-md uppercase tracking-widest">Featured Project</p>
                                <h2 className="project-content text-3xl md:text-6xl font-bold text-white">{project.title}</h2>

                                {/* Tags */}
                                <div className="project-content flex gap-3 flex-wrap">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs md:text-sm text-white">{tag}</span>
                                    ))}
                                </div>

                                <p className="project-content text-md md:text-lg text-white/80 max-w-xl mb-4">{project.description}</p>

                                {/* Buttons */}
                                <div className="project-content flex flex-wrap text-nowrap gap-3 text-sm md:text-md">
                                    {project.github && (
                                        <div className="project-content">
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-fit px-6 py-3 bg-highlight rounded-full text-white font-medium cursor-pointer tracking-widest border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:scale-105 transition-all ease-in-out duration-300"
                                            >
                                                Source Code
                                            </a>
                                        </div>
                                    )}
                                    {project.link && (
                                        <div className="project-content">
                                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                <button className="group inline-flex items-center justify-center gap-2 w-fit px-6 py-3 bg-highlight rounded-full text-white font-medium cursor-pointer tracking-widest border-none shadow-[0_0_25px] shadow-highlight hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:scale-105 transition-all ease-in-out duration-300">
                                                    <span>View Projects</span>
                                                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2 w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]" />
                                                </button>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {isMobile && (
                                    <div className="project-content text-nowrap text-sm md:text-md">
                                        <button
                                            onClick={handleProjectClick}
                                            className="inline-flex items-center justify-center gap-2 w-fit px-6 py-3 bg-primary/40 rounded-full text-white font-medium cursor-pointer tracking-widest border-none shadow-[0_0_25px] shadow-tertiary hover:shadow-[0_0_5px,_0_0_20px,_0_0_50px] hover:scale-105 transition-all ease-in-out duration-300"
                                        >
                                            <span>Return Back</span>
                                            <Undo2 className="w-[clamp(16px,2vw,24px)] h-[clamp(16px,2vw,24px)]" />
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
            <section id="projects" className="relative w-screen h-dvh flex flex-col justify-center items-center py-10 gap-5 overflow-hidden">
                <div className="fade-in-list relative text-center">
                    <h2 className="text-[2.5rem] md:text-[3.5rem]">
                        <span className="text-gradient">
                            Personal
                        </span>
                        {" Projects"}
                    </h2>
                    <span className="text-[1rem] md:text-[1.5rem] text-white/80">
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
                                    className={`relative w-full h-[clamp(300px,60vh,700px)] border-3 border-white rounded-2xl  cursor-pointer transition-all duration-500 overflow-hidden
                                        ${isActive
                                            ? "scale-100 opacity-100"
                                            : "scale-95 opacity-50"
                                        }`}
                                >
                                    <img
                                        ref={isActive ? imgRef : null}
                                        src={proj.image}
                                        alt={proj.title}
                                        data-swiper-parallax-x="-25%"
                                        data-swiper-parallax-scale="1.15"
                                        className="w-full h-full object-cover will-change-transform"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-xs rounded-full text-[clamp(0.75rem,1.5vw,1rem)] text-nowrap font-medium">
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
                                className={`h-2 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? "w-8 md:w-15 bg-white" : "w-2 md:w-3 bg-white/30"}`}
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