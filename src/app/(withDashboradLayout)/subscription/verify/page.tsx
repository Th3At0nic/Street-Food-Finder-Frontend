"use client";

import { verifyPaymentAction } from "@/components/services/PaymentServices";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IPaymentData } from "@/types/payment.types";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";


export default function SubscriptionVerification() {
    const searchParams = useSearchParams();
    const spOrderId = searchParams.get("order_id");
    const router = useRouter();

    const [data, setData] = useState<IPaymentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const verificationResultRef = useRef<{ success: boolean; shouldUpdateSession: boolean }>({
        success: false,
        shouldUpdateSession: false
    });
    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        if (!spOrderId || hasVerifiedRef.current) {
            return;
        }

        hasVerifiedRef.current = true;

        const verifyPayment = async () => {
            try {
                const result = await verifyPaymentAction(spOrderId);
                if (result.success) {
                    setData(result.data);
                    verificationResultRef.current = {
                        success: true,
                        shouldUpdateSession: true
                    };
                } else {
                    toast.error(result.message);
                    setErrorMessage(result.message);
                }
            } catch (err) {
                console.error("Payment verification failed:", err);
                setErrorMessage("Verification failed.");
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [spOrderId]);

    useEffect(() => {
        if (verificationResultRef.current.shouldUpdateSession) {
            verificationResultRef.current.shouldUpdateSession = false;

            const updateSession = async () => {
                try {
                    const event = new CustomEvent('session-update-needed');
                    window.dispatchEvent(event);
                    localStorage.setItem('session-needs-update', 'true');
                } catch (error) {
                    console.error("Failed to update session:", error);
                }
            };

            updateSession();
        }
    }, [data]);



    const paymentData: IPaymentData | null = data ? data : null;
    console.log({ paymentData });
    return isLoading ? (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Payment Verification</h1>
            <div className="grid gap-6 md:grid-cols-2">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-1/3" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid lg:grid-cols-2 gap-2">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="flex flex-col gap-1">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    ) : (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Payment Verification</h1>
            {paymentData ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid lg:grid-cols-2 gap-2">
                                <dt className="font-semibold">Payment ID:</dt>
                                <dd>{paymentData?.payment.pmId}</dd>
                                <dt className="font-semibold">Amount:</dt>
                                <dd>
                                    {paymentData?.verificationResponse.currency} {Number(paymentData?.payment.amount).toFixed(2)}
                                </dd>
                                <dt className="font-semibold">Status:</dt>
                                <dd>
                                    <Badge
                                        className={paymentData?.verificationResponse.bank_status === "Success" ? "bg-green-500" : "bg-red-500"}
                                    >
                                        {paymentData?.verificationResponse.bank_status}
                                    </Badge>
                                </dd>
                                <dt className="font-semibold">Date:</dt>
                                <dd>{paymentData?.payment.createdAt ? new Date(paymentData?.payment.createdAt).toLocaleString() : 'N/A'}</dd>
                            </dl>
                            {paymentData?.verificationResponse.bank_status === "Success" && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => router.push('/user/dashboard')}
                                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                                    >
                                        Go to Your Dashboard
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid lg:grid-cols-2 gap-2">
                                <dt className="font-semibold">Method:</dt>
                                <dd>{paymentData?.verificationResponse.method}</dd>
                                <dt className="font-semibold">Transaction ID:</dt>
                                <dd>{paymentData?.verificationResponse.bank_trx_id}</dd>
                                <dt className="font-semibold">Invoice No:</dt>
                                <dd>{paymentData?.verificationResponse.invoice_no}</dd>
                                <dt className="font-semibold">SP Code:</dt>
                                <dd>{paymentData?.verificationResponse.sp_code}</dd>
                                <dt className="font-semibold">SP Message:</dt>
                                <dd>{paymentData?.verificationResponse.sp_message}</dd>
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid lg:grid-cols-2 gap-2">
                                <dt className="font-semibold">Name:</dt>
                                <dd>{paymentData?.verificationResponse.name}</dd>
                                <dt className="font-semibold">Email:</dt>
                                <dd>{paymentData?.verificationResponse.email}</dd>
                                <dt className="font-semibold">Phone:</dt>
                                <dd>{paymentData?.verificationResponse.phone_no}</dd>
                                <dt className="font-semibold">Address:</dt>
                                <dd>{paymentData?.verificationResponse.address}</dd>
                                <dt className="font-semibold">City:</dt>
                                <dd>{paymentData?.verificationResponse.city}</dd>
                            </dl>
                        </CardContent>
                    </Card>
                </div>) :
                (
                    <div className="flex justify-center items-center ">
                        <Card>
                            <CardContent>
                                <div className="bg-red-500 text-white p-5 text-2xl">{errorMessage}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

        </div>
    );
}
