"use client";

import { useState, useEffect } from "react";
import { GrPlan } from "react-icons/gr";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Shield,
    Users,
    List,
    // AlertCircle,
    Settings,
    FileText,
    // Lock,
    BadgeDollarSign,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { PostStatus, type TRole } from "@/types";
import { BiCategory, BiCommentCheck } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fetchPosts } from "@/app/actions/post-actions";
import { fetchAllComments } from "@/components/services/CommentServices";
import { CommentStatus } from "@/types/comments.types";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";

type NavItem = {
    title: string;
    href?: string;
    icon: React.ReactNode;
    count?: number;
    children?: NavItem[];
};


export function SideBar({ role }: { role: TRole }) {
    const { isOpen, toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [pendingPostCount, setPendingPostCount] = useState(0);
    const [pendingCommentCount, setPendingCommentCount] = useState(0);

    useEffect(() => {
        const getPendingModeration = async () => {
            const result = await fetchPosts({
                page: 1,
                limit: 1,
                status: PostStatus.PENDING,
            });
            if (result.success) {
                setPendingPostCount(result.data.meta.total);
            }
        }
        getPendingModeration();

        const getPendingComment = async () => {
            const result = await fetchAllComments({
                page: 1,
                limit: 1,
                status: CommentStatus.PENDING,
            });
            if (result.success) {
                setPendingCommentCount(result.data.meta.total);
            }
        }
        getPendingComment();
    }, [])


    const adminNavItems: NavItem[] = [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: <List className="h-4 w-4" />,
            count: undefined
        },
        {
            title: "Subscription Plans",
            href: "/admin/dashboard/subscription-plans",
            icon: <GrPlan className="h-4 w-4" />
        },
        {
            title: "User Moderation",
            icon: <Shield className="h-4 w-4" />,
            children: [
                {
                    title: "Users",
                    href: "/admin/dashboard/users",
                    icon: <Users className="h-4 w-4" />,
                },
                {
                    title: "User Subscriptions",
                    href: "/admin/dashboard/user-subscriptions",
                    icon: <GrPlan className="h-4 w-4" />
                },
            ]
        },
        {
            title: "Post Category",
            href: "/admin/dashboard/post-categories",
            icon: <BiCategory className="h-4 w-4" />
        },
        {
            title: "Post Moderation",
            icon: <Shield className="h-4 w-4" />,
            count: (pendingCommentCount + pendingPostCount),
            children: [
                {
                    title: "Post Approval",
                    href: "/admin/dashboard/moderation",
                    icon: <FileText className="h-4 w-4" />,
                    count: pendingPostCount
                },
                {
                    title: "Manage Posts",
                    href: "/admin/dashboard/manage-posts",
                    icon: <BsFillFileEarmarkPostFill className="h-4 w-4" />
                },
                {
                    title: "Comment Mod.",
                    href: "/admin/dashboard/comment-moderation",
                    icon: <BiCommentCheck className="h-4 w-4" />,
                    count: pendingCommentCount
                },
            ]
        },
        // {
        //     title: "Content Audit",
        //     href: "/admin/dashboard/audit",
        //     icon: <FileText className="h-4 w-4" />
        // },
        // {
        //     title: "Reports",
        //     href: "/admin/dashboard/analytics",
        //     icon: <AlertCircle className="h-4 w-4" />,
        //     count: 3
        // },
        // {
        //     title: "Permissions",
        //     href: "/admin/dashboard/permissions",
        //     icon: <Lock className="h-4 w-4" />
        // },
        // {
        //     title: "Admin Settings",
        //     href: "/admin/dashboard/settings",
        //     icon: <Settings className="h-4 w-4" />
        // }
    ];

    const userNavItems: NavItem[] = [
        {
            title: "Dashboard",
            href: "/user/dashboard",
            icon: <List className="h-4 w-4" />,
        },
        {
            title: "Payment History",
            href: "/user/dashboard/payment-history",
            icon: <BadgeDollarSign className="h-4 w-4" />
        },
        {
            title: "My Subscriptions",
            href: "/user/dashboard/my-subscriptions",
            icon: <Settings className="h-4 w-4" />
        }
    ];

    // Function to check if the current path is in a group
    const isInGroup = (items: NavItem[]): boolean => {
        return items.some(item => {
            if (item.href && pathname === item.href) return true;
            if (item.children) return isInGroup(item.children);
            return false;
        });
    };

    // Initialize open states based on current path
    useEffect(() => {
        const newOpenGroups = { ...openGroups };

        adminNavItems.forEach(item => {
            if (item.children) {
                const shouldBeOpen = isInGroup(item.children);
                if (shouldBeOpen) {
                    newOpenGroups[item.title] = true;
                }
            }
        });

        setOpenGroups(newOpenGroups);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Toggle a group's open state
    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const renderNavItems = (items: NavItem[]) => {
        return items.map((item) => {
            // If item has children, render as collapsible
            if (item.children) {
                return (
                    <Collapsible
                        key={item.title}
                        open={openGroups[item.title]}
                        onOpenChange={() => toggleGroup(item.title)}
                        className="w-full"
                    >
                        <CollapsibleTrigger className={cn(
                            "flex items-center justify-between w-full rounded-md px-3 py-2",
                            "text-sm font-medium hover:text-accent-foreground transition-colors",
                            "hover:bg-accent",
                            (pathname.includes(item.title.toLowerCase()) || isInGroup(item.children)) && "bg-accent text-accent-foreground"
                        )}>
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.title}</span>
                                {item.count && (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            {openGroups[item.title] ?
                                <ChevronDown className="h-4 w-4" /> :
                                <ChevronRight className="h-4 w-4" />
                            }
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-6 pt-1">
                            {item.children.map(child => (
                                <Link
                                    key={child.href}
                                    href={child.href || "#"}
                                    className={cn(
                                        "flex items-center justify-between gap-3 rounded-md px-3 py-2 mt-1",
                                        "text-sm font-medium hover:text-accent-foreground transition-colors",
                                        "hover:bg-accent",
                                        pathname === child.href && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={toggleSidebar}
                                >
                                    <div className="flex items-center gap-3">
                                        {child.icon}
                                        <span>{child.title}</span>
                                    </div>
                                    {Boolean(child.count) && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                            {child.count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                );
            }

            // Regular nav item without children
            return (
                <Link
                    key={item.href}
                    href={item.href || "#"}
                    className={cn(
                        "flex items-center justify-between gap-3 rounded-md px-3 py-2",
                        "text-sm font-medium hover:text-accent-foreground transition-colors",
                        "hover:bg-accent",
                        pathname === item.href && "bg-accent text-accent-foreground"
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
            );
        });
    };

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
                        {renderNavItems(role === "ADMIN" ? adminNavItems : userNavItems)}
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