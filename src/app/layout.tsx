import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Mono} from "next/font/google";
import { headers } from "next/headers";
import { MobileProvider } from "@/providers/MobileProvider";
import { NavigationModeProvider } from "@/providers/NavigationModeProvider";
import { Analytics } from "@vercel/analytics/next";
import SeoSummary from "@/app/_components/SeoSummary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"]
});


const siteDescription =
  "Chan Hen is a software engineer crafting digital experiences across the web — building responsive, performant apps with React, Next.js, and TypeScript. Explore projects, tech stack, and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL("https://chanhen.space"),
  title: {
    default: "Chan Hen — Software Engineer",
    template: "%s | Chan Hen",
  },
  description: siteDescription,
  keywords: [
    "Chan Hen",
    "Software Engineer",
    "Full-Stack Developer",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
  ],
  authors: [{ name: "Chan Hen" }],
  creator: "Chan Hen",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://chanhen.space",
    siteName: "Chan Hen — Portfolio",
    title: "Chan Hen — Software Engineer",
    description: siteDescription,
    images: [{ url: "/headshot.jpg", alt: "Chan Hen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chan Hen — Software Engineer",
    description: siteDescription,
    images: ["/headshot.jpg"],
  },
};

async function isServerMobile() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const viewportWidth = headersList.get("sec-ch-viewport-width") || headersList.get("viewport-width");
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);

  if (viewportWidth) {
    const width = parseInt(viewportWidth);
    return isMobile && width < 768;
  }

  return isMobile;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isMobile = await isServerMobile();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${dmMono.variable} h-full antialiased`}
    >
      {/* Light/dark theme toggle is temporarily disabled (kept for later). When
          re-enabling, restore this no-FOUC script and the <ThemeToggle /> in Header.
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
      </head>
      */}
      <body>
        <SeoSummary />
        <NavigationModeProvider>
          <MobileProvider initialIsMobile={isMobile}>
            {children}
          </MobileProvider>
        </NavigationModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
