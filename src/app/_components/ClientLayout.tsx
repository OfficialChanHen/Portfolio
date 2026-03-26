'use client';

import React, { useState, useEffect } from 'react';
import Welcome from '@/app/_components/Welcome';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMain, setIsMain] = useState(true);

    return isMain ? <main>{children}</main>: <Welcome setIsMain={setIsMain}/>;
}