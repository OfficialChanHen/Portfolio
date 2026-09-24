"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { usePreloadedVideo } from "@/lib/videoPreload";

// A project card's picture: the still image, with the preview clip faded in
// over it and looping for as long as the card is the focused (centered) slide
// and on screen. Losing focus fades back to the still.
export default function ProjectMedia({ project, active }: { project: Project; active: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl = usePreloadedVideo(project.video);
    const [inView, setInView] = useState(false);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !project.video) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [project.video]);

    const shouldPlay = active && inView;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (shouldPlay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            video.currentTime = 0;
            video.play().catch(() => { /* autoplay blocked: the still stays up */ });
        } else {
            video.pause();
        }
    }, [shouldPlay, videoUrl]);

    return (
        <div
            ref={containerRef}
            data-swiper-parallax-x="-25%"
            data-swiper-parallax-scale="1.15"
            className="project-media relative w-full h-full will-change-transform"
        >
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
            />
            {videoUrl && (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onPlaying={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${shouldPlay && playing ? "opacity-100" : "opacity-0"}`}
                />
            )}
        </div>
    );
}
