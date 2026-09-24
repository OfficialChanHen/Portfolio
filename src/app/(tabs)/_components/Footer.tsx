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
        <footer className={`${className} footer border-t px-6 md:px-10 pt-8 pb-6 flex flex-col items-center`}>
            <div className="w-full max-w-[1080px] flex flex-col gap-6">
                <figure className="flex flex-col gap-2 text-[0.75rem] md:text-[0.95rem]">
                    <blockquote className="text-white/75 leading-relaxed">
                        {`"Looking at the stars always makes me dream,`}
                        {` as simply as I dream over the black dots`}
                        {` representing villages and towns on a map."`}
                    </blockquote>
                    <figcaption className="self-end text-highlight/90">Vincent Van Gogh</figcaption>
                </figure>

                <div className="hairline" />

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-[0.7rem] md:text-[0.8rem] text-white/45">
                    <span className="flex items-center gap-3">
                        <span>© {new Date().getFullYear()} Chan Hen</span>
                        <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                        <span>Built with Next.js, GSAP and Three.js</span>
                    </span>
                    <div className="flex items-center gap-2">
                        {socials.map(({ href, label, Icon, external }) => {
                            const cls = "flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-highlight/40 hover:bg-highlight/10 transition-all duration-300";
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
