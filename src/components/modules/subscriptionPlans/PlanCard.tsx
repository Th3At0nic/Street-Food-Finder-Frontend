"use client";

import { subscribeToPlanAction } from "@/components/services/SubscriptionPlanServices";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TSubscriptionPlan } from "@/types/subscription.types";
import { CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";


interface PricingCardProps {
    plan: TSubscriptionPlan;
}

export function SkeletonCard() {
    return (
        <div className="w-full max-w-md rounded-2xl border p-8 shadow-sm">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-10 w-40 mb-6" />

            <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
            </div>

            <Skeleton className="h-10 w-full mt-8 rounded-md" />
        </div>
    );
}


export function PlanCard({ plan }: PricingCardProps) {
    const router = useRouter();
    const { status } = useSession();
    const handleSubscription = async () => {
        if (status === 'unauthenticated') {
            return router.push('/login');
        }
        const toastId = toast.loading('Please wait...');
        try {
            const result = await subscribeToPlanAction(plan);
            console.log({ result });
            if (result.success) {
                router.push(result.data);
            } else {
                toast.error(result.message === "you are not authorized" ? "You already have a subscription" : result.message || "Failed to subscribe", { id: toastId });
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to subscribe", { id: toastId });
        }

    }

    return (
        <div onClick={handleSubscription}
            className={cn(
                "relative flex w-full max-w-md flex-col rounded-2xl border p-8 shadow-sm hover:scale-110 transition-all cursor-pointer",
                plan.isRecommended ? "border-2 border-primary scale-105 " : ""
            )}
        >
            {plan.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-primary px-4 py-1 text-sm font-medium ">
                    Recommended
                </div>
            )}
            <h2 className="text-2xl font-bold ">{plan.name}</h2>
            <div className="mt-6 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight ">
                    ${plan.fee}
                </span>
                <span className="">/{plan.duration} days</span>
            </div>
            <ul className="mt-8 space-y-3">
                <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary" />
                    <span className="ml-3">See all premium posts</span>
                </li>
            </ul>

            <Button className="mt-8 cursor-pointer" size="lg" variant={plan.isRecommended ? "default" : "outline"}>
                Get started
            </Button>
        </div>
    );
}