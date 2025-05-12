'use client';
import { ProgressProvider } from '@bprogress/next/app';
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
        <ProgressProvider color='#f54a00' height='4px'>
            <SessionProvider>
                <SessionLoaderWrapper>
                    {children}
                </SessionLoaderWrapper>
            </SessionProvider>
        </ProgressProvider>
    );
}
