"use server";

import config from "@/config";
import { IMeta, IResponse, TUser } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { toast } from "sonner";

export const getAllUsers = async () => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/users`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}` // ✅ Added Bearer here
      },
      next: {
        tags: ["users"]
      }
    });

    // if (!res.ok) {
    //   throw new Error("Failed to fetch users");
    // }

    const userResult = await res.json();

    return userResult.data;
  } catch (error) {
    console.error(error);
  }
};
export const getSingleUser = async () => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/users/me`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      next: {
        tags: ["users"] // 👈 cache tag for the specific user
      }
    });

    if (!res.ok) {
      toast.error("failed to fetch users");
    }

    const userResult = await res.json();

    return userResult.data;
  } catch (error) {
    console.error(error);
  }
};
export const updateUsers = async (userId: string, payload: string) => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify({ status: payload })
    });
    revalidateTag("users");
    return res.json();
  } catch (error: unknown) {
    console.log({ errorInUpdateUser: error });
  }
};

export const fetchUsersByRole = async (role: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/users?role=${role}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      }
    });
    const data: IResponse<{
      data: TUser[];
      meta: IMeta;
    }> = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error; // Re-throw so caller can catch if needed
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/auth/change-password`, {
      method: "POST", // usually password updates use PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    });

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    const data = await response.json();
    return data; // or data.message if your API sends a success message
  } catch (error) {
    console.error("Error changing password:", error);
    throw error; // Re-throw so caller can catch if needed
  }
};

export const forgetPassword = async () => {};
