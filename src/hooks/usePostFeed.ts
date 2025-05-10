"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PostStatus, PostType, TPost, UserRole } from "@/types";
import { fetchPosts } from "@/app/actions/post-actions";
import { useSession } from "next-auth/react";

export function usePostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const initialLoadDone = useRef(false);

  // Function to fetch posts
  const fetchPostsPage = useCallback(
    async (pageNum: number) => {
      if (loading) return;

      setLoading(true);

      try {
        const postType = session?.user.role === (UserRole.PREMIUM_USER || UserRole.ADMIN) ? undefined : PostType.NORMAL;
        const result = await fetchPosts({ page: pageNum, status: PostStatus.APPROVED, postType });
    
        if (pageNum === 1) {
          setPosts(result?.data.data);
        } else {
          setPosts((prev) => [...prev, ...result?.data?.data]);
        }

        setHasMore(result.hasMore);
        setTotalPosts(result.data?.meta?.total);
        setTotalPages(result.data?.meta?.totalPages);

        if (result?.data?.data?.length === 0) {
          console.log("No posts available for page", pageNum);
        }

        return result;
      } catch (error) {
        console.error(`Error fetching posts for page ${pageNum}:`, error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loading, session?.user.role]
  );

  const loadMorePosts = useCallback(() => {
    if (!hasMore || loading) return;

    fetchPostsPage(page).then(() => {
      setPage((prev) => prev + 1);
    });
  }, [fetchPostsPage, hasMore, loading, page]);

  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadInitialPosts = async () => {
      console.log("Loading initial posts...");
      await fetchPostsPage(1);
      setPage(2);
      initialLoadDone.current = true;
    };

    loadInitialPosts();
  }, [fetchPostsPage]);

  const refreshPosts = useCallback(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    initialLoadDone.current = false;

    const refresh = async () => {
      await fetchPostsPage(1);
      setPage(2);
      initialLoadDone.current = true;
    };

    refresh();
  }, [fetchPostsPage]);

  return {
    posts,
    loading,
    hasMore,
    totalPosts,
    currentPage: page - 1,
    totalPages,
    loadMorePosts,
    refreshPosts
  };
}
