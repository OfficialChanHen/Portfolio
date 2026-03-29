'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    type pageNavs = "home"|"about"|"projects"|"contact";
    const [currPage, setCurrentPage] = useState<pageNavs>("home");
    const pagesLabel = ["Home", "About", "Projects", "Contact"];
    const router = useRouter();

    function handleOnClick(page: string) {
        page = page.toLowerCase();
        setCurrentPage(page as pageNavs);
        router.push(`/${page}`);
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
        <div className={`header sticky top-0 z-10 flex flex-row justify-between items-center border-b-2 ${className}`}>
            <span className="p-5">Chan Hen</span>
            <div className="h-full flex flex-row justify-center items-center px-5 gap-4">
                {pagesLabel.map((page) => {
                    return(
                        <div key={page} className={`${tabStyles} ${page.toLowerCase() === currPage as string && selectedStyle}`} onClick={() => handleOnClick(page)}>{page}</div>
                    )
                })}
            </div>
        </div>
    )
}