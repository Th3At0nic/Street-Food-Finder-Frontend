"use server";
import config from "@/config";
import { PostsResponse } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getAllPosts = async () => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/posts`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      next: {
        tags: ["Posts"]
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Posts");
    }

    const postsResult = await res.json();

    return postsResult.data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = async (userId: string, payload: string): Promise<PostsResponse | string> => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/posts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify({ status: payload })
    });
    revalidateTag("Posts");

    const result: PostsResponse = await res.json();
    console.log(result);
    return result;
  } catch (error: unknown) {
    console.log({ updatePostError: error });
    return (error as Error).message;
  }
};
