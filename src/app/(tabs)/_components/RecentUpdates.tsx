"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import playOrTrigger from "@/app/utils/playOrTrigger";

type Commit = {
    sha: string;
    message: string;
    date: string;
    url: string;
};

function formatDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function RecentUpdates({ reveal }: { reveal: boolean }) {
    const [commits, setCommits] = useState<Commit[] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch as soon as the component mounts (during the intro), so data is ready
    // by the time `reveal` flips and we never flash a loading/empty state. On
    // failure `commits` stays null, so the section simply never reveals.
    useEffect(() => {
        let active = true;
        fetch("/api/github/commits")
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error("fetch failed"))))
            .then((data) => { if (active) setCommits(data.commits ?? []); })
            .catch(() => { /* leave commits null -> section stays hidden */ });
        return () => { active = false; };
    }, []);

    const show = reveal && !!commits?.length;

    // Grow + fade the card in so surrounding content is pushed gradually rather
    // than jumping. Only runs once both the data and the reveal flag are ready.
    useGSAP(() => {
        if (!show || !containerRef.current) return;
        const el = containerRef.current;

        const updatesTl = gsap.timeline({ paused: true });
        updatesTl.from(el, {
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            duration: 0.6,
            ease: "power2.out",
            onStart: () => { el.style.overflow = "hidden"; },
            onComplete: () => { el.style.overflow = ""; },
            clearProps: "height,overflow,paddingTop,paddingBottom,marginTop",
        });
        updatesTl.from(".update-item", {
            opacity: 0,
            y: 10,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
        }, 0.25);

        playOrTrigger(el, updatesTl);
    }, { scope: containerRef, dependencies: [show] });

    // Render nothing until we have data AND the reveal flag — and never if it
    // failed to load — so no empty space is reserved in those cases.
    if (!show) return null;

    return (
        <div
            ref={containerRef}
            className="flex flex-col w-full max-w-[1080px] gap-3 px-5 py-3 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xs rounded-md"
        >
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-highlight text-[1rem] md:text-[1.25rem]">Recent Updates</span>
                <span className="text-white/50 text-[0.625rem] md:text-[0.75rem]">via GitHub</span>
            </div>

            <ul className="flex flex-col gap-2">
                {commits!.map((c) => (
                    <li key={c.sha} className="update-item">
                        <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-0.5 md:gap-4"
                        >
                            <span className="text-[0.75rem] md:text-[1rem] text-white/90 group-hover:text-highlight transition-colors">
                                {c.message}
                            </span>
                            <time
                                dateTime={c.date}
                                className="shrink-0 text-[0.625rem] md:text-[0.75rem] text-white/50 whitespace-nowrap"
                            >
                                {formatDate(c.date)}
                            </time>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
