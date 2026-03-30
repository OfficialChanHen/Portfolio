'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    type pageNavs = "home"|"about"|"projects"|"contact";
    const [currPage, setCurrentPage] = useState<pageNavs>("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
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

    function handleOnClick(path: string, label: string) {
        setCurrentPage(label.toLowerCase() as pageNavs);
        setMobileMenuOpen(false);
        router.push(path);
    }

    const tabStyles = `
                        h-full flex flex-col justify-center items-center border-b-2 border-transparent hover:cursor-pointer hover:text-highlight
                        relative after:absolute after:bottom-[-1px] after:left-0
                        after:h-[2px] after:w-0 after:bg-highlight
                        after:transition-all after:duration-400 after:ease-out
                        hover:after:w-full
                    `;
    const selectedStyle = "text-highlight after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:bg-highlight";
        
    return(
        <div className={`header sticky top-0 z-10 border-b-2 ${className}`}>
            <div className="flex flex-row justify-between items-center">
                <span className="p-5">Chan Hen</span>

                {/* desktop tabs */}
                <div className="hidden md:flex h-full flex-row justify-center items-center px-5 gap-4">
                    {navLinks.map(({ path, label }) => (
                        <div
                            key={path}
                            className={`${tabStyles} ${isActive(path) && selectedStyle}`}
                            onClick={() => handleOnClick(path, label)}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-white p-5"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* mobile dropdown */}
            <div className={`md:hidden bg-background/30 border-t border-white/10 backdrop-blur-sm transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 py-4 space-y-3">
                    {navLinks.map(({ path, label }) => (
                        <div
                            key={path}
                            onClick={() => handleOnClick(path, label)}
                            className={`block px-4 py-2 rounded-lg transition-colors hover:cursor-pointer ${
                                isActive(path)
                                    ? "bg-highlight/20 text-highlight"
                                    : "text-white"
                            }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}