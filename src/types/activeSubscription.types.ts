export interface IActiveSubscriptionPlan{
  hasActiveSubscription: boolean;
  activeSubscription: ActiveSubscription;
  subscriptionExpiry: Date;
  isPremiumUser: boolean;
}

export interface ActiveSubscription {
  id: string;
  subPlanId: string;
  paymentStatus: string;
  pmId: string;
  userId: string;
  expiringAt: Date;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan: SubscriptionPlan;
  payment: Payment;
  user: User;
}

export interface Payment {
  pmId: string;
  userId: string;
  shurjoPayOrderId: string;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  spId: string;
  name: string;
  description: string;
  features: string[];
  isRecommended: boolean;
  fee: string;
  duration: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  userDetails: UserDetails;
}

export interface UserDetails {
  name: string;
  profilePhoto: null;
  contactNumber: null;
}
