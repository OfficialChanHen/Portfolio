'use client'

import { useFrame } from "@react-three/fiber";
import { cp } from "fs";
import { useRef, useMemo } from "react";
import * as THREE from "three";

type SphereProps = {
    color1: string;
    color2: string;
}

export default function Planet({ color1, color2 }: SphereProps) {
    const colorVec1 = new THREE.Color(color1);
    const colorVec2 = new THREE.Color(color2);

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
            <mesh material={material} ref={planetRef}>
                <sphereGeometry args={[1, 64, 64]}/>
            </mesh>

            <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
                <torusGeometry args={[1.7, 0.03, 16, 100]}/>
                <meshStandardMaterial color={"#7B337D"} opacity={0.6} transparent={true}/>
            </mesh>
        </>
    )
}