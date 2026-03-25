'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function WarpLines() {
    const [phase, setPhase] = useState<"dots" | "lines">("dots");
    const lineCount = 1000;
    const { positions, velocities, sizes, intensities } = useMemo(() => {
        const positions = new Float32Array(lineCount * 6);
        const velocities = new Float32Array(lineCount * 2)
        const sizes = new Float32Array(lineCount);
        const intensities = new Float32Array(lineCount);

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
            velocities[2 * i] = velocities[2 * i + 1] = 0;

            // Set leading point to have different sizes
            sizes[i] = (Math.random() * 1.5) + 0.5;
            intensities[i] = (Math.random() * 0.5) + 0.5;
        }

        return { positions, velocities, sizes, intensities }
    }, []);

    const starRef = useRef<THREE.Points | THREE.LineSegments>(null);

    useFrame(() => {
        const geom = starRef.current?.geometry;
        if (!geom) return;

        const positions = geom.attributes.position;
        const velocities = geom.attributes.velocity;

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

    useEffect(() => {
        const id = setTimeout(() => setPhase("lines"), 2000); // dots for 2s
        return () => clearTimeout(id);
    }, []);

    if(phase === "dots") {
        return (
        <points ref={starRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={positions.length / 3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]} // for `pointsMaterial`
                />
            </bufferGeometry>
            <pointsMaterial
                size={1}
                sizeAttenuation
                vertexColors={false} // or true if you later pass intensity as color
                color="white"
            />
        </points>
        );
    }
    if(phase === "lines") {
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

    return null;
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