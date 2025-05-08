export interface TSubscriptionPlan {
  name: string;
  description: string;
  price: number;
  duration: "month" | "year";
  features: string[];
  recommended?: boolean;
}
