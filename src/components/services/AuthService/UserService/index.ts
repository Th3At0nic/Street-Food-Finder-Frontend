"use server";

import config from "@/config";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";


export const getAllUsers = async () => {
    const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/users`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`, // ✅ Added Bearer here
      },
      next: {
        tags: ["users"],
      },
      
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
   
    const userResult = await res.json();
   
    return userResult.data
  } catch (error) {
    console.error(error);
  }
};


export const updateUsers = async (userId: number,payload:string): Promise<any> => {
   
    const session = await getServerSession(authOptions);
    try {
      const res = await fetch(
        `${config.backend_url}/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({ status: payload }),
        }
      );
      revalidateTag("users");
      return res.json();
    } catch (error) {}
  };

  export const fetchUsersByRole = async (role: string) => {
     
    const session = await getServerSession(authOptions);
    try {
      const response = await fetch(`${config.backend_url}/users?role=${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw error; // Re-throw so caller can catch if needed
    }
  };
  