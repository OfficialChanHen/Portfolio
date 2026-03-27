import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Mono} from "next/font/google";
import { headers } from "next/headers";
import { MobileProvider } from "@/app/_providers/MobileProvider";
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


export const metadata: Metadata = {
  title: "Portfolio Page",
  description: "Chan Hen's Portfolio Page",
};

async function isServerMobile() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);

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
      className={`${geistSans.variable} ${geistMono.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MobileProvider initialIsMobile={isMobile}>
          {children}
        </MobileProvider>
      </body>
    </html>
  );
}
