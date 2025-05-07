import { useState, useCallback, useEffect, useRef } from "react";
import { Post } from "@/types";
import { fetchPosts } from "@/app/actions/post-actions";

export function usePostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
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
        const result = await fetchPosts(pageNum);

        if (pageNum === 1) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }

        setHasMore(result.hasMore);
        setTotalPosts(result.totalPosts);
        setTotalPages(result.totalPages);

        if (result.posts.length === 0) {
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
    [loading]
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
