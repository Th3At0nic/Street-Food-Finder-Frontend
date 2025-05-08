import { PlanCard } from "@/components/modules/subscrptionPlans/PlanCard";
import { TSubscriptionPlan } from "@/types/subscription.types";

export default function SubscriptionPlanPage() {
    const plans: TSubscriptionPlan[] = [
        {
            name: "Basic",
            description: "Perfect for getting started",
            price: 9,
            duration: "month",
            features: [
                "10 projects",
                "5 team members",
                "Basic analytics",
                "Email support",
            ],
            recommended: false,
        },
        {
            name: "Pro",
            description: "Best for professional use",
            price: 29,
            duration: "month",
            features: [
                "Unlimited projects",
                "20 team members",
                "Advanced analytics",
                "Priority email support",
                "API access",
            ],
            recommended: true,
        },
        {
            name: "Enterprise",
            description: "For large scale businesses",
            price: 99,
            duration: "month",
            features: [
                "Unlimited projects",
                "Unlimited team members",
                "Advanced analytics",
                "24/7 phone support",
                "API access",
                "Custom integrations",
            ],
            recommended: false,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl">
                    Subscription Plans
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Choose the perfect plan for your needs. Start with a free trial and
                    upgrade anytime.
                </p>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
                {plans.map((plan) => (
                    <PlanCard key={plan.name} plan={plan} />
                ))}
            </div>
        </div>
    );
}