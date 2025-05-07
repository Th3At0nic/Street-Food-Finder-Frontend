import { useState, useCallback } from "react";
import { Post } from "@/types";
import { fetchPosts } from "@/app/actions/post-actions";

export function usePostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const result = await fetchPosts(page);
      setPosts((prev) => [...prev, ...result.posts]);
      setPage((prev) => prev + 1);
      setHasMore(result.hasMore);
      setTotalPosts(result.totalPosts);
      setTotalPages(result.totalPages);

      if (result.posts.length === 0 && posts.length === 0) {
        console.log("No posts available");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, posts.length]);

  return {
    posts,
    loading,
    hasMore,
    totalPosts,
    currentPage: page - 1,
    totalPages,
    loadMorePosts
  };
}
