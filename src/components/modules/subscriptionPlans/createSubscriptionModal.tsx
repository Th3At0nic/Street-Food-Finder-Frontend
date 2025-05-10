"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SubscriptionPlanStatus, TSubscriptionPlan } from "@/types";

const subscriptionStatusOptions = [
    { value: SubscriptionPlanStatus.ACTIVE, label: "Active" },
    { value: SubscriptionPlanStatus.IN_ACTIVE, label: "Inactive" },
];

const commonFeatures = [
    { id: "basic", label: "Basic Access" },
    { id: "standard", label: "Standard Support" },
    { id: "premium", label: "Premium Support" },
    { id: "unlimited", label: "Unlimited Usage" },
    { id: "advanced", label: "Advanced Features" },
];

// Form schema validation
const subscriptionPlanSchema = z.object({
    spId: z.string().optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    isRecommended: z.boolean().default(false),
    fee: z.coerce.number().positive({ message: "Fee must be greater than 0" }),
    duration: z.coerce.number().int().positive({ message: "Duration must be a positive integer" }).default(30),
    status: z.enum([SubscriptionPlanStatus.ACTIVE, SubscriptionPlanStatus.IN_ACTIVE]).default(SubscriptionPlanStatus.ACTIVE),
});


interface SubscriptionPlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: TSubscriptionPlan;
    onSubmit: (data: TSubscriptionPlan) => void;
    isLoading?: boolean;
}

export function SubscriptionPlanModal({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading = false,
}: SubscriptionPlanModalProps) {
    const isEditMode = !!initialData?.name;

    const form = useForm<TSubscriptionPlan>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(subscriptionPlanSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            features: [],
            isRecommended: false,
            fee: 0,
            duration: 30,
            status: "ACTIVE",
            ...initialData,
        },
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: "",
                description: "",
                features: [],
                isRecommended: false,
                fee: 0,
                duration: 30,
                status: "ACTIVE",
                ...initialData,
            });
        }
    }, [open, initialData, form]);

    const handleSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
        onSubmit(data as TSubscriptionPlan);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px] max-h-[88vh] mt-8 p-0 flex flex-col">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>
                        {isEditMode ? "Edit Subscription Plan" : "Create Subscription Plan"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update the details of this subscription plan."
                            : "Enter the details for the new subscription plan."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Premium Plan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A detailed description of the subscription plan..."
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="features"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel>Features</FormLabel>
                                            <FormDescription>
                                                Select the features included in this plan
                                            </FormDescription>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {commonFeatures.map((feature) => (
                                                <FormField
                                                    key={feature.id}
                                                    control={form.control}
                                                    name="features"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={feature.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(feature.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentFeatures = field.value || [];
                                                                            return checked
                                                                                ? field.onChange([...currentFeatures, feature.id])
                                                                                : field.onChange(
                                                                                    currentFeatures.filter(
                                                                                        (value) => value !== feature.id
                                                                                    )
                                                                                );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {feature.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fee</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (Days)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="30"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                {subscriptionStatusOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isRecommended"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Recommended Plan</FormLabel>
                                            <FormDescription>
                                                Highlight this plan as the recommended option
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter className="p-4 border-t">
                    <Button className="cursor-pointer" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}