import ClientTabsLayout from "@/app/(tabs)/_components/ClientLayout";

export default function TabsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <ClientTabsLayout>{children}</ClientTabsLayout>
    );
}