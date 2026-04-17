import AboutPage from "@/app/(tabs)/_components/AboutPage";
import { getNowPlaying, getTopTracks, Track, NowPlaying } from "@/lib/spotify";

export default async function About() {
    const [tracksData, nowPlayingData] = await Promise.all([
        getTopTracks(),
        getNowPlaying(),
    ]);

    const tracks: Track[] = (tracksData?.items ?? []).map((track: any) => ({
        id: track.id,
        title: track.name,
        artists: track.artists.map((a: any) => a.name).join(", "),
        albumImg: track.album.images?.[0]?.url ?? "",
        songUrl: track.external_urls.spotify,
    }));
    console.log(nowPlayingData)

    const nowPlaying: NowPlaying = nowPlayingData?.item
        ? {
            isPlaying: nowPlayingData.is_playing,
            title: nowPlayingData.item.name,
            artists: nowPlayingData.item.artists.map((a: any) => a.name).join(", "),
            albumImg: nowPlayingData.item.album.images?.[0]?.url ?? "",
            songUrl: nowPlayingData.item.external_urls.spotify,
          }
        : { isPlaying: false };
    
    return <AboutPage initialTracks={tracks} initialNowPlaying={nowPlaying}/>
}