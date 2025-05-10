"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";

interface PostRejectConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title?: string;
    description?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "default" | "destructive";
    children?: ReactNode;
}

export function PostRejectConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "Reject this post? This action cannot be undone.",
    confirmText = "Reject",
    cancelText = "Cancel",
    isLoading = false,
    variant = "destructive",
    children,
}: PostRejectConfirmationModalProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<{ reason: string }>();

    const submitHandler = (data: { reason: string }) => {
        onConfirm(data.reason);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                {children ? (
                    <div className="py-4">{children}</div>
                ) : (
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reject Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Enter reason for rejection"
                                {...register("reason", { required: "Reason is required" })}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                type="submit"
                                variant={variant}
                                disabled={isLoading}
                            >
                                {confirmText}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
