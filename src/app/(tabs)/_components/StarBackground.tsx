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
                {pathName === '/home' && <Planet color1="#210535" color2="#C874B2"/>}
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