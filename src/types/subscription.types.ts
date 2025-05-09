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
  fee: number;
  duration: number;
  status: string;
  isRecommended?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
