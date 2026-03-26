'use client';

import { useState } from 'react';
import Welcome from '@/app/_components/Welcome';
import Warp from '@/app/_components/Warp';

type WelcomeintroProps = {
    setToMain: React.Dispatch<React.SetStateAction<boolean>>
};

export default function WelcomeIntro({ setToMain }: WelcomeintroProps) {
    const [toWarp, setToWarp] = useState<boolean>(false);

    return (
        <>
            { toWarp === false ?
                <div className="h-screen w-screen bg-background flex flex-col justify-center items-center font-mono italics overflow-hidden">
                    <Welcome setToWarp={setToWarp}/>
                </div>
                :
                <div className='h-screen w-screen bg-background'>
                    <Warp setToMain={setToMain}/>
                </div>
            }
        </>
    );
}