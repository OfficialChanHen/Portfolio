'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function WarpLines() {
    const lineCount = 1000;
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(lineCount * 6);
        const velocities = new Float32Array(lineCount * 2)

        for (let i = 0; i < lineCount; i++) {
            let lineStart = i * 6;
            let x = (Math.random() * 400) - 200;
            let y = (Math.random() * 200) - 100;
            let z = (Math.random() * 500) - 100;
            let xx = x;
            let yy = y;
            let zz = z; 

            // Line start
            positions[lineStart + 0] = x;
            positions[lineStart + 1] = y;
            positions[lineStart + 2] = z;

            // Line end
            positions[lineStart + 3] = xx;
            positions[lineStart + 4] = yy;
            positions[lineStart + 5] = zz;

            // Set speed to 0 for both points
            velocities[2 * i] = velocities[2 * i + 1] = 0;
        }

        return { positions, velocities }
    }, []);

    const lineRef = useRef<THREE.LineSegments>(null);

    useFrame(() => {
        const positions = lineRef.current?.geometry.attributes.position
        const velocities = lineRef.current?.geometry.attributes.velocity

        if (!positions  || !velocities) return;
        
        const posAttr = positions.array;
        const velAttr = velocities.array;

        for (let i = 0; i < lineCount; i++) {
            // Accelerate
            velAttr[2 * i] += 0.05;
            velAttr[2 * i + 1] += 0.04;

            // Update positions of start and end points of lines
            posAttr[6 * i + 2] += velAttr[2 * i];
            posAttr[6 * i + 5] += velAttr[2 * i + 1];

            // When pass screen, set them at new starting spots
            if(posAttr[6 * i + 5] > 200) {
                let z = Math.random() * 200 - 100;
                posAttr[6 * i + 2] = z;
                posAttr[6 * i + 5] = z;
                velAttr[2 * i] = 0;
                velAttr[2 * i + 1] = 0;
            }
        }

        positions.needsUpdate = true;
    })

    return (
        <lineSegments ref={lineRef}>
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