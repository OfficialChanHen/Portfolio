import StarBackground from "@/app/(tabs)/_components/StarBackground";
import Introduction from "@/app/(tabs)/_components/Introduction";

export default function Home() {
    return(
        <div className="relative w-full flex flex-col justify-start md:justify-center items-center p-10">
            <StarBackground/>
            <Introduction/>

            {/* Call to action */}
            <div className='w-full max-w-[1000px] px-5 py-3 bg-highlight/20 backdrop-blur-xs text-white/80 text-[0.75rem] md:text-[1rem] border border-highlight rounded-md '>
                <div className='flex flex-row justify-start items-center gap-2 text-highlight mb-2'>
                    <div className='w-[clamp(12px,2vw,16px)] h-[clamp(12px,2vw,16px)] bg-highlight rounded-full'/>
                    <span>Available for work</span>
                </div>
                <span>I'm currently available for freelance projects, part-time work, and full-time opportunities. Let's <em>launch</em> a project that's truly out of this world together!</span>
            </div>
        </div>
    );
}