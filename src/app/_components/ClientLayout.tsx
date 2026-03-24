'use client';

import React, { useState, useEffect } from 'react';
import Welcome from '@/app/_components/Welcome';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

    }, []);

    return isLoading ? <Welcome/> : <main>{children}</main>;
}