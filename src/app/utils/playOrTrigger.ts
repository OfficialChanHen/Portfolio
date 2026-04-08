"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function playOrTrigger(el: HTMLElement, tl: gsap.core.Timeline) {
    if (ScrollTrigger.isInViewport(el, 0.15)) {
        tl.play();
    } else {
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => tl.play(),
        });
    }
};