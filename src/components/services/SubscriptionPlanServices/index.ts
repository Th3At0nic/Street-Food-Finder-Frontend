"use server";

import config from "@/config";
import { IMeta, IResponse, SubscriptionPlanStatus, TSubscriptionPlan } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function fetchSubscriptionPlans(params: {
  page?: number;
  limit?: number;
  status?: SubscriptionPlanStatus;
}) {
  const session = await getServerSession(authOptions);
  const { page = 1, limit = 7, status } = params;
  try {
    let baseUrl = `${config.backend_url}/subscription-plans?page=${page}&limit=${limit}`;
    if (status) {
      baseUrl += `&status=${status}`;
    }
    const response = await fetch(`${baseUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: IResponse<{
      data: TSubscriptionPlan[];
      meta: IMeta;
    }> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

export async function subscribeToPlanAction(plan: TSubscriptionPlan) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/subscription-plans/subscribe/${plan.spId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: IResponse<string> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

export async function createOrUpdateSubscriptionPlan(plan: TSubscriptionPlan) {
  const session = await getServerSession(authOptions);
  console.log({ plan });
  try {
    let subApiUrl = `${config.backend_url}/subscription-plans`;
    let method = "POST";
    if (plan.spId) {
      subApiUrl = `${config.backend_url}/subscription-plans/${plan.spId}`;
      method = "PATCH";
    }
    const response = await fetch(`${subApiUrl}`, {
      method,
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(plan)
    });
    const result: IResponse<TSubscriptionPlan> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}
