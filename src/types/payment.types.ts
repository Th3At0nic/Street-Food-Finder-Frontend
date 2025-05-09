import { TSubscriptionPlan } from "./subscription.types";

export interface IPaymentData {
  verificationResponse: VerificationResponse;
  payment: IPayment;
  userSubscription: TUserSubscription;
}

export interface IPayment {
  pmId: string;
  userId: string;
  shurjoPayOrderId: string;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
  userSubscription: TUserSubscription[];
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID"
}

export interface TUserSubscription {
  id: string;
  subPlanId: string;
  paymentStatus: string;
  pmId: string;
  userId: string;
  expiringAt: null;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan: TSubscriptionPlan;
}

export interface VerificationResponse {
  id: number;
  order_id: string;
  currency: string;
  amount: number;
  payable_amount: number;
  discsount_amount: null;
  disc_percent: number;
  received_amount: string;
  usd_amt: number;
  usd_rate: number;
  is_verify: number;
  card_holder_name: null;
  card_number: null;
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
  value1: null;
  value2: null;
  value3: null;
  value4: null;
  transaction_status: null;
  method: string;
  date_time: Date;
}
