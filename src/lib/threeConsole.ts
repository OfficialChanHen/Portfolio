import { setConsoleFunction } from "three";

// three r183 deprecated THREE.Clock, but @react-three/fiber (through 9.8.x)
// still creates one for every <Canvas>, so the warning fires on each mount and
// there's nothing on our side to change. Drop that one message; everything
// else three logs passes through untouched.
const UPSTREAM_DEPRECATIONS = ["THREE.Clock: This module has been deprecated"];

setConsoleFunction((type, message, ...params) => {
    if (UPSTREAM_DEPRECATIONS.some((m) => message.includes(m))) return;
    console[type](message, ...params);
});
