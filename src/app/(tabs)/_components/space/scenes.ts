import type { PlanetSpec } from "./Planet";

// The site is a trip out through the solar system, one tab per world in nav
// order: Earth, Mars, Jupiter, Saturn, with the ice giants waiting beyond
// Saturn. The camera flies between stops, so the next worlds sit small in the
// distance and grow as you go.
//
// Planet positions are screen fractions (x right, y up, -1..1) as seen from
// their own stop, so a planet framed half off the edge stays there on any
// screen. A stop's offset is where it appears as seen from the stop before it.
// Sizes are composed for the page, not to scale.

export const STOP_SPACING = 560;

const planets: Record<string, PlanetSpec[]> = {
    "/home": [
        {
            id: "earth", type: "terran", screen: [-0.74, -0.84], depth: 70, size: 0.46,
            colors: ["#0a1d3a", "#1b4f78", "#56683f", "#8a7a5e"],
            atmosphere: { color: "#6fa8ff", strength: 1 }, clouds: 0.9, cityLights: true,
            tilt: 0.41, spin: 0.02, seed: 12.6,
        },
        {
            id: "moon", type: "rocky", screen: [-0.16, -0.3], depth: 85, size: 0.045,
            colors: ["#7a767c", "#b9b5ba", "#46424a", "#000000"],
            tilt: 0.1, spin: 0.01, seed: 1.9,
        },
    ],
    "/about": [
        {
            id: "mars", type: "rocky", screen: [0.9, 0.36], depth: 70, size: 0.3,
            colors: ["#8e4024", "#c9744a", "#4e2114", "#000000"],
            atmosphere: { color: "#e8a07a", strength: 0.35 }, polarCaps: 1,
            tilt: 0.44, spin: 0.03, seed: 2.4, sun: 0.93,
        },
        {
            id: "phobos", type: "rocky", screen: [0.4, 0.74], depth: 80, size: 0.018,
            colors: ["#5e5249", "#857566", "#3a302a", "#000000"],
            tilt: 0.2, spin: 0.04, seed: 4.2, sun: 0.93,
        },
    ],
    "/projects": [
        {
            id: "jupiter", type: "gas", screen: [0.84, 0.74], depth: 70, size: 0.34,
            colors: ["#e9ddc6", "#c39a6c", "#f5efe3", "#8a5c3e"],
            atmosphere: { color: "#f0dcc0", strength: 0.4 },
            storm: { color: "#b8573a", amount: 0.9, lon: 2.2, lat: -0.36, size: 16 },
            tilt: 0.05, spin: 0.05, seed: 9.9, sun: 0.82,
        },
        {
            id: "io", type: "rocky", screen: [0.3, 0.58], depth: 80, size: 0.02,
            colors: ["#d6c25c", "#efe29c", "#9c6428", "#000000"],
            tilt: 0.05, spin: 0.03, seed: 6.1, sun: 0.82,
        },
        {
            id: "europa", type: "ice", screen: [0.5, 0.9], depth: 95, size: 0.018,
            colors: ["#ede4d6", "#d5c4a8", "#8a6a4a", "#000000"],
            tilt: 0.05, spin: 0.03, seed: 7.7, sun: 0.82,
        },
    ],
    "/contact": [
        {
            id: "saturn", type: "gas", screen: [0.95, -0.96], depth: 70, size: 0.5,
            colors: ["#e3d1a2", "#c6aa74", "#f0e5c4", "#a0845a"],
            atmosphere: { color: "#f3e3b8", strength: 0.4 },
            ring: { inner: 1.25, outer: 2.3, colors: ["#e0cfa8", "#8c7a5a"], opacity: 0.85 },
            tilt: -0.34, tip: 0.3, spin: 0.03, seed: 14.2, sun: 0.75,
        },
        {
            id: "titan", type: "gas", screen: [0.22, -0.4], depth: 80, size: 0.024,
            colors: ["#d49a48", "#c68c3c", "#e2b064", "#a8742e"],
            atmosphere: { color: "#f0b860", strength: 0.8 },
            tilt: 0.1, spin: 0.02, seed: 5.3, sun: 0.75,
        },
        // Beyond Saturn, never reached: the ice giants, far off and faint.
        // Uranus rolls on its side, rings and all.
        {
            id: "uranus", type: "gas", screen: [-0.55, 0.42], depth: 650, size: 0.034,
            colors: ["#b6e0e4", "#a4d3d8", "#c8ebee", "#93c3c9"],
            atmosphere: { color: "#c8f2f5", strength: 0.5 },
            ring: { inner: 1.6, outer: 1.95, colors: ["#b8c6c8", "#6e7c80"], opacity: 0.3 },
            tilt: 1.7, spin: 0.03, seed: 8.8, sun: 0.62,
        },
        {
            id: "neptune", type: "gas", screen: [-0.22, 0.62], depth: 1000, size: 0.028,
            colors: ["#2f4fa8", "#3c62c0", "#5a80d8", "#22397e"],
            atmosphere: { color: "#6f95ff", strength: 0.8 },
            storm: { color: "#1a2660", amount: 0.7, lon: -0.8, lat: -0.3, size: 20 },
            tilt: 0.49, spin: 0.04, seed: 11.4, sun: 0.58,
        },
    ],
};

export type Stop = { route: string; offset: [number, number]; planets: PlanetSpec[] };

export const journey: Stop[] = [
    { route: "/home", offset: [0, 0], planets: planets["/home"] },
    { route: "/about", offset: [0.28, 0.1], planets: planets["/about"] },
    { route: "/projects", offset: [-0.55, 0.42], planets: planets["/projects"] },
    { route: "/contact", offset: [0.55, -0.45], planets: planets["/contact"] },
];
