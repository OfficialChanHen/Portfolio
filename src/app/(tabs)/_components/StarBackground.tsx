'use client';

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import Planet from "@/app/(tabs)/_components/Planet";

function StarField() {
    const ref = useRef<THREE.Points>(null);

    const { positions } = useMemo(() => {
    const positions = new Float32Array(10000 * 3);
    for (let i = 0; i < 10000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    return { positions };
    }, []);

    useFrame(() => {
        if (!ref.current) return;
        ref.current.rotation.y += 0.00015;
        ref.current.rotation.x += 0.00005;
    });

    return (
    <points ref={ref}>
        <bufferGeometry>
        <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
        />
        </bufferGeometry>
        <pointsMaterial color={0xffffff} size={0.8} transparent />
    </points>
    );
}

function Nebula({
    count,
    spread,
    color,
    size,
    opacity,
    rotationSign = 1,
}: {
    count: number;
    spread: number;
    color: number;
    size: number;
    opacity: number;
    rotationSign?: number;
}) {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * spread;
            arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
            arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
        }

        return arr;
    }, [count, spread]);

    useFrame(() => {
        if (!ref.current) return;

        ref.current.rotation.y += rotationSign * 0.0005;
        ref.current.rotation.x += rotationSign * 0.0003;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color={color}
                size={size}
                transparent
                opacity={opacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

function CameraRig() {
    const { camera } = useThree();
    const pointer = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
    
    useFrame(() => {
        camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * 0.01;
        camera.position.y += (pointer.current.y * 0.5 - camera.position.y) * 0.01;
        camera.lookAt(0, 0, 0);
    });
    
    return null;
}

export default function StarBackground() {
    const pathName = usePathname();

    return (
        <div
            className="fixed inset-0 min-h-screen min-w-screen flex flex-col pointer-events-none -z-10 bg-linear-to-b from-secondary to-tertiary"
        >
            <Canvas
                className="w-full h-full"
                camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
                gl={{ alpha: true, antialias: true }}
            >
                <CameraRig />
                <StarField />
                {pathName === '/home' &&
                    <>  
                        <Planet sphereColor1="#A98307" sphereColor2="#f0d785" spherePosition={{x: -10, y: 20, z: -20}} ringColor="#534104"/>
                        <Planet sphereColor1="#210535" sphereColor2="#063971" spherePosition={{x: 15, y: 5, z: -30}} ringColor="#7B337D"/>
                        <Planet sphereColor1="#2abe14" sphereColor2="#35682D" spherePosition={{x: -2, y: -8, z: -10}} ringColor="#0d3f05"/>
                    </> 
                }

                {pathName === '/about' &&
                    <>
                        <Planet sphereColor1="#8B0000" sphereColor2="#FF6B6B" spherePosition={{x: 12, y: 15, z: -25}} ringColor="#4a0000"/>
                        <Planet sphereColor1="#003366" sphereColor2="#0099CC" spherePosition={{x: -18, y: -5, z: -35}} ringColor="#001a33"/>
                        <Planet sphereColor1="#4B0082" sphereColor2="#9B59B6" spherePosition={{x: 5, y: -12, z: -15}} ringColor="#2d0050"/>
                    </>
                }

                {pathName === '/projects' &&
                    <>
                        <Planet sphereColor1="#FF6600" sphereColor2="#FFD700" spherePosition={{x: -15, y: 10, z: -20}} ringColor="#7a3100"/>
                        <Planet sphereColor1="#006666" sphereColor2="#00CCCC" spherePosition={{x: 18, y: -8, z: -30}} ringColor="#003333"/>
                        <Planet sphereColor1="#1a1a2e" sphereColor2="#16213e" spherePosition={{x: -5, y: -15, z: -12}} ringColor="#0f3460"/>
                    </>
                }

                {pathName === '/contact' &&
                    <>
                        <Planet sphereColor1="#2C3E50" sphereColor2="#4CA1AF" spherePosition={{x: 10, y: 18, z: -22}} ringColor="#1a252f"/>
                        <Planet sphereColor1="#6D3B47" sphereColor2="#F7A278" spherePosition={{x: -20, y: 3, z: -32}} ringColor="#3d1f28"/>
                        <Planet sphereColor1="#1B4332" sphereColor2="#40916C" spherePosition={{x: 3, y: -10, z: -18}} ringColor="#0d2318"/>
                    </>
                }
                {/**
                <Nebula
                    count={1000}
                    spread={500}
                    color={0x9333ea}
                    size={2}
                    opacity={0.3}
                    rotationSign={1}
                />
                
                <Nebula
                    count={800}
                    spread={600}
                    color={0xec4899}
                    size={2.5}
                    opacity={0.2}
                    rotationSign={-1}
                />
                */}
            </Canvas>
        </div>
    );
}