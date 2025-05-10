"use server";
import config from "@/config";
import { IResponse, PostsResponse, PostStatus, TPost } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getAllPosts = async () => {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(`${config.backend_url}/posts`, {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Posts");
    }

    const postsResult = await res.json();
    revalidateTag("Posts");
    return postsResult.data;
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = async (params: { postId: string; status: PostStatus; rejectReason?: string }) => {
  const session = await getServerSession(authOptions);
  const { postId, status, rejectReason } = params;
  const payload: Partial<TPost> = { status };
  if (rejectReason && status === PostStatus.REJECTED) {
    payload["rejectReason"] = rejectReason;
  }
  try {
    const res = await fetch(`${config.backend_url}/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify(payload)
    });
    revalidateTag("Posts");

    const result: IResponse<PostsResponse> = await res.json();
    console.log(result);
    return result;
  } catch (error: unknown) {
    console.log({ updatePostError: error });
  }
};

export const updatePostType = async (userId: string, payload: string): Promise<PostsResponse | string> => {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${config.backend_url}/posts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify({ pType: payload })
    });

    if (!res.ok) {
      throw new Error("Failed to update Post Type");
    }

    const result = await res.json();

    revalidateTag("Posts");
    console.log(result);

    return result;
  } catch (error: unknown) {
    console.log({ updatePostError: error });
    return (error as Error).message;
  }
};
