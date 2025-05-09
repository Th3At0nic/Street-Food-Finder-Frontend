"use client";

import { GrPlan } from "react-icons/gr";
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
    BadgeDollarSign,
    DollarSign,
    User,
} from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { TRole } from "@/types";
import { BiCategory } from "react-icons/bi";

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <List className="h-4 w-4" />,
        count: 5 // Pending items
    },
    {
        title: "Moderation",
        href: "/admin/dashboard/moderation",
        icon: <Shield className="h-4 w-4" />,
        count: 5 // Pending items
    },
    {
        title: "User Management",
        href: "/admin/dashboard/users",
        icon: <Users className="h-4 w-4" />
    },
    {
        title: "Post-category Management",
        href: "/admin/dashboard/post-categories",
        icon: <BiCategory className="h-4 w-4" />
    },
    {
        title: "Subscription Management",
        href: "/admin/dashboard/subscription-plans",
        icon: <GrPlan className="h-4 w-4" />
    },
    {
        title: "Make Premium ",
        href: "/admin/dashboard/make-premium",
        icon: < DollarSign className="h-4 w-4"></DollarSign>
    },
    {
        title: "Comment Management",
        href: "/admin/dashboard/reported-comment",
        icon: <User className="h-4 w-4"></User>,
    },
    {
        title: "Content Audit",
        href: "/admin/dashboard/audit",
        icon: <FileText className="h-4 w-4" />
    },
    {
        title: "Reports",
        href: "/admin/dashboard/analytics",
        icon: <AlertCircle className="h-4 w-4" />,
        count: 3
    },
    {
        title: "Permissions",
        href: "/admin/dashboard/permissions",
        icon: <Lock className="h-4 w-4" />
    },
    {
        title: "Admin Settings",
        href: "/admin/dashboard/settings",
        icon: <Settings className="h-4 w-4" />
    }
];

const userNavItems = [
    {
        title: "Dashboard",
        href: "/user/dashboard",
        icon: <List className="h-4 w-4" />,

        count: 5 // Pending items
    },
    {
        title: "Payment History",
        href: "/user/dashboard/payment-history",
        icon: <BadgeDollarSign className="h-4 w-4" />
    },
    {
        title: "Profile Settings",
        href: "/user/dashboard/settings",
        icon: <Settings className="h-4 w-4" />
    }
]

export function SideBar({ role }: { role: TRole }) {
    const { isOpen, toggleSidebar } = useSidebar();

    return (
        <>
            <nav
                className={cn(
                    "fixed md:relative md:translate-x-0 z-50 w-64 h-screen border-r transform transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-4 h-full overflow-y-auto">
                    <div className="space-y-1">
                        {(role === "ADMIN" ? adminNavItems : userNavItems).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-md px-3 py-2",
                                    "text-sm font-medium hover:bg-gray-100 transition-colors",
                                    "text-gray-600 hover:"
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
