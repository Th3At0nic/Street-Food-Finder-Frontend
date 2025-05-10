"use server";

import config from "@/config";
import { IMeta, IResponse, IPayment } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

// get payment history
export async function fetchUserSubscriptions(params: { page?: number; limit?: number }) {
  const session = await getServerSession(authOptions);
  const { page = 1, limit = 7 } = params;
  try {
    const response = await fetch(`${config.backend_url}/user-subscriptions?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: IResponse<{
      data: IPayment[];
      meta: IMeta;
    }> = await response.json();
    console.log({ paymentResult: result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}
