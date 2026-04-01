'use client';

import { useMobile } from "@/app/_providers/MobileProvider";

type FooterProps = {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    const isMobile = useMobile();

    return(
        <div className={`${className} footer border-t-2 px-10 py-5  flex flex-row justify-center items-center`}>
            <div className="w-full max-w-[1080px]">
                <div className="inline-flex flex-col justify-center items-center gap-2 text-[0.70rem] md:text-[0.80rem]">
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