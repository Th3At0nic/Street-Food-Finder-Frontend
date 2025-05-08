"use client";

import { LogOut, Sparkles, } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { signOutUser } from "@/lib/auth/signOutUser";
import Logo from "./Logo";
import { UserRole } from "@/types";

export default function Navbar() {
  const { data, status } = useSession();

  const canUserSeePremiumButton = data?.user.role !== UserRole.ADMIN && data?.user.role !== UserRole.PREMIUM_USER;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-orange-600 font-bold text-xl"
        >
          <Logo className="w-8 h-8" />
          StreetBites
        </Link>
        <div className="flex items-center gap-4">
          {canUserSeePremiumButton && (
            <Button
              variant="ghost"
              className="text-orange-600 hover:bg-orange-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
          )}
          {
            status === 'authenticated' ? (
              <div className="flex justify-center items-center">
                <Link href={`/dashboard`}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={() => signOutUser()} variant="outline"><LogOut className="h-4 w-4" /></Button>
              </div>
            ) :
              <Link href={'/login'}>
                <Button variant="outline">Sign In</Button>
              </Link>
          }

        </div>
      </div>
    </nav>
  );
}
