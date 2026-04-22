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

    const { viewport } = useThree();
    const scaleX = viewport.width / 10;
    const scaleY = viewport.height / 15;
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
            color1: { value: new THREE.Color(sphereColor1) },
            color2: { value: new THREE.Color(sphereColor2) },
            lightDir: { value: new THREE.Vector3(1.5, 1.0, 2.0).normalize() },
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldNormal;

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 lightDir;

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldNormal;

            // Hash function for noise
            float hash(vec3 p) {
                p = fract(p * vec3(443.897, 441.423, 437.195));
                p += dot(p, p.yzx + 19.19);
                return fract((p.x + p.y) * p.z);
            }

            // Smooth noise
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                vec3 u = f * f * (3.0 - 2.0 * f);

                return mix(
                    mix(mix(hash(i),              hash(i + vec3(1,0,0)), u.x),
                        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), u.x), u.y),
                    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), u.x),
                        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), u.x), u.y),
                    u.z
                );
            }

            // Fractal Brownian Motion — layered noise for surface detail
            float fbm(vec3 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;
                for (int i = 0; i < 6; i++) {
                    value += amplitude * noise(p * frequency);
                    amplitude *= 0.5;
                    frequency *= 2.0;
                }
                return value;
            }

            void main() {
                // Animated surface with fbm noise (slow rotation via time)
                vec3 animPos = vPosition + vec3(time * 0.04, 0.0, 0.0);
                float surface = fbm(animPos * 2.5);

                // Band-like stripes (like Jupiter/Saturn)
                float bands = sin(vPosition.y * 6.0 + fbm(animPos * 1.5) * 3.0) * 0.5 + 0.5;

                // Mix surface noise + bands
                float pattern = mix(surface, bands, 0.5);

                // Base color from pattern
                vec3 baseColor = mix(color1, color2, pattern);

                // Diffuse lighting
                float diff = max(dot(vWorldNormal, lightDir), 0.0);
                // Soft ambient so dark side isn't pure black
                float ambient = 0.15;
                float lighting = ambient + diff * 0.85;

                // Specular highlight (Blinn-Phong)
                vec3 viewDir = vec3(0.0, 0.0, 1.0);
                vec3 halfDir = normalize(lightDir + viewDir);
                float spec = pow(max(dot(vWorldNormal, halfDir), 0.0), 32.0) * 0.4;

                // Atmospheric rim glow
                float rimDot = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
                float rim = pow(rimDot, 3.0) * 0.6;
                vec3 rimColor = mix(color2, vec3(1.0), 0.5);

                vec3 finalColor = baseColor * lighting + spec + rimColor * rim;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
        transparent: false,
    }), [sphereColor1, sphereColor2]);

    const planetRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!planetRef.current || !ringRef.current) return;
        material.uniforms.time.value += 0.01;
        planetRef.current.rotation.y += 0.003;
        ringRef.current.rotation.z += 0.002;
    });

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />
            <mesh material={material} ref={planetRef} position={[spherePosition.x, spherePosition.y, spherePosition.z]}>
                <sphereGeometry args={[1, 64, 64]} />
            </mesh>
            <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]} position={[ringPosition.x, ringPosition.y, ringPosition.z]}>
                <torusGeometry args={[1.5, 0.04, 16, 100]} />
                <meshStandardMaterial color={ringColor} opacity={0.7} transparent={true} />
            </mesh>
        </>
    );
}