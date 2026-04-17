export default function BackToTopButton() {
    return (
        <>
            <style>{`
                .back-to-top-btn::before {
                    content: "";
                    position: absolute;
                    height: 2px;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    transform: scaleX(0);
                    transform-origin: bottom right;
                    background: currentColor;
                    transition: transform 0.25s ease-out;
                }
                .back-to-top-btn:hover::before {
                    transform: scaleX(1);
                    transform-origin: bottom left;
                }
                .back-to-top-btn:hover .clone > *:nth-child(1) { transition-delay: 0.15s; }
                .back-to-top-btn:hover .clone > *:nth-child(2) { transition-delay: 0.20s; }
                .back-to-top-btn:hover .clone > *:nth-child(3) { transition-delay: 0.25s; }
            `}</style>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="back-to-top-btn relative w-[140px] h-[56px] overflow-hidden border-none bg-transparent text-white pb-9 cursor-pointer group"
            >
                {/* Original text — slides up on hover */}
                <div className="text absolute w-full h-full flex items-center">
                    {["Back", "to", "top"].map((word) => (
                        <span
                            key={word}
                            className="ml-1 opacity-100 transition-all duration-200 group-hover:-translate-y-[60px] [cubic-bezier(0.215,0.61,0.355,1)]"
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Clone text — slides in from below on hover */}
                <div className="clone absolute w-full h-full flex items-center">
                    {["Back", "to", "top"].map((word) => (
                        <span
                            key={word}
                            className="ml-1 opacity-100 translate-y-[60px] transition-all duration-200 group-hover:translate-y-0 [cubic-bezier(0.215,0.61,0.355,1)]"
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Arrow icon — rotates on hover */}
                <svg
                    strokeWidth={2}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-1/2 right-0 -translate-x-1/2 w-[20px] h-[20px] -rotate-[50deg] transition-transform duration-200 ease-out group-hover:-rotate-90"
                >
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
            </button>
        </>
    );
}