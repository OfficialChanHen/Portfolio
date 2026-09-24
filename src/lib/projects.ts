// Project data for the Projects page. Lives outside the page so the site-wide
// video preloader can read which preview clips to fetch.

export type Project = {
    id: number;
    title: string;
    image: string;   // still shown when the card is not in focus
    video?: string;  // looping preview played while the card is in focus; base path, served as .webm and .mp4
    tags: string[];
    description: string;
    github?: string;
    link?: string;
};

export const projects: Project[] = [
    {
        id: 1,
        title: "Hourelle",
        image: "/hourelle.jpg",
        video: "/videos/hourelle",
        tags: ["Next.js", "TypeScript", "Supabase", "Leaflet", "GSAP", "Web App"],
        description:
        "Find the hour everyone can meet. One link covers the whole plan: people mark when they're free, vote on where to go, see who's coming, and talk it over in a group chat. Guests never need an account.",
        github: "https://github.com/OfficialChanHen/Hourelle",
        link: "https://hourelle.com",
    },
    {
        id: 2,
        title: "Legacy Portfolio",
        image: "/legacy-portfolio.png",
        video: "/videos/legacy",
        tags: ["React", "TypeScript", "TailwindCSS", "Next.js", "Web App"],
        description:
        "My first personal portfolio website, a static page built to showcase my projects and resume early in my development journey.",
        github: "https://github.com/OfficialChanHen/PersonalPage",
        link: "https://portfolio-five-blue.vercel.app/",
    },
    {
        id: 3,
        title: "Intraday Momentum Backtester",
        image: "/trading.png",
        tags: ["Python", "Data Analysis"],
        description:
        "A Python trading strategy script that runs a momentum-based backtest for any stock, and outputs an interactive HTML chart image with buy/sell signals.",
        github: "https://github.com/OfficialChanHen/StockTrader",
    },
    {
        id: 4,
        title: "TANKS!",
        image: "/Tank-Thumbnail.png",
        video: "/videos/tanks",
        tags: ["Unity", "C#", "Game Development"],
        description:
        "TANKS! is a local multiplayer arena battle game built in Unity, including a first-to-three win format, powerups, multiple tank types, and a player select screen.",
        github: "https://github.com/OfficialChanHen/TANKS",
        link: "https://play.unity.com/api/v1/games/game/94d9e7c0-b608-42aa-be14-75f5d990b8d1/build/latest/frame",
    },
    {
        id: 5,
        title: "Sketchpad",
        image: "/sketch_example.png",
        video: "/videos/sketch",
        tags: ["JavaScript", "CSS", "Web App"],
        description:
        "Draw freely on a canvas, pick any color, adjust brush size, and erase mistakes.",
        github: "https://github.com/OfficialChanHen/sketch-pad",
        link: "https://sketch-pad-one.vercel.app/",
    },
    {
        id: 6,
        title: "Next Mission",
        image: "/coming-soon.jpg",
        tags: ["In Development"],
        description:
        "Something new is on the launchpad. Mission details stay classified until liftoff, so check back soon.",
    },
];
