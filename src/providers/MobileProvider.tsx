"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const MobileContext = createContext<boolean | undefined>(undefined);

type MobileProdiverProps = {
    children: React.ReactNode;
    initialIsMobile: boolean;
}

export function MobileProvider({
    children,
    initialIsMobile,
}: MobileProdiverProps) {
    const [isMobile, setIsMobile] = useState(initialIsMobile);

    return (
        <MobileContext.Provider value={isMobile}>
            {children}
        </MobileContext.Provider>
    );

}

export const useMobile = () => {
    const value = useContext(MobileContext);

    if (value === undefined) {
        throw Error("useMobile must be used inside MobileProvider");
    }

    return value
}