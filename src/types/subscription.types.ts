import { IMeta } from "./common.types";

export interface ISubscriptionPlanResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: Data;
}

export interface Data {
  meta: IMeta;
  data: TSubscriptionPlan[];
}

export interface TSubscriptionPlan {
  spId: string;
  name: string;
  description?: string;
  features?: string[];
  fee: number;
  duration: number;
  status: string;
  isRecommended?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export enum SubscriptionPlanStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE"
}
