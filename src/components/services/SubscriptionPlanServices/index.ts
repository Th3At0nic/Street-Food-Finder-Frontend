"use server";

import config from "@/config";
import { IMeta, IResponse, TSubscriptionPlan } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function fetchSubscriptionPlans() {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/subscription-plans`, {
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
