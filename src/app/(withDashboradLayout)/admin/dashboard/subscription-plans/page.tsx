// app/admin/users/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { IMeta, SubscriptionPlanStatus, TSubscriptionPlan } from "@/types";
import { createOrUpdateSubscriptionPlan, fetchSubscriptionPlans } from "@/components/services/SubscriptionPlanServices";
import { formatDate } from "date-fns";
import { GrPlan } from "react-icons/gr";
import { toast } from "sonner";
import { SubscriptionPlanModal } from "@/components/modules/subscriptionPlans/createSubscriptionModal";

export default function UserManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [subscriptionPlans, setSubscriptionPlans] = useState<TSubscriptionPlan[]>([]);
  const [meta, setMeta] = useState<IMeta | null>();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TSubscriptionPlan | undefined>(undefined);

  const handleCreatePlan = () => {
    setCurrentPlan(undefined);
    setOpen(true);
  };

  const handleEditPlan = (plan: TSubscriptionPlan) => {
    setCurrentPlan(plan);
    setOpen(true);
  };

  const handleSubmit = async (data: TSubscriptionPlan) => {
    setIsLoading(true);
    const toastId = toast.loading(`Creating plan ${data.name}...`);

    try {
      const result = await createOrUpdateSubscriptionPlan(data);
      console.log({ result });
      if (currentPlan) {
        // Update existing plan
        setSubscriptionPlans(subscriptionPlans.map(plan =>
          plan.name === currentPlan.name ? result.data : plan
        ));
        toast.success(`Successfully updated ${data.name}`, { id: toastId })
      } else {
        // Create new plan
        setSubscriptionPlans([...subscriptionPlans, result.data]);
        toast.success(`Successfully created ${data.name}`, { id: toastId })
      }

      setOpen(false);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong. Please try again.", { id: toastId })
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAllPlans = async () => {
      const result = await fetchSubscriptionPlans({});
      setMeta(result.data.meta);
      setSubscriptionPlans(result.data.data);
    };
    getAllPlans();
  }, [selectedRole]);


  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GrPlan className="h-6 w-6" />
            <span className="text-xl sm:text-2xl">Subscription Plans Management</span>
          </h2>
          <p className="text-sm text-gray-500">
            Manage subscription plans
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search plans..." className="pl-10 w-full" />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value={SubscriptionPlanStatus.ACTIVE}>Active plans</SelectItem>
              <SelectItem value={SubscriptionPlanStatus.IN_ACTIVE}>In-active plans</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreatePlan}>
            <PlusCircle /> Add
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="w-[15%]">Plan Name</TableHead>
                <TableHead className="w-[8%]">Fee</TableHead>
                <TableHead className="w-[15%]">Duration</TableHead>
                <TableHead className="w-[8%]">Status</TableHead>
                <TableHead className="w-[10%]">Recommended</TableHead>
                <TableHead className="w-[5%]">Updated At</TableHead>
                <TableHead className="w-[30%] text-right">Actions</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionPlans?.map((plan) => (
                <TableRow key={plan.spId}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {plan.name}
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {plan?.fee || 'N/A'}
                  </TableCell>

                  <TableCell>{plan.duration} days</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        plan.status === SubscriptionPlanStatus.ACTIVE ? "secondary" : "destructive"
                      }
                      className="text-xs sm:text-sm"
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-center">{plan.isRecommended ? 'Yes' : 'No'}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      {formatDate(plan.updatedAt, "hh:mm:ss dd-MM-yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        onClick={() => handleEditPlan(plan)}
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 cursor-pointer"
                      >
                        <Pencil />
                      </Button>
                    </div>
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
          Showing {((meta?.page || 0) - 1) * (meta?.limit || 7) + 1} - {(meta?.page || 0) * (meta?.limit || 7)} of {meta?.total} subscription plans
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </div>
      <SubscriptionPlanModal
        open={open}
        onOpenChange={setOpen}
        initialData={currentPlan}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div >
  );
}
