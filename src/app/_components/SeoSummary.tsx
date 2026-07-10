// Server-rendered, visually-hidden summary of the site's real content.
//
// The visible site is a client-side "cosmic" experience whose content is gated
// behind JS/animation state, so crawlers, ATS/AI screeners, and link-preview bots
// that don't execute JS otherwise see an near-empty page. This block ships real,
// truthful HTML in the initial server response (mirroring the live pages) so the
// portfolio is legible to those tools. It is `sr-only`, so it stays out of the
// visual design while remaining in the DOM and accessibility tree.

export default function SeoSummary() {
    return (
        <div className="sr-only">
            <h1>Chan Hen — Software Engineer</h1>
            <p>
                I&apos;m Chan Hen, a software engineer crafting digital experiences across
                the web. I build responsive, performant web applications with React,
                Next.js, and TypeScript, backed by Python, Java, C, and SQL.
            </p>

            <h2>Skills</h2>
            <ul>
                <li>Frontend: TypeScript, React, Tailwind CSS, Next.js, React Native</li>
                <li>Backend: Python, Java, C, SQL, RESTful APIs</li>
                <li>Tools: Figma, Git, GitHub, Docker, Expo Go</li>
            </ul>

            <h2>Projects</h2>
            <ul>
                <li>
                    Aline — a modern take on when2meet for planning group events end to end:
                    shared availability, map-based location voting, multi-stop itineraries,
                    real-time chat, and attendance tracking (in active development).
                </li>
                <li>Legacy Portfolio — my first personal portfolio site, built with React and Next.js.</li>
                <li>Intraday Momentum Backtester — a Python momentum backtesting tool with interactive charts.</li>
                <li>TANKS! — a local multiplayer arena battle game built in Unity and C#.</li>
                <li>Sketchpad — a browser drawing canvas built with JavaScript.</li>
            </ul>

            <h2>Explore</h2>
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/projects">Projects</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>

            <h2>Connect</h2>
            <ul>
                <li><a href="https://github.com/OfficialChanHen">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/chan-hen-13727b233/">LinkedIn</a></li>
            </ul>
        </div>
    );
}
