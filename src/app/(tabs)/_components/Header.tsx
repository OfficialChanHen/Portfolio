'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, CodeXml } from 'lucide-react';
import Link from 'next/link';
// Theme toggle temporarily disabled (kept for later). See ThemeToggle.tsx.
// import ThemeToggle from '@/app/(tabs)/_components/ThemeToggle';

type HeaderProps = {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { path: "/home", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/projects", label: "Projects" },
        { path: "/contact", label: "Contact" },
    ];

    function isActive(path: string) {
        return pathname.startsWith(path);
    };

    const tabStyles = `
                        relative h-full flex flex-col justify-center items-center px-1 text-white/65 hover:text-white hover:cursor-pointer
                        transition-colors duration-300
                        after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2
                        after:h-px after:w-0 after:bg-gradient-to-r after:from-transparent after:via-highlight after:to-transparent
                        after:transition-all after:duration-500 after:ease-out
                        hover:after:w-full
                    `;
    const selectedStyle = "text-white! after:w-full! [text-shadow:0_0_18px_color-mix(in_oklab,var(--highlight)_70%,transparent)]";

    return(
        <div className={`${className} header fixed top-0 min-h-16 flex flex-col justify-center items-center border-b`}>
            <div className="max-w-[1160px] w-full h-16 flex flex-row justify-between items-stretch px-6 md:px-10">
                <Link href="/home" className='group flex flex-row justify-center items-center gap-3'>
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-highlight/30 to-tertiary/20 border border-highlight/30 shadow-[0_0_20px_-6px] shadow-highlight/60 transition-shadow duration-300 group-hover:shadow-highlight">
                        <CodeXml className='w-4 h-4 text-highlight'/>
                    </span>
                    <span className="text-[1.15rem] md:text-[1.35rem] tracking-tight">Chan Hen</span>
                </Link>

                {/* right-side controls */}
                <div className="flex flex-row items-center gap-4">
                    {/* desktop tabs */}
                    <nav className="hidden md:flex h-full flex-row justify-center items-stretch gap-7">
                        {navLinks.map(({ path, label }) => (
                            <Link
                                key={path}
                                className={`${tabStyles} ${isActive(path) ? selectedStyle : ""}`}
                                href={`${path}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* theme toggle (top right) — temporarily disabled, kept for later */}
                    {/* <ThemeToggle /> */}

                    {/* mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        className="md:hidden p-2 -mr-2 rounded-lg text-white/80 hover:text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* mobile dropdown */}
            <div className={`w-full md:hidden border-t border-white/[0.07] transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="px-6 py-4 space-y-1">
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:cursor-pointer ${
                                isActive(path)
                                    ? "bg-highlight/10 border border-highlight/25 text-white"
                                    : "border border-transparent text-white/70 hover:text-white hover:bg-white/[0.04]"
                            }`}
                            href={`${path}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {label}
                            {isActive(path) && <span className="w-1.5 h-1.5 rounded-full bg-highlight shadow-[0_0_10px] shadow-highlight" />}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
