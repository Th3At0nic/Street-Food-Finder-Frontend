'use client';

import { PlanCard, SkeletonCard } from "@/components/modules/subscriptionPlans/PlanCard";
import { fetchSubscriptionPlans } from "@/components/services/SubscriptionPlanServices";
import {
    ISubscriptionPlanResponse,
    SubscriptionPlanStatus,
    TSubscriptionPlan,
} from "@/types/subscription.types";
import { useEffect, useState } from "react";

export default function SubscriptionPlanPage() {
    const [plans, setPlans] = useState<TSubscriptionPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const result: ISubscriptionPlanResponse = await fetchSubscriptionPlans({
                    page: 1,
                    limit: 3,
                    status: SubscriptionPlanStatus.ACTIVE,
                });

                if (result.success) {
                    setPlans(result.data.data);
                } else {
                    console.error("Failed to fetch plans:", result.message);
                }
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Subscription Plans
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Choose the perfect plan for your needs. Start with a free trial and upgrade anytime.
                </p>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
                {loading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))
                    : plans.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
            </div>
        </div>
    );
}
