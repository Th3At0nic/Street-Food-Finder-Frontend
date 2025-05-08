"use server";

import config from "@/config";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function verifyPaymentAction(spOrderId: string) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/payments/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ spOrderId })
    });
    await response.json();
  } catch (error: unknown) {
    throw error;
  }
}
