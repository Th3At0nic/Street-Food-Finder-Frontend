"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BadgeDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { IMeta, IPayment, PaymentStatus } from "@/types";
import { formatDate } from "date-fns";
import { fetchPaymentHistories } from "@/components/services/PaymentServices";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [meta, setMeta] = useState<IMeta | null>();

  useEffect(() => {
    const getPaymentHistories = async () => {
      const result = await fetchPaymentHistories({ page: 1, limit: 7 });
      console.log({ result });
      setMeta(result.data.meta);
      setPayments(result.data.data);
    };
    getPaymentHistories();
  }, []);
  console.log(payments[0]?.userSubscription[0]);
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BadgeDollarSign className="h-6 w-6" />
            <span className="text-xl sm:text-2xl">Payment History</span>
          </h2>
          <p className="text-sm text-gray-500">
            See your payment history
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search plans..." className="pl-10 w-full" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="w-[15%]">Id</TableHead>
                <TableHead className="w-[8%]">Transaction Id</TableHead>
                <TableHead className="w-[15%]">Amount</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[30%] text-right">Subscription Plan</TableHead>
                <TableHead className="w-[5%]">Created At</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.pmId}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {payment.pmId}
                  </TableCell>

                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {payment.shurjoPayOrderId}
                  </TableCell>

                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {payment.amount || 'N/A'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      {formatDate(payment.createdAt, "hh:mm:ss dd-MM-yyyy")}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={payment?.userSubscription[0]?.paymentStatus === PaymentStatus.PAID ? 'default' : 'secondary'}
                      className="text-xs sm:text-sm"
                    >
                      {payment?.userSubscription[0]?.paymentStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={'secondary'}
                      className="text-xs sm:text-sm"
                    >
                      {payment?.userSubscription[0]?.subscriptionPlan?.name}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing {((meta?.page || 0) - 1) * (meta?.limit || 7) + 1} - {(meta?.page || 0) * (meta?.limit || 7)} of {meta?.total} payments
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={meta?.page === 1}>
            Previous
          </Button>
          <Button variant="outline" disabled={meta?.page === meta?.totalPages || meta?.totalPages === 1}>
            Next
          </Button>
        </div>
      </div>
    </div >
  );
}
