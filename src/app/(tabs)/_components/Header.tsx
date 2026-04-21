'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, CodeXml } from 'lucide-react';
import Link from 'next/link';

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
                        h-full flex flex-col justify-center items-center border-b-2 border-transparent hover:cursor-pointer hover:text-highlight
                        relative after:absolute after:bottom-[-1px] after:left-0
                        after:h-[2px] after:w-0 after:bg-highlight
                        after:transition-all after:duration-400 after:ease-out
                        hover:after:w-full
                    `;
    const selectedStyle = "text-highlight after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:bg-highlight";
        
    return(
        <div className={`${className} header fixed top-0 min-h-16 flex flex-col justify-center items-center border-b-2`}>
            <div className="max-w-[1080px] w-full h-16 flex flex-row justify-between items-stretch px-10">
                <div className='flex flex-row justify-center items-center gap-2'>
                    <CodeXml className='text-highlight'/>
                    <span className="text-[1.5rem]">Chan Hen</span>
                </div>
                

                {/* desktop tabs */}
                <div className="hidden md:flex h-full flex-row justify-center items-stretch gap-4">
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            className={`${tabStyles} ${isActive(path) && selectedStyle}`}
                            href={`${path}`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white py-5"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* mobile dropdown */}
            <div className={`w-full md:hidden bg-background/30 border-t border-white/10 backdrop-blur-sm transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="px-10 py-5 space-y-3">
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            className={`block px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
                                isActive(path)
                                    ? "bg-highlight/20 text-highlight"
                                    : "text-white"
                            }`}
                            href={`${path}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}