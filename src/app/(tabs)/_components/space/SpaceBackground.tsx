'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import "@/lib/threeConsole";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import { useMobile } from "@/providers/MobileProvider";
import Sky from "./Sky";
import Stars from "./Stars";
import Planet from "./Planet";
import Supernova, { supernova, startSupernova, interruptSupernova } from "./Supernova";
import { journey, STOP_SPACING } from "./scenes";

// Rendering budget. "low" is the starting point on phones and machines with
// few cores or little memory: lower resolution, fewer stars, cheaper planet
// shaders, a smaller nebula bake, and 30fps at rest. Either tier steps down
// further at runtime if frames still run slow (see FrameBudget).
type Tier = "high" | "low";
const TIERS = {
    high: { dpr: 1.75, stars: 7000, nearStars: 1000 },
    low: { dpr: 1.25, stars: 3000, nearStars: 450 },
};

function detectTier(isMobile: boolean): Tier {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    return isMobile || cores <= 4 || memory <= 4 ? "low" : "high";
}

// World position of every stop. Each is one hop further on, shifted so that it
// appears at its `offset` (a screen fraction) from the stop before it.
function useStops() {
    const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
    const aspect = useThree((s) => s.viewport.aspect);
    return useMemo(() => {
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * STOP_SPACING;
        const halfW = halfH * aspect;
        const at = new THREE.Vector3();
        return journey.map((stop) => {
            at.x += stop.offset[0] * halfW;
            at.y += stop.offset[1] * halfH;
            const pos = at.clone();
            at.z -= STOP_SPACING;
            return pos;
        });
    }, [camera.fov, aspect]);
}

// Set while the camera is travelling, so a frame-capped scene renders every
// frame of a flight instead of 30 a second.
const flight = { active: false };
const flying = { onStart: () => { flight.active = true; }, onComplete: () => { flight.active = false; } };

function stopIndex(pathname: string) {
    return journey.findIndex((s) => pathname.startsWith(s.route));
}

// How much of the camera's travel the sky and far stars give up (0 would pin
// them at infinity, 1 would leave them behind entirely).
const SKY_DRIFT = 0.04;

// Flies the camera between stops. Otherwise the scene holds still: the only
// other motion is a small rise as the page scrolls. Planets and near stars shift
// by their depth as the camera moves; the sky and far stars drift only slightly.
function CameraRig({ stops, reducedMotion, children }: { stops: THREE.Vector3[]; reducedMotion: boolean; children: React.ReactNode }) {
    const camera = useThree((s) => s.camera);
    const pathname = usePathname();
    const farRef = useRef<THREE.Group>(null);
    const base = useRef<THREE.Vector3 | null>(null);
    const current = useRef(-1);

    useEffect(() => {
        const index = stopIndex(pathname);
        if (index < 0) return;
        const target = stops[index];

        if (!base.current) {
            // First appearance: glide in from a little way back and settle.
            base.current = target.clone().add(new THREE.Vector3(0, -6, 150));
            gsap.to(base.current, { x: target.x, y: target.y, z: target.z, duration: reducedMotion ? 0 : 3.4, ease: "power3.out", ...flying });
        } else if (index !== current.current) {
            const hops = Math.abs(index - Math.max(current.current, 0));
            gsap.to(base.current, {
                x: target.x, y: target.y, z: target.z,
                duration: reducedMotion ? 0 : 1.5 + 0.55 * hops,
                ease: "power2.inOut",
                overwrite: true,
                ...flying,
            });
        } else {
            // Same stop, new layout (resize): snap to where it now sits.
            gsap.killTweensOf(base.current);
            base.current.copy(target);
        }
        current.current = index;
    }, [pathname, stops, reducedMotion]);

    useFrame((_, delta) => {
        if (!base.current) return;
        const screens = window.scrollY / Math.max(window.innerHeight, 1);
        const ty = base.current.y - Math.min(screens, 6) * (reducedMotion ? 0.3 : 1.1);
        camera.position.x = base.current.x;
        camera.position.y += (ty - camera.position.y) * (1 - Math.exp(-delta * 4));
        camera.position.z = base.current.z;

        // The sky keeps up with the camera but lags a little, so the nebula and far
        // stars drift gently as you travel. They never rotate.
        farRef.current?.position.copy(camera.position).multiplyScalar(1 - SKY_DRIFT);
    });

    return <group ref={farRef}>{children}</group>;
}

// Watches real frame times after start-up. If they run slow, it lowers the
// pixel ratio, and past that caps the scene at 30fps, so a weak GPU spends its
// time on the page rather than the background.
function FrameBudget({ onSlow }: { onSlow: () => void }) {
    const frames = useRef(0);
    const total = useRef(0);
    const count = useRef(0);

    useFrame((_, delta) => {
        frames.current++;
        if (frames.current < 90 || delta > 0.25) return; // skip start-up and tab switches
        total.current += delta;
        count.current++;
        if (count.current === 90) {
            if (total.current / count.current > 1 / 45) onSlow();
            total.current = 0;
            count.current = 0;
            frames.current = 0;
        }
    });
    return null;
}

// Drives a "demand" frameloop: 30fps while the scene is at rest (twinkle and
// slow spin don't need more), every display frame while the camera travels.
function FrameCap() {
    const invalidate = useThree((s) => s.invalidate);
    useEffect(() => {
        let id = 0, last = 0;
        const tick = (now: number) => {
            if (flight.active || now - last >= 1000 / 30 - 2) {
                last = now;
                invalidate();
            }
            id = requestAnimationFrame(tick);
        };
        id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, [invalidate]);
    return null;
}

function Journey({ tier, reducedMotion }: { tier: Tier; reducedMotion: boolean }) {
    const stops = useStops();
    const low = tier === "low";

    return (
        <>
            <CameraRig stops={stops} reducedMotion={reducedMotion}>
                <Sky lowQuality={tier === "low"} />
                <Stars kind="shell" count={TIERS[tier].stars} reducedMotion={reducedMotion} />
                <Supernova reducedMotion={reducedMotion} />
            </CameraRig>
            <Stars kind="volume" count={TIERS[tier].nearStars} reducedMotion={reducedMotion} />
            {journey.map((stop, i) => stop.planets.map((spec) => (
                <Planet key={spec.id} spec={spec} origin={stops[i]} lowQuality={low} reducedMotion={reducedMotion} />
            )))}
        </>
    );
}

const IDLE_MS = 60_000;

// Starts the supernova after a minute with no input on Home. It plays once per
// page load (a refresh brings the star back and restarts the wait), never while
// the tab is hidden, and never for visitors who prefer reduced motion. Any
// input during the show fast-forwards it to the quiet remnant.
function useIdleSupernova(pathname: string, reducedMotion: boolean) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            // Dev-only handles for testing the easter egg without waiting a minute.
            const w = window as Window & { __betelgeuse?: () => void; __supernova?: typeof supernova };
            w.__betelgeuse = startSupernova;
            w.__supernova = supernova;
        }
        if (!pathname.startsWith("/home") || reducedMotion) return;

        let timer = 0;
        const arm = () => {
            window.clearTimeout(timer);
            if (supernova.t >= 0 || document.hidden) return;
            timer = window.setTimeout(startSupernova, IDLE_MS);
        };
        const onInput = () => { interruptSupernova(); arm(); };
        const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
        events.forEach((e) => window.addEventListener(e, onInput, { passive: true }));
        document.addEventListener("visibilitychange", arm);
        arm();
        return () => {
            window.clearTimeout(timer);
            events.forEach((e) => window.removeEventListener(e, onInput));
            document.removeEventListener("visibilitychange", arm);
        };
    }, [pathname, reducedMotion]);
}

export default function SpaceBackground() {
    const isMobile = useMobile();
    const pathname = usePathname();
    const [tier, setTier] = useState<Tier | null>(null);
    const [dpr, setDpr] = useState(1);
    const [capped, setCapped] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const t = detectTier(isMobile);
        setTier(t);
        setDpr(Math.min(window.devicePixelRatio || 1, TIERS[t].dpr));
        // Weaker devices idle at 30fps from the start.
        setCapped(t === "low");

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [isMobile]);

    useIdleSupernova(pathname, reducedMotion);

    function handleSlow() {
        if (dpr > 1.01) setDpr((d) => Math.max(1, d - 0.35));
        else setCapped(true);
    }

    return (
        // The CSS gradient shows until the scene draws, and if WebGL is unavailable.
        <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,#1a0529_0%,#0c0216_55%,#07010c_100%)]">
            {tier && (
                <Canvas
                    dpr={dpr}
                    frameloop={capped ? "demand" : "always"}
                    camera={{ position: [0, 0, 0], fov: 50, near: 0.5, far: 3000 }}
                    gl={{ antialias: true, alpha: false, powerPreference: tier === "high" ? "high-performance" : "default" }}
                >
                    <Journey tier={tier} reducedMotion={reducedMotion} />
                    {!capped && <FrameBudget onSlow={handleSlow} />}
                    {capped && <FrameCap />}
                </Canvas>
            )}
        </div>
    );
}
