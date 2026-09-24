"use client";

import { useEffect } from "react";
import { projects } from "@/lib/projects";
import { preloadVideo } from "@/lib/videoPreload";

// Starts fetching the Projects page preview clips as soon as the site has
// finished its own initial load, so they're ready before that page is opened.
export default function PreloadProjectVideos() {
    useEffect(() => {
        const start = () => {
            projects.forEach((p) => { if (p.video) preloadVideo(p.video).catch(() => {}); });
        };

        if (document.readyState === "complete") {
            start();
            return;
        }
        window.addEventListener("load", start, { once: true });
        return () => window.removeEventListener("load", start);
    }, []);

    return null;
}
