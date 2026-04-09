"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type NavigationMode = "hard" | "soft";

const NavigationModeContext = createContext<NavigationMode>("hard");

export function NavigationModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const initialRender = useRef(true);
    const [mode, setMode] = useState<NavigationMode>("hard");

    useEffect(() => {
        if (initialRender.current) {
            setMode("hard");
            initialRender.current = false;
        } else {
            setMode("soft");
        }
    }, [pathname]);

    return (
        <NavigationModeContext.Provider value={mode}>
            {children}
        </NavigationModeContext.Provider>
    );
}

export function useNavigationMode() {
    return useContext(NavigationModeContext);
}