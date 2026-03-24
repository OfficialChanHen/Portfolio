'use client';

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

type SpinningCircleProps = {
    className?: string;
    duration?: number;
    color?: string;
    strokeWidth?: number;
    initialRotation?: number;
}

export default function SpinningCircle({
    className = "", 
    duration = 8, 
    color = "white",
    strokeWidth = 2,
    initialRotation = 0,
}: SpinningCircleProps) {
    const circleRef = useRef<SVGSVGElement>(null);
    const size = 100;
    const center = size / 2;
    const radius = size / 2 - strokeWidth;

    const circumference = 2 * Math.PI * radius;
    const dashLength = circumference / 4 * 0.75;
    const gapLength = circumference / 4 * 0.25;

    useGSAP(() => {
        gsap.to(circleRef.current, {
            rotation: 360 + initialRotation,
            duration,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
        });
    }, { scope: circleRef });

    return (
        <svg
            className={className}
            ref={circleRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            overflow="visible"
        >
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${gapLength}`}
            />
        </svg>
    );
}