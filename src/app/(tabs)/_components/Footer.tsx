'use client';

import { useMobile } from "@/app/_providers/MobileProvider";

type FooterProps = {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    const isMobile = useMobile();

    return(
        <div className={`footer border-t-2 p-5 ${className}`}>
            <div className="flex justify-center">
                <div className="inline-flex flex-col justify-center items-center gap-2 text-[0.65rem] md:text-[0.75rem]">
                    <span className="w-full text-left">
                        {`"Looking at the stars always makes me dream,`}
                        {isMobile && <br/>}
                        {` as simply as I dream over the black dots`}
                        {isMobile && <br/>}
                        {` representing villages and towns on a map."`}
                    </span>
                    <span className="w-full text-right">— Vincent Van Gogh</span>
                </div>
            </div>
        </div>
    )
}