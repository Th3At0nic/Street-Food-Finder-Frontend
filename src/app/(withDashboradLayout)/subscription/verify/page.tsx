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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderData {
    id: number;
    order_id: string;
    currency: string;
    amount: number;
    payable_amount: number;
    discsount_amount: number | null;
    disc_percent: number;
    received_amount: string;
    usd_amt: number;
    usd_rate: number;
    is_verify: number;
    card_holder_name: string | null;
    card_number: string | null;
    phone_no: string;
    bank_trx_id: string;
    invoice_no: string;
    bank_status: string;
    customer_order_id: string;
    sp_code: string;
    sp_message: string;
    name: string;
    email: string;
    address: string;
    city: string;
    value1: string | null;
    value2: string | null;
    value3: string | null;
    value4: string | null;
    transaction_status: string | null;
    method: string;
    date_time: string;
}

export default function SubscriptionVerification() {
    const searchParams = useSearchParams();
    const [spOrderId, setSpOrderId] = useState(searchParams.get("order_id"));
    const [data, setData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);



    useEffect(() => {
        console.log({ spOrderId });
        const verifyShurjoPayment = async () => {
            if (spOrderId) {
                try {
                    const result = await verifyPaymentAction(spOrderId);
                    setData(result);
                    console.log({ result });
                } catch (error) {
                    console.error("Payment verification failed:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        verifyShurjoPayment();
    }, [spOrderId])

    const orderData: OrderData | null = data?.data?.length ? data.data[0] : null;

    return isLoading ? (
        <Skeleton />
    ) : (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Order Verification</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid lg:grid-cols-2 gap-2">
                            <dt className="font-semibold">Order ID:</dt>
                            <dd>{orderData?.order_id}</dd>
                            <dt className="font-semibold">Amount:</dt>
                            <dd>
                                {orderData?.currency} {orderData?.amount?.toFixed(2)}
                            </dd>
                            <dt className="font-semibold">Status:</dt>
                            <dd>
                                <Badge
                                    color={orderData?.bank_status === "Success" ? "green" : "red"}
                                >
                                    {orderData?.bank_status}
                                </Badge>
                            </dd>
                            <dt className="font-semibold">Date:</dt>
                            <dd>{orderData?.date_time ? new Date(orderData.date_time).toLocaleString() : 'N/A'}</dd>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid lg:grid-cols-2 gap-2">
                            <dt className="font-semibold">Method:</dt>
                            <dd>{orderData?.method}</dd>
                            <dt className="font-semibold">Transaction ID:</dt>
                            <dd>{orderData?.bank_trx_id}</dd>
                            <dt className="font-semibold">Invoice No:</dt>
                            <dd>{orderData?.invoice_no}</dd>
                            <dt className="font-semibold">SP Code:</dt>
                            <dd>{orderData?.sp_code}</dd>
                            <dt className="font-semibold">SP Message:</dt>
                            <dd>{orderData?.sp_message}</dd>
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
                            <dd>{orderData?.name}</dd>
                            <dt className="font-semibold">Email:</dt>
                            <dd>{orderData?.email}</dd>
                            <dt className="font-semibold">Phone:</dt>
                            <dd>{orderData?.phone_no}</dd>
                            <dt className="font-semibold">Address:</dt>
                            <dd>{orderData?.address}</dd>
                            <dt className="font-semibold">City:</dt>
                            <dd>{orderData?.city}</dd>
                        </dl>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
