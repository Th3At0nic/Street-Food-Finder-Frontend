"use server";

import { Post, PostCategory, PostsResponse } from "@/types";
import config from "@/config";
export async function fetchPosts(
  page: number,
  limit: number = 5
): Promise<{
  posts: Post[];
  hasMore: boolean;
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}> {
  try {
    const response = await fetch(`${config.backend_url}/posts?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const responseData: PostsResponse = await response.json();

    if (!responseData.success) {
      throw new Error(`API error: ${responseData.message}`);
    }

    const { data, meta } = responseData.data;

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
