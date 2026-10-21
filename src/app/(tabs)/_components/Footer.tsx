'use client';

import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import Link from "next/link";

type FooterProps = {
    className?: string;
}

const socials = [
    { href: "https://github.com/OfficialChanHen", label: "GitHub", Icon: FiGithub, external: true },
    { href: "https://www.linkedin.com/in/chan-hen-13727b233/", label: "LinkedIn", Icon: FiLinkedin, external: true },
    { href: "/contact", label: "Contact", Icon: FiMail, external: false },
];

export default function Footer({ className }: FooterProps) {
    return(
        // Phones get one centred column (quote, author, links, credit); from md up
        // it's a quote over a row with the credit left and the links right.
        <footer className={`${className} footer border-t px-6 md:px-10 pt-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex flex-col items-center`}>
            <div className="w-full max-w-[1080px] flex flex-col gap-6">
                <figure className="flex flex-col gap-2 text-center md:text-left text-[0.8rem] md:text-[0.95rem]">
                    <blockquote className="text-white/75 leading-relaxed">
                        {`"Looking at the stars always makes me dream,`}
                        {` as simply as I dream over the black dots`}
                        {` representing villages and towns on a map."`}
                    </blockquote>
                    <figcaption className="self-center md:self-end text-highlight/90">Vincent Van Gogh</figcaption>
                </figure>

                <div className="hairline" />

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-5 md:gap-4 text-[0.7rem] md:text-[0.8rem] text-white/45">
                    <p className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center">
                        <span className="whitespace-nowrap">© {new Date().getFullYear()} Chan Hen</span>
                        <span className="hidden md:block h-3 w-px bg-white/15" aria-hidden="true" />
                        <span>Built with Next.js, GSAP and Three.js</span>
                    </p>
                    <div className="flex items-center gap-3 md:gap-2">
                        {socials.map(({ href, label, Icon, external }) => {
                            // 44px targets on touch screens, compact from md up.
                            const cls = "flex items-center justify-center w-11 h-11 md:w-9 md:h-9 rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-highlight/40 hover:bg-highlight/10 transition-all duration-300";
                            return external ? (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
                                    <Icon className="w-4 h-4" />
                                </a>
                            ) : (
                                <Link key={label} href={href} aria-label={label} className={cls}>
                                    <Icon className="w-4 h-4" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    )
}
