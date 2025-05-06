'use client'

import AuthGuard from "@/components/modules/auth/authGuard/AuthGuard";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <AuthGuard role={'ADMIN'}>
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