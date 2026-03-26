'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect  } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

type WarpProps = {
    isMobile: boolean;
}

export default function Warp({ isMobile }: WarpProps) {
    const router = useRouter();
    const hasNavigated = useRef(false);  // NEW: Prevent repeats
    const maxWarp = 4;    // can go beyond 1 if you want extra punch
    const slowDownAfter = 2; // seconds of full warp
    const warpFactor = useRef(0); // 0 = slow, 1 = full warp speed;
    const starRef = useRef<THREE.LineSegments>(null);
    const timeAtMax = useRef<number | null>(null); // when we first hit max
    const shouldRecycleLines = useRef(true);
    const timer = new THREE.Timer();

    function WarpLines() {
        const lineCount = isMobile ? 500 : 1000;
        const baseSpeed = isMobile ? 0.1 : 0.01;
        const maxSpeed = 500;

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

        useFrame(() => {
            timer.update();                      // once per frame (timestamp optional)
            const dt = timer.getDelta();         // seconds since last update()
            const t = timer.getElapsed();        // total seconds
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
                //const reduce = 0.1;
                //warpFactor.current = Math.max(0, warpFactor.current - reduce); // don't go fully to 0

                if (shouldRecycleLines.current) {
                    shouldRecycleLines.current = false;
                }
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
                velAttr[2 * i] = Math.min(maxSpeed, velAttr[2 * i] * 1.0075);
                velAttr[2 * i + 1] = Math.min(maxSpeed, velAttr[2 * i + 1] * 1.007);

                // Update positions of start and end points of lines
                posAttr[6 * i + 2] += velAttr[2 * i] * warpFactor.current;
                posAttr[6 * i + 5] += velAttr[2 * i + 1] * warpFactor.current;

                // When pass screen, set them at new starting spots
                if(shouldRecycleLines.current && posAttr[6 * i + 5] > 200) {
                    let z = Math.random() * 200 - 100;
                    posAttr[6 * i + 2] = z;
                    posAttr[6 * i + 5] = z;
                    velAttr[2 * i] *= 0.9;
                    velAttr[2 * i + 1] *= 0.7;
                }
            }

            positions.needsUpdate = true;
            velocities.needsUpdate = true;
        })

        useEffect(() => {
            const checkNavigate = () => {
                const t = timer.getElapsed();
                if (timeAtMax.current !== null && 
                    t > timeAtMax.current + slowDownAfter + 1 && 
                    !hasNavigated.current) {
                    hasNavigated.current = true;
                    router.push('/home');
                }
            };

            // Poll every 100ms (efficient, not frame-rate)
            const interval = setInterval(checkNavigate, 100);
            return () => clearInterval(interval);
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

    };

    return (
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
    )
}

