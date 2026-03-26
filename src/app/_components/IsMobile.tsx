import { headers } from 'next/headers';
import { userAgent } from 'next/server';

export default async function IsMobile() {
    const headersList = await headers();
    const { device } = userAgent({ headers: headersList });
  
    return device.type === 'mobile'; 
}

