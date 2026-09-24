"use client";

import { useEffect, useState } from "react";

// Preview clips are fetched whole into memory and served from blob URLs, so a
// card's video is fully buffered before it is ever shown: no stalls, and loops
// replay without going back to the network.

const ready = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

// Each clip ships as VP9 WebM (smaller) and H.264 MP4 (for browsers without
// VP9, e.g. older Safari); `base` is the path without the extension.
function fileFor(base: string) {
    const vp9 = document.createElement("video").canPlayType('video/webm; codecs="vp9"');
    return `${base}.${vp9 === "probably" ? "webm" : "mp4"}`;
}

export function preloadVideo(src: string): Promise<string> {
    const done = ready.get(src);
    if (done) return Promise.resolve(done);

    let p = pending.get(src);
    if (!p) {
        p = fetch(fileFor(src))
            .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`${res.status}`))))
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                ready.set(src, url);
                return url;
            })
            .finally(() => pending.delete(src));
        pending.set(src, p);
    }
    return p;
}

// Resolves to a playable URL once the whole clip is in memory, undefined until
// then (or forever, if the fetch fails, so the still image simply stays up).
export function usePreloadedVideo(src?: string) {
    const [url, setUrl] = useState(() => (src ? ready.get(src) : undefined));

    useEffect(() => {
        if (!src) return;
        let active = true;
        preloadVideo(src)
            .then((u) => { if (active) setUrl(u); })
            .catch(() => { /* keep showing the still */ });
        return () => { active = false; };
    }, [src]);

    return url;
}
