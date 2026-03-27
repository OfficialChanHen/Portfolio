'use client';

import { useState } from 'react';
import Welcome from '@/app/_components/Welcome';
import Warp from '@/app/_components/Warp';

type WelcomeIntroProps = {
}

export default function WelcomeIntro() {
    const [toWarp, setToWarp] = useState<boolean>(false);

    return (
        <>
            { toWarp === false ?
                <div className="h-screen w-screen bg-background flex flex-col justify-center items-center font-mono italics overflow-hidden">
                    <Welcome setToWarp={setToWarp}/>
                </div>
                :
                <div className='h-screen w-screen bg-background'>
                    <Warp/>
                </div>
            }
        </>
    );
}