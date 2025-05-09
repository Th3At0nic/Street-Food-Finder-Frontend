"use client";

import { LogOut, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { signOutUser } from "@/lib/auth/signOutUser";
import Logo from "./Logo";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function Navbar() {
  const { data, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const canUserSeePremiumButton = data?.user.role !== UserRole.ADMIN && data?.user.role !== UserRole.PREMIUM_USER;

  return (
    <nav className="shadow-sm bg-white dark:bg-accent sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
          <Logo className="w-8 h-8" />
          StreetBites
        </Link>

        {/* Right: Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {canUserSeePremiumButton && (
            <Button
              onClick={() => router.push('/subscription-plan')}
              variant="ghost"
              className="text-orange-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
          )}
          <ThemeToggle />
          {status === 'authenticated' ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button onClick={() => signOutUser()} variant="outline">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {canUserSeePremiumButton && (
            <Button
              onClick={() => {
                router.push('/subscription-plan');
                setMenuOpen(false);
              }}
              variant="ghost"
              className="w-full text-orange-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
          )}
          <ThemeToggle />
          {status === 'authenticated' ? (
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
              <Button onClick={() => { signOutUser(); setMenuOpen(false); }} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
