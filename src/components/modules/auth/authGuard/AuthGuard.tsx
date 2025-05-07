"use client";

import Loader from "@/components/shared/Loader";
import { TRole } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/modules/common/Header";
import { SidebarProvider } from "@/context/sidebar-context";
import { SideBar } from "../../common/SideBar";


export default function AuthGuard({ role, children }: { role: TRole, children: React.ReactNode }) {
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && data?.user?.role !== role) {
            router.push("/user/dashboard");
        }
    }, [status, data, role, router]);

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