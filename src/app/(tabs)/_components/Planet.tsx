'use client'

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

type SphereProps = {
    sphereColor1: string;
    sphereColor2: string;
    spherePosition?: {x: number, y: number, z: number};
    ringColor: string;
    ringPosition?: {x: number, y: number, z: number};
}

export default function Planet({ 
    sphereColor1, 
    sphereColor2,
    spherePosition = {x: 0, y: 0, z: 0},
    ringColor,
    ringPosition = spherePosition,
}: SphereProps) {
    const colorVec1 = new THREE.Color(sphereColor1);
    const colorVec2 = new THREE.Color(sphereColor2);

    const { viewport, size } = useThree();
    const scaleX = viewport.width / 10;
    const scaleY = viewport.height / 15
    const scaleZ = viewport.distance / 5;
    spherePosition = {
        x: spherePosition.x * scaleX,
        y: spherePosition.y * scaleY,
        z: spherePosition.z * scaleZ
    }

    ringPosition = {
        x: ringPosition.x * scaleX,
        y: ringPosition.y * scaleY,
        z: ringPosition.z * scaleZ
    }

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
        time: { value: 0 },
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // Animated colors 
            vec3 color1 = vec3(${colorVec1.r}, ${colorVec1.g}, ${colorVec1.b}); 
            vec3 color2 = vec3(${colorVec2.r}, ${colorVec2.g}, ${colorVec2.b}); 
            
            // Mix colors based on position and time
            float mixFactor = sin(vPosition.y * 2.0 + time * 0.5) * 0.5 + 0.5;
            vec3 mixedColor = mix(color1, color2, mixFactor);
            
            // Add glow effect
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glow = mixedColor * intensity;
            
            gl_FragColor = vec4(mixedColor + glow * 0.5, 0.3);
        }
    `,
    transparent: false,
    }), []);

    const planetRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    
    
    useFrame(() => {
        if (!planetRef.current || !ringRef.current) return;
        
        material.uniforms.time.value += 0.01;

        planetRef.current.rotation.y += 0.005;
        planetRef.current.rotation.x += 0.002;

        ringRef.current.rotation.z += 0.003;
    }); 

    return (
        <>
            <ambientLight intensity={1} />
            <mesh material={material} ref={planetRef} position={[spherePosition.x, spherePosition.y, spherePosition.z]}>
                <sphereGeometry args={[1, 64, 64]}/>
            </mesh>

            <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]} position={[ringPosition.x, ringPosition.y, ringPosition.z]}>
                <torusGeometry args={[1.5, 0.03, 16, 100]}/>
                <meshStandardMaterial color={ringColor} opacity={0.6} transparent={true}/>
            </mesh>
        </>
    )
}