'use client'
import { AdminHeader } from "@/components/modules/admin/AdminHeader";
import { AdminSidebar } from "@/components/modules/admin/AdminSideBar";
import { SidebarProvider } from "@/context/sidebar-context";
import { useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
const {
    data,
    status,
} = useSession()
if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
if (status === "unauthenticated") {
    return <div className="flex items-center justify-center h-screen">You are not authenticated</div>;
  }
if (status === "authenticated" && data?.user?.role !== "ADMIN") {
    return <div className="flex items-center justify-center h-screen">You are not authorized</div>;
  }
 
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex flex-col md:flex-row">
          <AdminSidebar/>
          <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Mobile padding fix */}
            <div className="md:hidden h-8"></div>
            {children}
          </div>
        </main>
        </div>
      </div>
    </SidebarProvider>
  );
}