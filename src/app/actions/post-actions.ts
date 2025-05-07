"use server";
import { getServerSession } from "next-auth";
import { Post, PostCategory, PostsResponse, PostStatus, VoteCountResponse, VoteResponse } from "@/types";
import config from "@/config";
import { authOptions } from "@/utils/authOptions";
export async function fetchPosts(
  page: number,
  limit: number = 5,
  status: PostStatus | null = PostStatus.APPROVED
): Promise<{
  posts: Post[];
  hasMore: boolean;
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}> {
  try {
    const session = await getServerSession(authOptions);
    console.log({ session });
    let queryString = `page=${page}&limit=${limit}`;
    if (status) {
      queryString += `&status=${status}`;
    }
    const response = await fetch(`${config.backend_url}/posts?${queryString}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const responseData: PostsResponse = await response.json();

    if (!responseData.success) {
      throw new Error(`API error: ${responseData.message}`);
    }
    const { data, meta } = responseData.data;
    console.log(data[0], meta);
    return {
      posts: data,
      hasMore: page < meta.totalPages,
      totalPosts: meta.total,
      currentPage: meta.page,
      totalPages: meta.totalPages
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

// fetch post categories
export async function fetchPostCategories(
  page = 1,
  limit = 10
): Promise<{
  categories: PostCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    const response = await fetch(`${config.backend_url}/post-categories?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const responseData = await response.json();
    if (!responseData.success) {
      throw new Error(`API error: ${responseData.message}`);
    }

    const { data, meta } = responseData.data;
    return { categories: data, meta };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function createPost(postFormData: FormData) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`
      },
      body: postFormData
    });
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// fetch comments of a post
export async function fetchPostComments(params: { postId: string; page: number; limit: number }) {
  try {
    const response = await fetch(
      `${config.backend_url}/comments/post/${params.postId}?page=${params.page ?? 1}&limit=${params.limit ?? 10}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// commenting
export async function commentOnPost(params: { postId: string; comment: string }) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/comments/${params.postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment: params.comment })
    });
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// update comment
export async function updateComment(params: { commentId: string; comment: string }) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/comments/${params.commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ comment: params.comment })
    });
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// delete comment
export async function deleteComment(params: { commentId: string }) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/comments/${params.commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`
      }
    });
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// voting
export async function voteOnPost(params: { postId: string; vType: string }) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/votes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
    const result = await response.json();
    console.log({ result });
    return result;
  } catch (error: unknown) {
    throw error;
  }
}

// get user vote on a post
export async function getUserVote(params: { postId: string }) {
  const session = await getServerSession(authOptions);
  try {
    const response = await fetch(`${config.backend_url}/votes/user/${params.postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const result: VoteResponse = await response.json();
    console.log({ result });
    return result.data;
  } catch (error: unknown) {
    throw error;
  }
}

// get vote count on a post
export async function getVoteCounts(params: { postId: string }) {
  try {
    const response = await fetch(`${config.backend_url}/votes/vote-count/${params.postId}`, {
      method: "GET"
    });
    const result: VoteCountResponse = await response.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error: unknown) {
    throw error;
  }
}
