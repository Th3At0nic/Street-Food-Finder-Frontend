'use client'

import AuthGuard from "@/components/modules/auth/authGuard/AuthGuard";
import { TRole } from "@/types";
import { useSession } from "next-auth/react";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data } = useSession();


  return (
    <AuthGuard role={data!.user.role as TRole}>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile padding fix */}
          <div className="md:hidden h-8"></div>
          {children}
        </div>
      </main>
    </AuthGuard>
  );
}