import AboutPage from "@/app/(tabs)/_components/AboutPage";
import { getNowPlaying, getTopTracks } from "@/lib/lastfm";

export default async function About() {
    const [tracks, nowPlaying] = await Promise.all([
        getTopTracks(),
        getNowPlaying(),
    ]);

    return <AboutPage initialTracks={tracks} initialNowPlaying={nowPlaying}/>
}
