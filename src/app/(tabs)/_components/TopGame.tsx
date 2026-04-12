type Game = {
    id: number,
    title: string,
    coverUrl: string,
    company: string,
}

export default function TopGames() {
    const games: Game[] = [
        { id: 1, title: "Horizon Forbidden West", coverUrl: "horizon.png", company: "Guerrilla Games" },
        { id: 2, title: "Teamfight Tactics", coverUrl: "TFT.png", company: "Riot Games" }, 
        { id: 3, title: "Terraria", coverUrl: "terraria_cover.jpeg", company: "Re-Logic" },
        { id: 4, title: "League of Legends", coverUrl: "League.png", company: "Riot Games" },
        { id: 5, title: "Ark: Survival Ascended", coverUrl: "Ark.jpg", company: "Studio Wildcard" },
    ]

    return(
        <div className="relative flex justify-center items-center" style={{ height: `calc(80vh + ${(games.length - 1) * 40}px)`, width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {games.map((game, index) => (
                <div key={game.id} 
                    className="absolute h-[80vh] flex flex-col justify-end items-center gap-4 p-5 text-white bg-cover bg-center rounded-2xl drop-shadow-xl drop-shadow-black/80 transition-transform duration-300 ease-in-out hover:translate-x-3"
                    style={{
                        backgroundImage: `url(${game.coverUrl})`,
                        left: `clamp(0px, ${index * 3}vw, ${index * 20}px)`,
                        width: `calc(90% - clamp(0px, ${(games.length - 1 - index) * 3}vw, ${(games.length - 1 - index) * 20}px))`,
                        zIndex: games.length - index,
                    }}
                >
                    <div className="relative w-5/6 rounded-xl bg-primary/80 border border-white/70 backdrop-blur-xs">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[60%] bg-tertiary/90 py-2 px-5 drop-shadow-md drop-shadow-primary rounded-xl text-center">
                            <span className="text-[clamp(0.5rem,3vw,1.5rem)] font-bold">Favorite Games</span>
                        </div>

                        <div className="relative z-10 flex flex-col justify-center items-center gap-2 px-5 pb-3 pt-8 md:pt-10 text-center rounded-xl">
                            <span className="text-[1.5rem] md:text-[2rem] font-bold">{game.title}</span>
                            <span className="text-[1rem] md:text-[1.5rem] text-white/80">Made by {game.company}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}