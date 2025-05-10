import { useEffect, useRef, useState } from "react";

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsePaginatedFetchOptions<T> {
  fetchFn: (page: number) => Promise<{ data: T[]; meta: Meta }>;
  getKey?: (item: T) => string | number;
}

export function usePaginatedFetch<T>({ fetchFn, getKey }: UsePaginatedFetchOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const load = async (page: number) => {
    if (loading || page > meta.totalPages) return;
    setLoading(true);
    try {
      const result = await fetchFn(page);
      setItems((prev) => {
        const existing = new Set(prev.map((item) => (getKey ? getKey(item) : JSON.stringify(item))));
        const filteredNew = result.data.filter((item) => !existing.has(getKey ? getKey(item) : JSON.stringify(item)));
        return [...prev, ...filteredNew];
      });
      setMeta(result.meta);
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && meta.page < meta.totalPages) {
        load(meta.page + 1);
      }
    });

    const ref = observerRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.page, meta.totalPages, loading]);

  return {
    items,
    loading,
    observerRef,
    meta
  };
}
