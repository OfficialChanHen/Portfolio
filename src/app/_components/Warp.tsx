'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import "@/lib/threeConsole";
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/providers/MobileProvider';

// The jump to lightspeed between "Tap to enter" and the site. Streaks run down a
// tunnel (nothing near the centre, so the vanishing point stays dark), fade from
// a transparent tail to a softly tinted head, and are capped in length, so the
// peak reads as speed rather than a white-out. It eases off and fades to the
// void, and Home picks up from there with the camera still gliding in.

const RAMP = 1.5;    // seconds to reach full speed
const HOLD = 0.9;    // seconds at full speed
const EASE_OUT = 1.1; // seconds slowing down while fading to the void
const MAX_SPEED = 900;
const DEPTH = 700;

function speedAt(t: number) {
    if (t < RAMP) return 25 + (MAX_SPEED - 25) * Math.pow(t / RAMP, 3);
    if (t < RAMP + HOLD) return MAX_SPEED;
    const k = Math.min(1, (t - RAMP - HOLD) / EASE_OUT);
    return MAX_SPEED - (MAX_SPEED - 140) * (1 - Math.pow(1 - k, 3));
}

function Streaks({ count }: { count: number }) {
    const t = useRef(0);

    const { geometry, heads } = useMemo(() => {
        const positions = new Float32Array(count * 6);
        const colors = new Float32Array(count * 6);
        const heads = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.pow(Math.random(), 0.7) * 150;
            heads.set([Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, 200 - Math.random() * DEPTH], i * 3);
            // Tail stays black (invisible under additive blending); head carries the colour.
            const tint = Math.random();
            const c = tint < 0.7 ? [0.85, 0.82, 1] : tint < 0.9 ? [0.95, 0.72, 0.9] : [0.7, 0.8, 1];
            const b = 0.45 + Math.random() * 0.4;
            colors.set([c[0] * b, c[1] * b, c[2] * b], i * 6 + 3);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return { geometry: g, heads };
    }, [count]);

    useEffect(() => () => geometry.dispose(), [geometry]);

    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.05);
        t.current += dt;
        const speed = speedAt(t.current);
        const length = Math.min(70, speed * 0.05);
        const pos = geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            let z = heads[i * 3 + 2] + speed * dt;
            if (z > 200) z -= DEPTH;
            heads[i * 3 + 2] = z;
            const x = heads[i * 3], y = heads[i * 3 + 1];
            pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = z - length;
            pos[i * 6 + 3] = x; pos[i * 6 + 4] = y; pos[i * 6 + 5] = z;
        }
        geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
    );
}

export default function Warp() {
    const isMobile = useMobile();
    const router = useRouter();
    const wrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        router.prefetch('/home');
        const total = RAMP + HOLD + EASE_OUT;
        const tl = gsap.timeline();
        tl.fromTo(wrapper.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' })
          .to(wrapper.current, { opacity: 0, duration: 0.8, ease: 'power2.in' }, total - 0.8)
          .add(() => router.push('/home'));
        return () => { tl.kill(); };
    }, [router]);

    return (
        <div ref={wrapper} className="w-full h-full opacity-0">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ fov: 60, near: 1, far: 1000, position: [0, 0, 200] }}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => gl.setClearColor('#09010F')}
            >
                <Streaks count={isMobile ? 450 : 900} />
            </Canvas>
        </div>
    );
}
