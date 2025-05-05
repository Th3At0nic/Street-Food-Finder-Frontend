'use client';

import Loader from '@/components/shared/Loader';
import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode } from 'react';

function SessionLoaderWrapper({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (status === "loading") {
        return <Loader />;
    }

    return <>{children}</>;
}


export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <SessionLoaderWrapper>
                {children}
            </SessionLoaderWrapper>
        </SessionProvider>
    );
}
