'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL } from "./glsl";
import { flashLight } from "./Planet";

// Easter egg: Betelgeuse, the red supergiant in Orion that astronomers expect
// to go supernova, finally does, as a time-lapse of what a core-collapse (Type
// II) supernova really looks like from far away:
//   shock breakout  a brief blue-white flash as the shock reaches the surface
//   rise and peak   it climbs to maximum over what would be weeks
//   plateau         it holds near peak for months, cooling from blue-white to orange
//   decline         it falls off the plateau and fades on a radioactive tail
//   light echoes    faint rings spread as the flash lights up surrounding dust
//   remnant         over centuries the ejecta show as a knotty shell (like
//                   Cassiopeia A: green oxygen, red-purple sulfur, blue hydrogen)
//                   around a faint blue glow and a pulsar, as in the Crab Nebula
// The explosion itself stays a point of light at this distance; only the
// nebula grows. It stays until the page is reloaded. (The Sun can't do this;
// it's far too small. Betelgeuse can, and would shine about like a half Moon.)

export const supernova = {
    t: -1,              // seconds since it began; -1 until then
    interrupted: false, // the visitor moved: fast-forward to the remnant
};

const BREAKOUT = 1.2;   // shock reaches the surface
const PEAK = 2.6;       // maximum light
const PLATEAU = 6.0;    // end of the plateau
const DONE = 13;        // by now only the remnant is left

// Brightness over time, relative to the star before it went (the light curve).
function lightCurve(t: number) {
    if (t < BREAKOUT) return 1;
    const breakout = 5 * Math.exp(-Math.pow((t - BREAKOUT) / 0.12, 2));
    if (t < PEAK) return 1.5 + 6.5 * Math.pow((t - BREAKOUT) / (PEAK - BREAKOUT), 1.5) + breakout;
    if (t < PLATEAU) return 8 - 1.2 * (t - PEAK) / (PLATEAU - PEAK);
    if (t < PLATEAU + 1) return 6.8 - 4.3 * (t - PLATEAU);
    return 2.5 * Math.exp(-(t - PLATEAU - 1) / 2.2) + 0.1;
}

export function startSupernova() {
    if (supernova.t < 0) { supernova.t = 0; supernova.interrupted = false; }
}

export function interruptSupernova() {
    if (supernova.t >= 0 && supernova.t < DONE) supernova.interrupted = true;
}

const vertexShader = /* glsl */ `
uniform float uSize;
varying vec2 vUv;
void main() {
    vUv = uv;
    vec4 c = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    c.xy += position.xy * uSize; // always faces the camera
    gl_Position = projectionMatrix * c;
}
`;

const fragmentShader = /* glsl */ `
uniform float uT, uTime, uSize, uLum;
varying vec2 vUv;
${noiseGLSL}

#define BREAKOUT ${BREAKOUT.toFixed(1)}
#define PEAK ${PEAK.toFixed(1)}
#define PLATEAU ${PLATEAU.toFixed(1)}
#define DONE ${DONE.toFixed(1)}
#define RMAX 13.0

void main() {
    vec2 q = (vUv - 0.5) * 2.0 * uSize; // world units from the star
    float r = length(q);
    vec2 dir = q / max(r, 0.001);
    float t = uT;
    float L = uLum;                     // light curve, from the CPU
    vec3 col = vec3(0.0);

    // The point of light. Colour follows temperature: red supergiant, a blue
    // breakout flash, white at peak, cooling through yellow to orange.
    vec3 c = vec3(1.0, 0.45, 0.22);
    if (t >= BREAKOUT) {
        float s = t - BREAKOUT;
        c = mix(vec3(0.7, 0.8, 1.0), vec3(0.88, 0.92, 1.0), smoothstep(0.0, PEAK - BREAKOUT, s));
        c = mix(c, vec3(1.0, 0.88, 0.7), smoothstep(PEAK, PLATEAU, t));
        c = mix(c, vec3(1.0, 0.55, 0.35), smoothstep(PLATEAU, PLATEAU + 2.5, t));
    }
    float twinkle = t < BREAKOUT ? 0.9 + 0.1 * sin(uTime * 2.3) : 1.0;
    float core = exp(-pow(r / (0.5 + 0.1 * L), 2.0) * 1.5) * L * twinkle;
    float halo = exp(-r / (0.8 + 0.35 * L)) * 0.06 * L;
    float over = max(L - 1.5, 0.0);     // optics only flare once it's truly bright
    float streak = exp(-abs(q.y) * 3.0) * exp(-abs(q.x) / (2.0 + 3.0 * over)) * 0.12 * over;
    float spike = exp(-abs(q.x) * 3.0) * exp(-abs(q.y) / (1.5 + 1.4 * over)) * 0.08 * over;
    col += c * (core + halo) + vec3(0.8, 0.9, 1.0) * (streak + spike);

    if (t >= BREAKOUT) {
        float s = t - BREAKOUT;

        // Light echoes: the flash reaching sheets of dust at different distances,
        // patchy because the dust is.
        float dust = smoothstep(0.45, 0.8, fbm(vec3(dir * 2.2 + r * 0.04, 5.1), 3) * 0.5 + 0.5);
        float e1 = exp(-pow((r - s * 4.5) / 1.4, 2.0));
        float e2 = exp(-pow((r - s * 2.8) / 1.2, 2.0)) * 0.7;
        col += vec3(0.7, 0.8, 1.0) * (e1 + e2) * dust * 0.18 * exp(-s / 2.0);

        // The remnant: ejecta shell, brightest at its rim, broken into knots, with
        // plumes reaching back inside. Always there, only seen once the glare fades.
        float grow = smoothstep(PEAK, DONE, t);
        float R = RMAX * (1.0 - pow(1.0 - grow, 2.0)) + 0.5;
        // A lopsided, broken ring: the radius wanders with direction, whole arcs
        // go missing, and the light gathers in bright knots, as in Cassiopeia A.
        float Rd = R * (1.0 + 0.16 * fbm(vec3(dir * 1.5, 8.3), 3));
        float w = 0.6 + 0.12 * R;
        float x = (r - Rd) / w;
        float rim = exp(-x * x);
        float knots = fbm(vec3(q * 0.35, 1.3), 4) * 0.5 + 0.5;
        float gaps = smoothstep(0.4, 0.62, fbm(vec3(dir * 1.8, 2.7), 3) * 0.5 + 0.5);
        float plumes = smoothstep(0.55, 0.9, fbm(vec3(dir * 7.0, 7.0), 3) * 0.5 + 0.5)
                     * smoothstep(Rd * 0.5, Rd * 0.95, r) * (1.0 - smoothstep(Rd * 0.95, Rd * 1.05, r));
        float gas = rim * (0.15 + 2.2 * pow(knots, 3.0)) * mix(0.12, 1.0, gaps) + plumes * 0.25;

        float chem = fbm(vec3(dir * 1.7, 4.2 + r * 0.05), 3) * 0.5 + 0.5;
        vec3 oxygen = vec3(0.35, 0.95, 0.62), sulfur = vec3(0.95, 0.32, 0.58), hydrogen = vec3(0.42, 0.58, 1.0);
        vec3 chemCol = mix(oxygen, sulfur, smoothstep(0.38, 0.58, chem));
        chemCol = mix(chemCol, hydrogen, smoothstep(0.6, 0.82, chem) * 0.8);
        chemCol = mix(chemCol, vec3(1.0, 0.4, 0.35), smoothstep(0.6, 1.2, x) * 0.6);
        col += chemCol * gas * 0.6 * smoothstep(PLATEAU - 1.0, DONE - 2.0, t);

        // What's left inside: a faint blue glow and a pulsar.
        float settled = smoothstep(PLATEAU + 1.0, DONE - 2.0, t);
        col += vec3(0.45, 0.6, 1.0) * exp(-pow(r / (0.45 * R + 0.01), 2.0)) * 0.05 * settled;
        col += vec3(0.75, 0.85, 1.0) * exp(-pow(r / 0.3, 2.0)) * (0.7 + 0.35 * sin(uTime * 5.0)) * settled;
    }

    // Everything falls to nothing well inside the sprite, so its square edge never shows.
    col *= 1.0 - smoothstep(0.35 * uSize, 0.95 * uSize, r);
    if (max(max(col.r, col.g), col.b) < 0.002) discard;
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}
`;

export default function Supernova({ reducedMotion }: { reducedMotion: boolean }) {
    const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
    const aspect = useThree((s) => s.viewport.aspect);
    const ref = useRef<THREE.Mesh>(null);

    // Where it hangs: upper middle of the Home view on any screen shape.
    const direction = useMemo(() => {
        const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        return new THREE.Vector3(0.04 * tan * aspect, 0.7 * tan, -1).normalize();
    }, [camera.fov, aspect]);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uT: { value: -1 }, uTime: { value: 0 }, uSize: { value: 44 }, uLum: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    }), []);

    useEffect(() => () => material.dispose(), [material]);

    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.1);
        const u = material.uniforms;
        u.uTime.value += dt;

        // Any input during the show fast-forwards it to the quiet remnant.
        if (supernova.t >= 0 && supernova.t < DONE) {
            supernova.t += reducedMotion ? DONE : dt * (supernova.interrupted ? 8 : 1);
        }
        u.uT.value = supernova.t;
        const lum = supernova.t < 0 ? 1 : lightCurve(supernova.t);
        u.uLum.value = lum;

        // Betelgeuse at its peak would cast shadows at night, so the planets'
        // faces lift a little toward it while it's bright.
        flashLight.uFlashColor.value.set(0.8, 0.9, 1.0).multiplyScalar(Math.max(0, lum - 1) * 0.045);
        flashLight.uFlashDir.value.copy(direction);

        ref.current?.position.copy(direction).multiplyScalar(380);
    });

    return (
        <mesh ref={ref} material={material} renderOrder={-400} frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
        </mesh>
    );
}
