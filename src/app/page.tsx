'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function WarpLines() {
    const [phase, setPhase] = useState<"dots" | "lines" | "warp">("dots");
    const lineCount = 1000;
    const baseSpeed = 0.01;
    const maxSpeed = 500;
    const exp = 0.1;

    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(lineCount * 6);
        const velocities = new Float32Array(lineCount * 2)

        for (let i = 0; i < lineCount; i++) {
            let x = (Math.random() * 400) - 200;
            let y = (Math.random() * 200) - 100;
            let z = (Math.random() * 500) - 100;
            let xx = x;
            let yy = y;
            let zz = z; 

            // Line start
            positions[6 * i + 0] = x;
            positions[6 * i + 1] = y;
            positions[6 * i + 2] = z;

            // Line end
            positions[6 * i + 3] = xx;
            positions[6 * i + 4] = yy;
            positions[6 * i + 5] = zz;

            // Set speed to 0 for both points
            velocities[2 * i] = velocities[2 * i + 1] = baseSpeed;
        }

        return { positions, velocities}
    }, []);

    const maxWarp = 0.005;    // can go beyond 1 if you want extra punch
    const slowDownAfter = 3; // seconds of full warp
    const warpFactor = useRef(0); // 0 = slow, 1 = full warp speed;
    const starRef = useRef<THREE.LineSegments>(null);
    const timeAtMax = useRef<number | null>(null); // when we first hit max
    const shouldRecycleLines = useRef(true);

    useFrame((state) => {
        const dt = state.clock.getDelta();
        const t = state.clock.elapsedTime;
        // smooth ramp of warpFactor to 1
        // 1) RAMP UP TO MAX WARP
        if (warpFactor.current < maxWarp) {
            warpFactor.current = Math.min(maxWarp, warpFactor.current + dt * 1.5);
        }

        // 2) ONCE AT MAX, remember the time and start cooldown
        if (warpFactor.current >= maxWarp && timeAtMax.current === null) {
            timeAtMax.current = t;
        }

        // 3) SLOW DOWN AFTER `slowDownAfter` seconds at max
        if (timeAtMax.current !== null && t > timeAtMax.current + slowDownAfter) {
            const reduce = 0.000005;
            warpFactor.current = Math.max(0, warpFactor.current - reduce); // don't go fully to 0

            if (shouldRecycleLines.current) {
                shouldRecycleLines.current = false;
            };
        }

        const geom = starRef.current?.geometry;
        if (!geom) return;

        const positions = geom.attributes.position;
        const velocities = geom.attributes.velocity;

        if (!positions  || !velocities) return;
        
        const posAttr = positions.array;
        const velAttr = velocities.array;

        
        for (let i = 0; i < lineCount; i++) {
            // Accelerate
            velAttr[2 * i] = Math.min(maxSpeed, velAttr[2 * i] * 1.01);
            velAttr[2 * i + 1] = Math.min(maxSpeed, velAttr[2 * i + 1] * 1.009);

            // Update positions of start and end points of lines
            posAttr[6 * i + 2] += velAttr[2 * i] * warpFactor.current;
            posAttr[6 * i + 5] += velAttr[2 * i + 1] * warpFactor.current;

            // When pass screen, set them at new starting spots
            if(shouldRecycleLines.current && posAttr[6 * i + 5] > 200) {
                let z = Math.random() * 200 - 100;
                posAttr[6 * i + 2] = z;
                posAttr[6 * i + 5] = z;
                velAttr[2 * i] *= 0.9;
                velAttr[2 * i + 1] *= 0.5;
            }
        }

        positions.needsUpdate = true;
        velocities.needsUpdate = true;
    })

    useEffect(() => {
        const id1 = setTimeout(() => setPhase("lines"), 2000);
        const id2 = setTimeout(() => setPhase("warp"), 4000);
        return () => {
            clearTimeout(id1);
            clearTimeout(id2);
        };
    }, []);

    return (
        <lineSegments ref={starRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={positions.length / 3}
                />
                <bufferAttribute
                    attach="attributes-velocity"
                    args={[velocities, 1]}
                    count={velocities.length}
                />
            </bufferGeometry>
            <lineBasicMaterial color="white" linewidth={1}/>
        </lineSegments>
    )

}

export default function Home() {
    
    return(
        <div className="h-screen w-screen">
          <Canvas 
            camera={{
                fov: 60,
                near: 1,
                far: 500,
                position: [0, 0, 200],
            }}
          >
            <WarpLines/>
          </Canvas>
        </div>
    );
}