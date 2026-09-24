'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GALACTIC_POLE } from "./Sky";

// Rough stellar colour mix (blue-white through orange), with a rare pink so the
// field sits in the site's palette.
const STAR_COLORS: [number, [number, number, number]][] = [
    [0.10, [0.72, 0.82, 1.00]],
    [0.55, [1.00, 0.98, 0.95]],
    [0.80, [1.00, 0.91, 0.78]],
    [0.94, [1.00, 0.76, 0.56]],
    [1.00, [1.00, 0.78, 0.92]],
];

function pickColor(r: number) {
    return STAR_COLORS.find(([p]) => r <= p)![1];
}

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uAttenuate;
attribute float aSize;
attribute float aBright;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vColor;
varying float vBright;
varying float vSpikes;

void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    // Scintillation: a slow swell plus a faster flicker, on a per-star phase.
    float tw = 0.5 + 0.5 * sin(uTime * (0.6 + aPhase * 1.8) + aPhase * 40.0);
    float flick = 0.5 + 0.5 * sin(uTime * (3.1 + aPhase * 4.0) + aPhase * 90.0);
    vBright = aBright * (0.72 + 0.28 * tw) * (0.9 + 0.1 * flick);
    vColor = aColor;
    vSpikes = smoothstep(3.6, 5.5, aSize);

    float size = aSize * uPixelRatio;
    if (uAttenuate > 0.0) size *= clamp(uAttenuate / -mv.z, 0.35, 1.6);
    gl_PointSize = max(size * (vSpikes > 0.0 ? 3.0 : 1.4), 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vBright;
varying float vSpikes;

void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p) * 2.0;
    // Spiky stars get a larger sprite, so their core is scaled back down.
    float k = mix(1.4, 3.0, vSpikes);
    float core = exp(-r * r * 9.0 * k * k);
    float halo = exp(-r * 4.0 * k) * 0.35;
    float spikes = (exp(-abs(p.x) * 70.0) + exp(-abs(p.y) * 70.0)) * pow(1.0 - r, 3.0) * 0.55 * vSpikes;
    float a = (core + halo + spikes) * vBright;
    if (a < 0.004) discard;
    gl_FragColor = vec4(pow(vColor * a, vec3(1.0 / 2.2)), 1.0);
}
`;

type StarsProps = {
    count: number;
    // "shell": distant stars on a sphere (no parallax); "volume": near stars
    // scattered along the journey (parallax, size falls off with distance).
    kind: "shell" | "volume";
    reducedMotion: boolean;
};

export default function Stars({ count, kind, reducedMotion }: StarsProps) {
    const dpr = useThree((s) => s.viewport.dpr);

    const geometry = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const size = new Float32Array(count);
        const bright = new Float32Array(count);
        const phase = new Float32Array(count);
        const color = new Float32Array(count * 3);
        const v = new THREE.Vector3();

        for (let i = 0; i < count; i++) {
            if (kind === "shell") {
                // Denser towards the galactic band.
                do {
                    v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
                } while (v.lengthSq() > 1 || v.lengthSq() < 1e-4 ||
                    Math.random() > 0.3 + 0.7 * Math.exp(-Math.pow(v.clone().normalize().dot(GALACTIC_POLE) / 0.3, 2)));
                v.normalize().multiplyScalar(420);
            } else {
                // Scattered along the whole journey, so they stream past in flight.
                v.set(-170 + Math.random() * 420, -120 + Math.random() * 280, 60 - Math.random() * 1600);
            }
            pos.set([v.x, v.y, v.z], i * 3);

            const r = Math.random();
            size[i] = kind === "shell" ? 0.9 + Math.pow(r, 9) * 5.2 : 1.2 + Math.pow(r, 4) * 2.2;
            bright[i] = kind === "shell" ? 0.25 + Math.pow(Math.random(), 2.5) * 0.95 : 0.35 + Math.random() * 0.5;
            phase[i] = Math.random();
            color.set(pickColor(Math.random()), i * 3);
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
        g.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));
        g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
        g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
        return g;
    }, [count, kind]);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: 1 },
            uAttenuate: { value: kind === "volume" ? 90 : 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    }), [kind]);

    useEffect(() => { material.uniforms.uPixelRatio.value = dpr; }, [material, dpr]);
    useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

    useFrame((_, delta) => {
        material.uniforms.uTime.value += delta * (reducedMotion ? 0.15 : 1);
    });

    return <points geometry={geometry} material={material} renderOrder={-500} frustumCulled={false} />;
}
