"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TPostCategory } from "@/types";

// Define form schema with Zod
const postCategorySchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required",
    }),
});

type FormValues = z.infer<typeof postCategorySchema>;

interface PostCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: TPostCategory;
    onSubmit: (data: TPostCategory) => Promise<void>;
    isLoading?: boolean;
}

export function PostCategoryModal({ category, onSubmit, open, onOpenChange, isLoading = false }: PostCategoryModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!category;

    const form = useForm<FormValues>({
        resolver: zodResolver(postCategorySchema),
        defaultValues: {
            name: category?.name || "",
        },
    });

    // Reset form values when category changes or modal opens/closes
    useEffect(() => {
        if (open) {
            form.reset({
                name: category?.name || "",
            });
        }
    }, [category, form, open]);

    const handleSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            setIsSubmitting(true);

            // Prepare data for submission - preserve the category ID when editing
            const dataToSubmit: TPostCategory = {
                ...values,
                catId: category?.catId || "", // Keep the existing ID when editing
                createdAt: category?.createdAt || new Date(),
                updatedAt: new Date(),
            };

            await onSubmit(dataToSubmit);

            // Don't close the modal here, let the parent component handle it
            // based on success/failure of the operation
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Category" : "Create New Category"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update the details of this post category."
                            : "Create a new category for your posts."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting || isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting || isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}