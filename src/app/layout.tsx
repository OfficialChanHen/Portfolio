import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Mono} from "next/font/google";
import "./globals.css";
import ClientLayout from "@/app/_components/ClientLayout";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{<ClientLayout>{children}</ClientLayout>}</body>
    </html>
  );
}
