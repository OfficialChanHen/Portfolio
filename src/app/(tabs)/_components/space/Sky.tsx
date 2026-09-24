'use client';
// three.js objects are mutated every frame (the R3F idiom), which the React
// Compiler can't model, so these components opt out of it.
"use no memo";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { noiseGLSL, srgb } from "./glsl";

// Direction of the galactic band's pole. The band itself (the great circle
// around this axis) runs from lower left to upper right across the view.
export const GALACTIC_POLE = new THREE.Vector3(-0.62, 0.78, 0.12).normalize();

// Equirect mapping shared by the bake and the sky lookup, so what's baked in a
// given direction is exactly what's drawn there.
const equirectGLSL = /* glsl */ `
const float PI = 3.141592653589793;
vec2 dirToUv(vec3 d) { return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5); }
vec3 uvToDir(vec2 uv) {
    float lon = (uv.x - 0.5) * 2.0 * PI, lat = (uv.y - 0.5) * PI;
    return vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon));
}
`;

// The nebula is expensive (several octaves of 3D noise per pixel), so it's
// rendered once into a float texture and the sky just samples it.
const bakeFragment = /* glsl */ `
precision highp float;
uniform vec3 uPole;
uniform vec3 uVoid, uDeep, uMauve, uRose, uCool;
varying vec2 vUv;
${noiseGLSL}
${equirectGLSL}

void main() {
    vec3 d = uvToDir(vUv);

    float band = exp(-pow(dot(d, uPole) / 0.32, 2.0));
    float broad = fbm(d * 0.9 + 11.0, 3) * 0.5 + 0.5;

    vec3 w = vec3(fbm(d * 1.7 + 3.1, 4), fbm(d * 1.7 - 7.4, 4), fbm(d * 1.7 + 19.3, 4));
    float cloud = fbm(d * 2.4 + w * 0.9, 6) * 0.5 + 0.5;
    float wisp = fbm(d * 7.0 + w * 1.4, 5) * 0.5 + 0.5;
    float dust = fbm(d * 4.2 + w * 0.6 + 5.0, 5) * 0.5 + 0.5;

    float glow = smoothstep(0.42, 0.95, cloud) * (0.25 + 0.75 * band) * (0.55 + 0.9 * broad);

    vec3 col = toLinear(uVoid);
    // A cooler, bluer void on the far side of the band for depth.
    col = mix(col, toLinear(uCool), 0.55 * smoothstep(0.35, 0.8, broad) * (1.0 - band));
    col += toLinear(uDeep) * glow * 1.6;
    col += toLinear(uMauve) * pow(glow, 2.0) * wisp * 0.9;
    col += toLinear(uRose) * pow(glow, 4.0) * smoothstep(0.55, 0.9, wisp) * 0.55;
    // Dark dust lanes threading the brightest parts of the band.
    col *= 1.0 - 0.6 * smoothstep(0.55, 0.78, dust) * band;

    gl_FragColor = vec4(col, 1.0);
}
`;

const skyFragment = /* glsl */ `
precision highp float;
uniform sampler2D uNebula;
uniform vec2 uResolution;
varying vec3 vDir;
${noiseGLSL}
${equirectGLSL}

void main() {
    vec3 col = texture2D(uNebula, dirToUv(normalize(vDir))).rgb;
    // Gentle vignette pulls the corners further into the void.
    vec2 q = gl_FragCoord.xy / uResolution - 0.5;
    col *= 1.0 - 0.55 * dot(q, q) * 1.6;
    gl_FragColor = vec4(toScreen(col, gl_FragCoord.xy), 1.0);
}
`;

export default function Sky({ lowQuality }: { lowQuality: boolean }) {
    const gl = useThree((s) => s.gl);
    const size = useThree((s) => s.size);
    const dpr = useThree((s) => s.viewport.dpr);

    const nebula = useMemo(() => {
        const width = lowQuality ? 1536 : 4096;
        const target = new THREE.WebGLRenderTarget(width, width / 2, {
            type: THREE.HalfFloatType,
            depthBuffer: false,
            generateMipmaps: false,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            wrapS: THREE.RepeatWrapping,
        });

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uPole: { value: GALACTIC_POLE },
                uVoid: { value: srgb("#0a0212") },
                uDeep: { value: srgb("#210535") },
                uMauve: { value: srgb("#7B337D") },
                uRose: { value: srgb("#C874B2") },
                uCool: { value: srgb("#0b0a22") },
            },
            vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
            fragmentShader: bakeFragment,
            depthTest: false,
            depthWrite: false,
        });
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        const scene = new THREE.Scene();
        scene.add(quad);

        const previous = gl.getRenderTarget();
        gl.setRenderTarget(target);
        gl.render(scene, new THREE.Camera());
        gl.setRenderTarget(previous);

        quad.geometry.dispose();
        material.dispose();
        return target;
    }, [gl, lowQuality]);

    useEffect(() => () => nebula.dispose(), [nebula]);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uNebula: { value: nebula.texture },
            uResolution: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: /* glsl */ `
            varying vec3 vDir;
            void main() {
                vDir = position;
                vec4 clip = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                gl_Position = clip.xyww; // pinned to the far plane
            }
        `,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthTest: false,
        depthWrite: false,
    }), [nebula]);

    useEffect(() => {
        material.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    }, [material, size, dpr]);

    useEffect(() => () => material.dispose(), [material]);

    return (
        <mesh material={material} renderOrder={-1000} frustumCulled={false} scale={500}>
            <sphereGeometry args={[1, 48, 24]} />
        </mesh>
    );
}
