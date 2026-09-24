// Shared GLSL for the space scene. Every material here is a raw ShaderMaterial
// with no three.js tone-mapping/colour-space chunks, so each shader owns its
// final output: colours come in as sRGB, lighting runs in linear, and `toScreen`
// maps back to sRGB.

import * as THREE from "three";

// sRGB hex -> vec3 uniform (still sRGB; shaders linearise with `toLinear`).
export function srgb(hex: string) {
    const n = parseInt(hex.replace("#", ""), 16);
    return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT) + fbm helpers.
export const noiseGLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Fractal sum, roughly -1..1.
float fbm(vec3 p, int octaves) {
    float sum = 0.0, amp = 0.5, norm = 0.0;
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        sum += amp * snoise(p);
        norm += amp;
        p = p * 2.03 + vec3(17.1, -9.2, 4.7);
        amp *= 0.5;
    }
    return sum / norm;
}

// Ridged fractal, 0..1 with sharp creases (mountain ridges, ice cracks).
float ridged(vec3 p, int octaves) {
    float sum = 0.0, amp = 0.5, norm = 0.0;
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        float n = 1.0 - abs(snoise(p));
        sum += amp * n * n;
        norm += amp;
        p = p * 2.07 + vec3(-3.3, 8.1, 1.9);
        amp *= 0.5;
    }
    return sum / norm;
}

// Band-limited versions for surfaces seen at any size. \`fw\` is how far the
// input coordinate moves per screen pixel (length(fwidth(p))); octaves finer
// than a pixel fade to their average instead of aliasing into speckle.
float fbmAA(vec3 p, int octaves, float fw) {
    float sum = 0.0, amp = 0.5, norm = 0.0;
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        sum += amp * snoise(p) * (1.0 - smoothstep(0.2, 0.45, fw));
        norm += amp;
        p = p * 2.03 + vec3(17.1, -9.2, 4.7);
        fw *= 2.03;
        amp *= 0.5;
    }
    return sum / norm;
}

float ridgedAA(vec3 p, int octaves, float fw) {
    float sum = 0.0, amp = 0.5, norm = 0.0;
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        float n = 1.0 - abs(snoise(p));
        sum += amp * mix(0.47, n * n, 1.0 - smoothstep(0.2, 0.45, fw));
        norm += amp;
        p = p * 2.07 + vec3(-3.3, 8.1, 1.9);
        fw *= 2.07;
        amp *= 0.5;
    }
    return sum / norm;
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }

// Filmic curve (ACES fit) + sRGB encode + a hair of dither so dark gradients
// don't band on 8-bit displays.
vec3 toScreen(vec3 linear, vec2 fragCoord) {
    vec3 x = linear * 0.9;
    x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    vec3 s = pow(x, vec3(1.0 / 2.2));
    return s + (hash12(fragCoord) - 0.5) / 255.0;
}
`;

// Radial ring density profile shared by the ring material and the planet (for
// the ring's shadow on the planet). r is 0 at the inner edge, 1 at the outer.
export const ringGLSL = /* glsl */ `
float ringHash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float ringNoise(float x) {
    float i = floor(x), f = fract(x);
    return mix(ringHash(i), ringHash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
// \`fw\` is how far r moves per pixel; ringlets finer than that settle to their
// average so small or distant rings don't shimmer. Pass 0 for no filtering.
float ringDensityAA(float r, float seed, float fw) {
    if (r < 0.0 || r > 1.0) return 0.0;
    float d = 0.5 * mix(0.5, ringNoise(r * 18.0 + seed), 1.0 - smoothstep(0.25, 0.5, fw * 18.0))
            + 0.3 * mix(0.5, ringNoise(r * 55.0 + seed * 2.0), 1.0 - smoothstep(0.25, 0.5, fw * 55.0))
            + 0.2 * mix(0.5, ringNoise(r * 160.0 + seed * 3.0), 1.0 - smoothstep(0.25, 0.5, fw * 160.0));
    // Fine ringlets ride on broad bright and dim zones, and never quite vanish.
    d = (0.5 + 0.5 * smoothstep(0.2, 0.85, d)) * (0.4 + 0.6 * ringNoise(r * 5.0 + seed * 4.0));
    // A clean division two-thirds out, and a thin gap near the edge.
    d *= 1.0 - 0.92 * (1.0 - smoothstep(0.0, 0.025, abs(r - 0.64)));
    d *= 1.0 - 0.6 * (1.0 - smoothstep(0.0, 0.01, abs(r - 0.88)));
    // Soft inner and outer edges.
    d *= smoothstep(0.0, 0.06, r) * (1.0 - smoothstep(0.93, 1.0, r));
    return d;
}
float ringDensity(float r, float seed) { return ringDensityAA(r, seed, 0.0); }
`;
