// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { GrPlan } from "react-icons/gr";
import { Search, Pencil, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createOrUpdateSubscriptionPlan,
  fetchSubscriptionPlans,
} from "@/components/services/SubscriptionPlanServices";
import { SubscriptionPlanModal } from "@/components/modules/subscriptionPlans/createSubscriptionModal";

import { IMeta, SubscriptionPlanStatus, TSubscriptionPlan } from "@/types";

export default function SubscriptionPlanManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [subscriptionPlans, setSubscriptionPlans] = useState<TSubscriptionPlan[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TSubscriptionPlan | undefined>(undefined);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Fetch Plans based on filters
  useEffect(() => {
    const getAllPlans = async () => {
      try {
        let result;
        if (debouncedSearchTerm) {
          result = await fetchSubscriptionPlans({ page, limit, searchTerm: debouncedSearchTerm });
        } else if (selectedRole === "all") {
          result = await fetchSubscriptionPlans({ page, limit });
        } else {
          result = await fetchSubscriptionPlans({ page, limit, status: selectedRole as SubscriptionPlanStatus });
        }
        setMeta(result?.data?.meta);
        setSubscriptionPlans(result?.data?.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    getAllPlans();
  }, [selectedRole, page, limit, debouncedSearchTerm]);

  // Create or Update Plan
  const handleSubmit = async (data: TSubscriptionPlan) => {
    setIsLoading(true);
    const toastId = toast.loading(`Saving plan "${data.name}"...`);
    try {
      const result = await createOrUpdateSubscriptionPlan(data);

      if (currentPlan) {
        // Update existing
        setSubscriptionPlans((prev) =>
          prev.map((plan) => (plan.spId === currentPlan.spId ? result.data : plan))
        );
        toast.success(`Plan "${data.name}" updated!`, { id: toastId });
      } else {
        // Add new
        setSubscriptionPlans((prev) => [result.data, ...prev]);
        toast.success(`Plan "${data.name}" created!`, { id: toastId });
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GrPlan className="h-6 w-6" />
            <span>Subscription Plans Management</span>
          </h2>
          <p className="text-sm text-gray-500">Manage subscription plans</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search plans..."
              className="pl-10 w-full"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={selectedRole} onValueChange={(value) => { setSelectedRole(value); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value={SubscriptionPlanStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={SubscriptionPlanStatus.IN_ACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Plan Button */}
          <Button onClick={() => { setCurrentPlan(undefined); setOpen(true); }}>
            <PlusCircle className="mr-2" /> Add Plan
          </Button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recommended</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans?.map((plan) => (
                <TableRow key={plan.spId}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.fee || "N/A"}</TableCell>
                  <TableCell>{plan.duration} days</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === SubscriptionPlanStatus.ACTIVE ? "secondary" : "destructive"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.isRecommended ? "Yes" : "No"}</TableCell>
                  <TableCell>{format(new Date(plan.updatedAt), "hh:mm:ss dd-MM-yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => { setCurrentPlan(plan); setOpen(true); }}
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
          Showing {(meta?.page || 0) * (meta?.limit || limit) - (meta?.limit || limit) + 1} -
          {(meta?.page || 0) * (meta?.limit || limit)} of {meta?.total || 0} plans
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            variant="outline"
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            variant="outline"
            disabled={page >= (meta?.totalPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Update Plan Modal */}
      <SubscriptionPlanModal
        open={open}
        onOpenChange={setOpen}
        initialData={currentPlan}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
