import StarBackground from "@/app/(tabs)/_components/StarBackground";
import Introduction from "@/app/(tabs)/_components/Introduction";

export default function Home() {
    return(
        <div className="relative w-full h-full flex flex-col justify-start md:justify-center items-center p-10">
            <StarBackground/>
            <Introduction/>
        </div>
    );
}