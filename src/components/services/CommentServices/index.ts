"use server";

import config from "@/config";
import { IMeta, IResponse } from "@/types";
import { CommentStatus, IComment } from "@/types/comments.types";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function fetchAllComments(params: {
  postId?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  status?: CommentStatus;
}) {
  const session = await getServerSession(authOptions);
  try {
    const { postId, searchTerm, page = 1, limit = 7, status } = params;
    let apiURL = `${config.backend_url}/comments?page=${page}&limit=${limit}`;
    if (postId) {
      apiURL += `&postId=${postId}`;
    }
    if (searchTerm) {
      apiURL += `&searchTerm=${searchTerm}`;
    }
    if (status) {
      apiURL += `&status=${status}`;
    }
    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: IResponse<{
      data: IComment[];
      meta: IMeta;
    }> = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}
