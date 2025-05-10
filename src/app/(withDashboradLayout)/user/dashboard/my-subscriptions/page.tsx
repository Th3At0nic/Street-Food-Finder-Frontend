'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  PackageCheck,
  Star,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserCurrentSubscription } from "@/components/services/SubscriptionServices";
import { IActiveSubscriptionPlan } from "@/types/activeSubscription.types";
import Link from "next/link";

export default function MySubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<IActiveSubscriptionPlan | null>(null);

  const getCurrentSubscription = async () => {
    try {
      setLoading(true);
      const result = await fetchUserCurrentSubscription({});

      if (result?.success && result?.data) {
        setUserSubscription(result.data);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentSubscription();
  }, []);

  // Calculate days remaining for active subscription
  const calculateRemainingDays = () => {
    if (!userSubscription?.hasActiveSubscription || !userSubscription?.subscriptionExpiry) {
      return { daysRemaining: 0, progressPercent: 0 };
    }

    const expiryDate = new Date(userSubscription.subscriptionExpiry);
    const createdDate = new Date(userSubscription.activeSubscription.createdAt);
    const totalDays = userSubscription.activeSubscription.subscriptionPlan.duration;

    const now = new Date();
    const daysRemaining = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const daysElapsed = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressPercent = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));

    return { daysRemaining, progressPercent };
  };

  const { daysRemaining, progressPercent } = calculateRemainingDays();

  // Format date for display
  const formatDate = (dateString?: Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <PackageCheck className="h-6 w-6 text-accent" />
          My Subscription
        </h2>
        <p className="text-sm text-gray-500">Manage your subscription plan and payment details</p>
      </div>

      <div className="space-y-6">
        {/* Current Subscription Status */}
        {userSubscription?.hasActiveSubscription ? (
          <Card className={userSubscription.activeSubscription.subscriptionPlan.isRecommended ? "border-blue-200" : ""}>
            <CardHeader className={userSubscription.activeSubscription.subscriptionPlan.isRecommended ? "bg-blue-50" : ""}>
              <div className="flex justify-between items-center">
                <CardTitle>{userSubscription.activeSubscription.subscriptionPlan.name}</CardTitle>
                {userSubscription.activeSubscription.subscriptionPlan.isRecommended && (
                  <Badge className="bg-accent text-accent-foreground">Recommended</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{userSubscription.activeSubscription.subscriptionPlan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Subscription Period</span>
                  </div>
                  <span className="font-medium">
                    {daysRemaining} days remaining
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Started {formatDate(userSubscription.activeSubscription.createdAt)}</span>
                  <span>Expires {formatDate(userSubscription.subscriptionExpiry)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Plan Features</h3>
                <ul className="space-y-2">
                  {userSubscription.activeSubscription.subscriptionPlan.features &&
                    userSubscription.activeSubscription.subscriptionPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">Subscription Fee</p>
                <p className="text-2xl font-bold">৳ {parseFloat(userSubscription?.activeSubscription.subscriptionPlan.fee).toFixed(2)}</p>
              </div>
              {/* TODO: Future work */}
              {/* <Button>Change Plan</Button> */}
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-amber-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium mb-1">No Active Subscription</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {`You currently don't have an active subscription. Subscribe to access premium features.`}
                  </p>
                </div>
                <Button>
                  Subscribe Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <p className="text-sm text-gray-500">Compare subscription options</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {userSubscription?.hasActiveSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  key={userSubscription?.activeSubscription.subscriptionPlan.spId}
                  className={`border rounded-lg p-4 bg-blue-50 border-blue-200ZZ`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{userSubscription?.activeSubscription.subscriptionPlan.name}</h3>
                    {userSubscription?.activeSubscription.subscriptionPlan.isRecommended && (
                      <Badge className="bg-amber-500">
                        <Star className="h-3 w-3 mr-1" /> Best Value
                      </Badge>
                    )}
                    <Badge className="bg-green-500">Current</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{userSubscription?.activeSubscription.subscriptionPlan.description}</p>
                  <p className="text-xl font-bold mb-4">৳ {parseFloat(userSubscription?.activeSubscription.subscriptionPlan.fee).toFixed(2)}<span className="text-sm font-normal text-gray-500">/{userSubscription.activeSubscription.subscriptionPlan.duration} days</span></p>

                  <ul className="text-sm space-y-1 mb-4">
                    {userSubscription?.activeSubscription.subscriptionPlan.features && userSubscription?.activeSubscription.subscriptionPlan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {userSubscription?.activeSubscription.subscriptionPlan.features && userSubscription?.activeSubscription.subscriptionPlan.features.length > 3 && (
                      <li className="text-blue-600 text-xs mt-1">+ {userSubscription?.activeSubscription.subscriptionPlan.features.length - 3} more features</li>
                    )}
                  </ul>

                  <Button
                    variant={"outline"}
                    disabled={Boolean(userSubscription?.activeSubscription)}
                    className="w-full"
                  >
                    {Boolean(userSubscription?.activeSubscription) ? "Current Plan" : "Select Plan"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No subscription plans available at the moment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information - Only show for active subscription */}
        {userSubscription?.hasActiveSubscription && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">ShurjoPay</h3>
                      <p className="text-sm text-gray-500">Order ID: {userSubscription.activeSubscription.payment.shurjoPayOrderId}</p>
                    </div>
                  </div>
                  <Badge className={userSubscription.activeSubscription.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-amber-500'}>
                    {userSubscription.activeSubscription.paymentStatus === 'PAID' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Plan:</span>
                    <span className="font-medium">{userSubscription.activeSubscription.subscriptionPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">৳ {parseFloat(userSubscription.activeSubscription.payment.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Transaction Date:</span>
                    <span className="font-medium">{formatDate(userSubscription.activeSubscription.payment.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment ID:</span>
                    <span className="font-medium">{userSubscription.activeSubscription.payment.pmId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{userSubscription.activeSubscription?.subscriptionPlan.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(userSubscription.activeSubscription.payment.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳ {parseFloat(userSubscription.activeSubscription.payment.amount).toFixed(2)}</p>
                      <Badge className="bg-green-500">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Link href={'/user/dashboard/payment-history'} >
                      <Button variant="outline">View All Transactions</Button>
                    </Link>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            {/* TODO: Future tasks */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Renewal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Renew Automatically</h3>
                      <p className="text-sm text-gray-500">Your subscription will renew on {formatDate(userSubscription.subscriptionExpiry)}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
 
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="text-red-600">
                  <CardTitle>Cancel Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-500">
                      Canceling your subscription will immediately revoke access to premium features.
                      Your subscription will remain active until the end of your current billing period.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="destructive">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}