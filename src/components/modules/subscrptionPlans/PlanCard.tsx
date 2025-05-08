"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TSubscriptionPlan } from "@/types/subscription.types";
import { CheckIcon } from "lucide-react";

interface PricingCardProps {
    plan: TSubscriptionPlan;
}

export function PlanCard({ plan }: PricingCardProps) {
    return (
        <div
            className={cn(
                "relative flex w-full max-w-md flex-col rounded-2xl border border-gray-200 p-8 shadow-sm hover:scale-110 transition-all",
                plan.recommended ? "border-2 border-primary scale-105 " : ""
            )}
        >
            {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                    Recommended
                </div>
            )}
            <h2 className="text-2xl font-bold ">{plan.name}</h2>
            <p className="mt-2 text-gray-600">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight ">
                    ${plan.price}
                </span>
                <span className="text-gray-500">/{plan.duration}</span>
            </div>

            <Button className="mt-8" size="lg" variant={plan.recommended ? "default" : "outline"}>
                Get started
            </Button>

            <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}