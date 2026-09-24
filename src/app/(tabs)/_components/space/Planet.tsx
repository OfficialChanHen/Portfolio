'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL, ringGLSL, srgb } from "./glsl";

export type PlanetType = "terran" | "gas" | "ice" | "rocky";

export type PlanetSpec = {
    id: string;
    type: PlanetType;
    screen: [number, number]; // centre, as a fraction of the viewport (-1..1 each way)
    depth: number;            // distance from the camera
    size: number;             // apparent radius, as a fraction of the viewport half-height
    colors: [string, string, string, string];
    atmosphere?: { color: string; strength: number };
    clouds?: number;          // 0..1 cloud cover (terran/ice)
    cityLights?: boolean;
    ring?: { inner: number; outer: number; colors: [string, string]; opacity: number };
    storm?: { color: string; amount: number; lon: number; lat: number; size?: number }; // gas giants
    polarCaps?: number;       // 0..1 ice caps (rocky)
    sun?: number;             // sunlight strength here; falls off as you head outward
    tilt: number;             // axial tilt, radians
    tip?: number;             // tip toward the camera, radians (opens up the ring)
    spin: number;             // radians per second
    seed: number;
};

// One sun for the whole system. You travel outward from it, so it sits behind
// the camera (up and to the left), and planets face you mostly lit.
export const SUN_DIRECTION = new THREE.Vector3(-0.45, 0.3, 0.85).normalize();

// Light from the supernova easter egg, shared by every planet: a direction
// toward the star and a colour scaled by how bright the blast is right now.
export const flashLight = {
    uFlashDir: { value: new THREE.Vector3(0, 0, -1) },
    uFlashColor: { value: new THREE.Vector3(0, 0, 0) },
};

const TYPE_INDEX: Record<PlanetType, number> = { terran: 0, gas: 1, ice: 2, rocky: 3 };

const surfaceVertex = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
    vObj = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const surfaceFragment = /* glsl */ `
uniform int uType;
uniform vec3 uC0, uC1, uC2, uC3;
uniform vec3 uAtmo;
uniform float uAtmoStrength, uClouds, uCity, uSeed, uTime, uFade, uSun, uPolar, uStormAmt, uStormSize;
uniform vec3 uStorm, uFlashDir, uFlashColor;
uniform vec2 uStormPos;
uniform vec3 uLight, uCenter;
uniform float uRadius;
uniform float uHasRing, uRingInner, uRingOuter, uRingOpacity, uRingSeed;
uniform vec3 uRingNormal;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vWorld;

${noiseGLSL}
${ringGLSL}

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z); }

void main() {
    vec3 p = normalize(vObj);
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(uLight);

    vec3 albedo;
    float ocean = 0.0, cloud = 0.0, ice = 0.0;

    if (uType == 0) {
        // Terran: warped continents, shelves, ice caps.
        vec3 q = p * 1.5 + uSeed;
        float fw = length(fwidth(q));
        vec3 w = vec3(fbmAA(q + 1.7, WARP_OCT, fw), fbmAA(q + 9.2, WARP_OCT, fw), fbmAA(q - 4.1, WARP_OCT, fw));
        float h = fbmAA(q + w * 0.7, OCT, fw);
        float sea = 0.04;
        // Coastline width follows the pixel footprint, so shores stay smooth at any size.
        float coast = max(0.008, fwidth(h) * 1.5);
        float land = smoothstep(sea - coast, sea + coast, h);
        vec3 water = mix(toLinear(uC0), toLinear(uC1), smoothstep(sea - 0.28, sea, h));
        vec3 ground = mix(toLinear(uC2), toLinear(uC3), smoothstep(sea + 0.04, 0.42, h));
        ground *= 0.85 + 0.3 * ridgedAA(q * 3.2, 4, fw * 3.2);
        ground = mix(ground, vec3(dot(ground, vec3(0.3, 0.59, 0.11))), 0.25);
        albedo = mix(water, ground, land);
        ocean = 1.0 - land;
        ice = smoothstep(0.8, 0.9, abs(p.y) + 0.08 * fbmAA(q * 4.0, 3, fw * 4.0));
        albedo = mix(albedo, vec3(0.86, 0.9, 0.95), ice);
        ocean *= 1.0 - ice;

        vec3 pc = rotY(p, uTime * 0.01);
        float c = fbmAA(pc * vec3(2.2, 3.4, 2.2) + uSeed * 1.7 + w * 0.35, OCT, fw * 2.4);
        cloud = smoothstep(0.08, 0.62, c) * uClouds;
    } else if (uType == 1) {
        // Gas giant: latitude bands, turbulent edges, fine streaks, one storm.
        vec3 q = p + uSeed;
        float fw = length(fwidth(q));
        float turb = fbmAA(vec3(q.x * 1.6, q.y * 5.5, q.z * 1.6) + vec3(uTime * 0.008, 0.0, 0.0), 5, fw * 5.5);
        float lat = p.y + turb * 0.07;
        // Irregular band widths: two incommensurate frequencies plus noise.
        float bands = sin(lat * 17.0 + sin(lat * 6.0 + uSeed) * 1.6 + uSeed) * 0.5 + 0.5;
        float bands2 = sin(lat * 41.0 + uSeed * 2.3) * 0.5 + 0.5;
        float fine = fbmAA(vec3(q.x * 3.0, lat * 70.0, q.z * 3.0), 4, fw * 70.0) * 0.5 + 0.5;
        vec3 c = mix(toLinear(uC0), toLinear(uC1), smoothstep(0.25, 0.85, bands) * 0.75);
        c = mix(c, toLinear(uC2), smoothstep(0.6, 0.95, bands2) * 0.45);
        c = mix(c, toLinear(uC3), smoothstep(0.62, 1.0, fine) * 0.3);
        c *= 0.9 + 0.2 * fine;
        c *= mix(1.0, 0.6, smoothstep(0.62, 0.98, abs(p.y)));
        vec2 sph = vec2(atan(p.z, p.x), asin(clamp(p.y, -1.0, 1.0)));
        vec2 sd = (sph - uStormPos) * vec2(1.0, 2.4);
        float storm = exp(-dot(sd, sd) * uStormSize);
        c = mix(c, toLinear(uStorm), storm * uStormAmt);
        albedo = c;
    } else if (uType == 2) {
        // Ice world: pale plains cut by dark cracks.
        vec3 q = p * 2.0 + uSeed;
        float fw = length(fwidth(q));
        float n = fbmAA(q, OCT, fw) * 0.5 + 0.5;
        float cracks = ridgedAA(q * 2.6, 5, fw * 2.6);
        albedo = mix(toLinear(uC0), toLinear(uC1), n);
        albedo = mix(albedo, toLinear(uC2), smoothstep(0.78, 0.98, cracks) * 0.75);
        vec3 pc = rotY(p, uTime * 0.006);
        cloud = smoothstep(0.25, 0.7, fbmAA(pc * 2.0 + uSeed, 4, fw)) * uClouds;
    } else {
        // Rocky: broad dark provinces (like the lunar maria or Mars's Syrtis
        // Major) over soft mottling, faint ridges, softened craters.
        vec3 q = p * 2.2 + uSeed;
        float fw = length(fwidth(q));
        float n = fbmAA(q, OCT, fw) * 0.5 + 0.5;
        float region = fbmAA(p * 1.1 + uSeed * 1.3, 4, fw * 0.5) * 0.5 + 0.5;
        float r = ridgedAA(q * 1.6, 5, fw * 1.6);
        float crater = smoothstep(0.62, 0.72, snoise(q * 5.5) * 0.5 + 0.5) * (1.0 - smoothstep(0.1, 0.25, fw * 5.5));
        albedo = mix(toLinear(uC0), toLinear(uC1), smoothstep(0.3, 0.7, n) * 0.6 + 0.4 * smoothstep(0.35, 0.65, region));
        albedo = mix(albedo, toLinear(uC2), smoothstep(0.52, 0.78, 1.0 - region) * 0.6);
        albedo *= 0.93 + 0.14 * r;
        albedo *= 1.0 - crater * 0.16;
        ice = smoothstep(0.9, 0.97, abs(p.y) + 0.05 * n) * uPolar;
        albedo = mix(albedo, vec3(0.88, 0.88, 0.9), ice);
    }

    // No bump mapping: relief shading from screen-space derivatives works in 2x2
    // pixel blocks and reads as pixelation. Surface detail lives in the colour.

    float ndl = dot(N, L);
    float diff = clamp((ndl + 0.05) / 1.05, 0.0, 1.0);
    vec3 sun = vec3(1.0, 0.97, 0.93) * 1.85 * uSun;
    vec3 col = albedo * sun * diff;
    // Limb darkening: thick atmospheres (gas giants) dim strongly toward the edge.
    float mu = max(dot(normalize(vNormalW), V), 0.0);
    col *= mix(uType == 1 ? 0.5 : 0.8, 1.0, pow(mu, 0.45));

    // Sun glint on open water.
    vec3 H = normalize(L + V);
    col += sun * vec3(1.0, 0.92, 0.82) * pow(max(dot(normalize(vNormalW), H), 0.0), 90.0) * 0.9 * ocean * (1.0 - cloud) * step(0.0, ndl);

    // Clouds, lit with a softer wrap than the ground below.
    float cloudLight = clamp((dot(normalize(vNormalW), L) + 0.12) / 1.12, 0.0, 1.0);
    col = mix(col, vec3(0.95, 0.96, 1.0) * sun * cloudLight, cloud * 0.92);

    // City lights on the night side.
    if (uCity > 0.0) {
        float night = smoothstep(0.02, -0.25, dot(normalize(vNormalW), L));
        float lights = smoothstep(0.68, 0.92, fbmAA(p * 18.0 + uSeed, 4, length(fwidth(p)) * 18.0) * 0.5 + 0.5);
        col += vec3(1.0, 0.64, 0.32) * lights * night * (1.0 - ocean) * (1.0 - ice) * (1.0 - cloud) * uCity * 0.22;
    }

    // The ring's shadow across the planet.
    if (uHasRing > 0.5) {
        float denom = dot(L, uRingNormal);
        if (abs(denom) > 1e-3) {
            float t = dot(uCenter - vWorld, uRingNormal) / denom;
            if (t > 0.0) {
                float rr = length(vWorld + L * t - uCenter);
                float rn = (rr - uRingInner) / (uRingOuter - uRingInner);
                col *= 1.0 - ringDensity(rn, uRingSeed) * uRingOpacity * 0.8;
            }
        }
    }

    // The supernova, when it goes, lights every planet from its side.
    col += albedo * uFlashColor * max(dot(N, uFlashDir), 0.0);

    // Atmosphere: scattering on the lit limb, a thin haze everywhere.
    vec3 Ng = normalize(vNormalW);
    float fres = pow(1.0 - max(dot(Ng, V), 0.0), 2.6);
    float limbLight = smoothstep(-0.3, 0.55, dot(Ng, L));
    vec3 atmo = toLinear(uAtmo);
    col = mix(col, atmo * sun * 0.5 * limbLight, fres * 0.55 * uAtmoStrength);
    col += atmo * fres * limbLight * uAtmoStrength * 0.9;

    // Faint bounce from the purple void on the dark side keeps it on-palette.
    col += toLinear(vec3(0.48, 0.2, 0.49)) * pow(1.0 - max(dot(Ng, V), 0.0), 3.0) * (1.0 - limbLight) * 0.1;
    col += albedo * 0.006;

    gl_FragColor = vec4(toScreen(col, gl_FragCoord.xy), uFade);
}
`;

const atmosphereFragment = /* glsl */ `
uniform vec3 uAtmo;
uniform vec3 uLight;
uniform float uStrength, uFade, uEdge;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorld);
    // Back faces of the shell: 0 at the shell's silhouette, 1 at the planet's limb.
    float t = clamp(-dot(N, V) / uEdge, 0.0, 1.0);
    float glow = pow(t, 2.2) * (1.0 - smoothstep(0.92, 1.0, t) * 0.6);
    float lit = smoothstep(-0.35, 0.6, dot(N, normalize(uLight)));
    vec3 c = pow(uAtmo, vec3(2.2)) * glow * lit * uStrength * 1.3;
    gl_FragColor = vec4(pow(c, vec3(1.0 / 2.2)) * uFade, 1.0);
}
`;

const ringVertex = /* glsl */ `
varying vec3 vLocal;
varying vec3 vWorld;
void main() {
    vLocal = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const ringFragment = /* glsl */ `
uniform vec3 uC0, uC1;
uniform vec3 uLight, uCenter, uRingNormal;
uniform float uInner, uOuter, uOpacity, uSeed, uRadius, uFade, uSun;
varying vec3 vLocal;
varying vec3 vWorld;
${noiseGLSL}
${ringGLSL}
void main() {
    float rn = (length(vLocal.xy) - uInner) / (uOuter - uInner);
    float d = ringDensityAA(rn, uSeed, fwidth(rn));
    if (d < 0.002) discard;

    vec3 L = normalize(uLight);
    float fwr = fwidth(rn);
    vec3 col = mix(toLinear(uC0), toLinear(uC1), mix(0.5, ringNoise(rn * 45.0 + uSeed * 5.0), 1.0 - smoothstep(0.25, 0.5, fwr * 45.0)));
    // Thin particles scatter light from either face.
    float lit = 0.3 + 0.7 * abs(dot(uRingNormal, L));
    col *= vec3(1.0, 0.97, 0.93) * 1.7 * uSun * lit;

    // Planet's shadow falling across the ring.
    vec3 toC = uCenter - vWorld;
    float tc = dot(toC, L);
    if (tc > 0.0) {
        float dist2 = dot(toC, toC) - tc * tc;
        float r2 = uRadius * uRadius;
        col *= mix(0.06, 1.0, smoothstep(r2 * 0.9, r2 * 1.05, dist2));
    }

    gl_FragColor = vec4(toScreen(col, gl_FragCoord.xy), d * uOpacity * uFade);
}
`;

// `origin` is the journey stop this planet belongs to; the spec positions it
// relative to a camera standing there.
type PlanetProps = { spec: PlanetSpec; origin: THREE.Vector3; lowQuality: boolean; reducedMotion: boolean };

export default function Planet({ spec, origin, lowQuality, reducedMotion }: PlanetProps) {
    const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
    const aspect = useThree((s) => s.viewport.aspect);
    const groupRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Mesh>(null);
    const fade = useRef(0);

    // Place by apparent screen position and size, so the composition holds at any
    // aspect ratio. Narrow (portrait) screens shrink planets to fit the width.
    const { position, radius } = useMemo(() => {
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * spec.depth;
        const halfW = halfH * aspect;
        const narrow = THREE.MathUtils.clamp(aspect, 0.55, 1);
        return {
            position: new THREE.Vector3(spec.screen[0] * halfW, spec.screen[1] * halfH, -spec.depth).add(origin),
            radius: spec.size * halfH * narrow,
        };
    }, [camera.fov, aspect, spec, origin]);

    // Big planets need a dense mesh or their silhouette shows facets; small ones don't.
    const segments: [number, number, number] = spec.size >= 0.15 ? [1, 160, 120] : [1, 64, 48];

    const ring = spec.ring;
    const atmoStrength = spec.atmosphere?.strength ?? 0;
    const atmoShell = spec.type === "gas" ? 1.035 : spec.type === "rocky" ? 1.02 : 1.06;

    const materials = useMemo(() => {
        const shared = {
            uLight: { value: SUN_DIRECTION },
            uCenter: { value: new THREE.Vector3() },
            uRadius: { value: 1 },
            uFade: { value: 0 },
        };
        const ringNormal = { value: new THREE.Vector3(0, 1, 0) };

        const surface = new THREE.ShaderMaterial({
            defines: { OCT: lowQuality ? 4 : 6, WARP_OCT: lowQuality ? 2 : 4 },
            uniforms: {
                ...shared,
                uType: { value: TYPE_INDEX[spec.type] },
                uC0: { value: srgb(spec.colors[0]) },
                uC1: { value: srgb(spec.colors[1]) },
                uC2: { value: srgb(spec.colors[2]) },
                uC3: { value: srgb(spec.colors[3]) },
                uAtmo: { value: srgb(spec.atmosphere?.color ?? "#000000") },
                uAtmoStrength: { value: atmoStrength },
                uClouds: { value: spec.clouds ?? 0 },
                uCity: { value: spec.cityLights ? 1 : 0 },
                uSeed: { value: spec.seed },
                uTime: { value: 0 },
                uHasRing: { value: ring ? 1 : 0 },
                uRingInner: { value: 0 },
                uRingOuter: { value: 1 },
                uRingOpacity: { value: ring?.opacity ?? 0 },
                uRingSeed: { value: spec.seed * 3.7 },
                uRingNormal: ringNormal,
                uSun: { value: spec.sun ?? 1 },
                uPolar: { value: spec.polarCaps ?? 0 },
                uStorm: { value: srgb(spec.storm?.color ?? "#000000") },
                uStormAmt: { value: spec.storm?.amount ?? 0 },
                uStormPos: { value: new THREE.Vector2(spec.storm?.lon ?? 0, spec.storm?.lat ?? 0) },
                uStormSize: { value: spec.storm?.size ?? 22 },
                ...flashLight,
            },
            vertexShader: surfaceVertex,
            fragmentShader: surfaceFragment,
            transparent: true,
        });

        const atmosphere = atmoStrength > 0 ? new THREE.ShaderMaterial({
            uniforms: {
                uLight: shared.uLight,
                uFade: shared.uFade,
                uAtmo: { value: srgb(spec.atmosphere!.color) },
                uStrength: { value: atmoStrength },
                uEdge: { value: Math.sqrt(1 - 1 / (atmoShell * atmoShell)) },
            },
            vertexShader: surfaceVertex,
            fragmentShader: atmosphereFragment,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        }) : null;

        const rings = ring ? new THREE.ShaderMaterial({
            uniforms: {
                ...shared,
                uC0: { value: srgb(ring.colors[0]) },
                uC1: { value: srgb(ring.colors[1]) },
                uInner: { value: ring.inner },
                uOuter: { value: ring.outer },
                uOpacity: { value: ring.opacity },
                uSeed: { value: spec.seed * 3.7 },
                uRingNormal: ringNormal,
                uSun: { value: spec.sun ?? 1 },
            },
            vertexShader: ringVertex,
            fragmentShader: ringFragment,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        }) : null;

        return { surface, atmosphere, rings, shared, ringNormal };
    }, [spec, lowQuality, ring, atmoStrength, atmoShell]);

    useEffect(() => () => {
        materials.surface.dispose();
        materials.atmosphere?.dispose();
        materials.rings?.dispose();
    }, [materials]);

    // World-space values the shaders need for shadows between ring and planet.
    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;
        group.updateWorldMatrix(true, false);
        materials.shared.uCenter.value.copy(position);
        materials.shared.uRadius.value = radius;
        materials.ringNormal.value.set(0, 1, 0).applyQuaternion(group.getWorldQuaternion(new THREE.Quaternion()));
        if (ring) {
            materials.surface.uniforms.uRingInner.value = ring.inner * radius;
            materials.surface.uniforms.uRingOuter.value = ring.outer * radius;
        }
    }, [materials, position, radius, ring]);

    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.1);
        const motion = reducedMotion ? 0.2 : 1;
        if (bodyRef.current) bodyRef.current.rotation.y += spec.spin * dt * motion;
        materials.surface.uniforms.uTime.value += dt * motion;

        // Ease in when the scene first appears: fade up and settle from slightly smaller.
        fade.current = Math.min(1, fade.current + dt / 1.6);
        const eased = 1 - Math.pow(1 - fade.current, 3);
        materials.shared.uFade.value = eased;
        groupRef.current?.scale.setScalar(radius * (0.94 + 0.06 * eased));
    });

    return (
        <group ref={groupRef} position={position} rotation={[spec.tip ?? 0, 0, spec.tilt]} scale={0}>
            <mesh ref={bodyRef} material={materials.surface} renderOrder={0}>
                <sphereGeometry args={segments} />
            </mesh>
            {materials.atmosphere && (
                <mesh material={materials.atmosphere} scale={atmoShell} renderOrder={2}>
                    <sphereGeometry args={[1, 64, 48]} />
                </mesh>
            )}
            {materials.rings && ring && (
                <mesh material={materials.rings} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
                    <ringGeometry args={[ring.inner, ring.outer, 256, 1]} />
                </mesh>
            )}
        </group>
    );
}
