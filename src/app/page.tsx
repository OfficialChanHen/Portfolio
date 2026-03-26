import WelcomeIntro from "@/app/_components/WelcomeIntro";
import { headers } from "next/headers";

export default async function WelcomePage() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);

    return (
        <WelcomeIntro isMobile={isMobile}/>
    )
}