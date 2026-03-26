'use client';

import React, { useState, useEffect } from 'react';
import WelcomeIntro from '@/app/_components/WelcomeIntro';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [toMain, setToMain] = useState<boolean>(false);

    return toMain === false ? <WelcomeIntro setToMain={setToMain}/> : <main>{children}</main> ;
}