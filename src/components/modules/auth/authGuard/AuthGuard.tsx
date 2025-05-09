"use client";

import Loader from "@/components/shared/Loader";
import { TRole, UserRole } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/modules/common/Header";
import { SidebarProvider } from "@/context/sidebar-context";
import { SideBar } from "../../common/SideBar";
import { usePathname } from "next/navigation";

export default function AuthGuard({ role, children }: { role: TRole, children: React.ReactNode }) {
    const { data, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const allowedPathsMap: Record<string, string[]> = {
        ADMIN: ["/admin"],
        USER: ["/user/dashboard", "/subscription/verify"],
        PREMIUM_USER: ["/user/dashboard", "/subscription/verify"],
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            const currentPath = pathname || "/";
            const roleKey = role as TRole;
            const allowedPaths = allowedPathsMap[roleKey!] || [];

            // Check if current path starts with any allowed path
            const isAllowed = allowedPaths.some((allowedPath) =>
                currentPath.startsWith(allowedPath)
            );

            if (!isAllowed) {
                // Default redirect based on role
                const defaultPath =
                    role === UserRole.PREMIUM_USER
                        ? "/user/dashboard"
                        : `/${role?.toLowerCase()}/dashboard`;

                router.push(defaultPath);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, data, role, router, pathname,]);

    if (status === "loading") {
        return <Loader />
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
                <Header role={data!.user!.role!} />
                <div className="flex flex-col md:flex-row">
                    <SideBar role={data!.user!.role!} />
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}