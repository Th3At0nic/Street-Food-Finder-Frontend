"use client";

import { BadgeDollarSign } from "lucide-react";
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
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IMeta, IPayment, PaymentStatus } from "@/types";
import { formatDate } from "date-fns";
import { fetchPaymentHistories } from "@/components/services/PaymentServices";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { NoDataFound } from "@/components/modules/common/NoDataFound";
import { PaginationComponent } from "@/components/shared/PaginationComponent";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(7);
  const [meta, setMeta] = useState<IMeta>({ page, limit, total: 0, totalPages: 1 });
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    const getPaymentHistories = async () => {
      setIsTableLoading(true);
      try {
        const result = await fetchPaymentHistories({
          page,
          limit,
          searchTerm: Number(searchTerm)
        });
        setMeta(result.data.meta);
        setPayments(result.data.data);
      } catch (err) {
        console.log("Failed to fetch payment histories", err);
      } finally {
        setIsTableLoading(false);
      }
    };
    getPaymentHistories();
  }, [page, limit, searchTerm]);

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
            View all payment transactions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search byID, amount or transaction..."
              className="pl-10 w-full"
              type="number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="w-[15%]">Payment ID</TableHead>
                <TableHead className="w-[20%]">Transaction ID</TableHead>
                <TableHead className="w-[15%]">Amount</TableHead>
                <TableHead className="w-[15%]">Payment Status</TableHead>
                <TableHead className="w-[20%]">Subscription Plan</TableHead>
                <TableHead className="w-[15%]">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTableLoading ? (
                <TableSkeleton cols={6} />
              ) : payments.length ? payments.map((payment) => (
                <TableRow key={payment.pmId}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {payment.pmId}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] sm:max-w-none">
                    {payment.shurjoPayOrderId || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {payment.amount || 'N/A'}
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
                      {payment?.userSubscription[0]?.subscriptionPlan?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(payment.createdAt, "dd-MMM-yyyy hh:mm:ss a")}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <NoDataFound className="h-full" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <PaginationComponent
        isTableLoading={isTableLoading}
        meta={meta}
        setPage={setPage}
        page={page}
        tableContentName="payments"
      />
    </div>
  );
}