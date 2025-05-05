'use client';
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Shield,
    Users,
    List,
    AlertCircle,
    Settings,
    FileText,
    Lock,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useSidebar } from "@/context/sidebar-context";

export function AdminSidebar() {
    const { isOpen, toggleSidebar } = useSidebar();
    const navItems = [
        {
            title: "Moderation",
            href: "/admin/moderation",
            icon: <Shield className="h-4 w-4" />,
            count: 5 // Pending items
        },
        {
            title: "User Management",
            href: "/admin/users",
            icon: <Users className="h-4 w-4" />
        },
        {
            title: "Content Audit",
            href: "/admin/audit",
            icon: <FileText className="h-4 w-4" />
        },
        {
            title: "Reports",
            href: "/admin/reports",
            icon: <AlertCircle className="h-4 w-4" />,
            count: 3
        },
        {
            title: "Permissions",
            href: "/admin/permissions",
            icon: <Lock className="h-4 w-4" />
        },
        {
            title: "Admin Settings",
            href: "/admin/settings",
            icon: <Settings className="h-4 w-4" />
        }
    ];

    return (
        <>


            <nav className={cn(
                "fixed md:relative md:translate-x-0 z-50 w-64 h-screen bg-white border-r transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-4 h-full overflow-y-auto">
                    {/* Logo */}
                    <div className="mb-8 px-3 hidden md:block">
                        <Image
                            src="/admin-logo.svg"
                            width={160}
                            height={40}
                            alt="Admin Logo"
                            className="h-10 w-auto"
                        />
                    </div>

                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-md px-3 py-2",
                                    "text-sm font-medium hover:bg-gray-100 transition-colors",
                                    "text-gray-600 hover:text-gray-900"
                                )}
                                onClick={toggleSidebar}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {item.count && (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}