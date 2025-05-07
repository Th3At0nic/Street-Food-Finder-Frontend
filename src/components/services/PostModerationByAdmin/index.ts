"use server"
import config from "@/config";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getAllPosts = async () => {
    const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/posts`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`, // ✅ Added Bearer here
      },
      next: {
        tags: ["Posts"],
      },
      
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Posts");
    }
   
    const postsResult = await res.json();
   
    return postsResult.data
  } catch (error) {
    console.error(error);
  }
};



export const updatePost = async (userId: string,payload:string): Promise<any> => {
   console.log(userId,payload,"fdsfff");
    const session = await getServerSession(authOptions);
    try {
      const res = await fetch(
        `${config.backend_url}/posts/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({ status: payload }),
        }
      );
      revalidateTag("Posts");

      const result = res.json();
      console.log(result);
      return result
    } catch (error) {}
  };