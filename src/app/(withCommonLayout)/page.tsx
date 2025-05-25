/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import PostCard from "@/components/modules/post/PostCard";
import SearchBox from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ChevronRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchPostCategories,
  fetchTrendingPost,
} from "../actions/post-actions";
import { IMeta, ITrendingPostResponse, TPostCategory } from "@/types";
import { CategoryCard } from "@/components/modules/post/categoryCard";

export default function HomePage() {
  const [trendingPosts, setTrendingPosts] =
    useState<ITrendingPostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [postCategories, setPostCategories] = useState<TPostCategory[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [meta, setMeta] = useState<IMeta>({
    page,
    limit,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingPostsData = await fetchTrendingPost();
        setTrendingPosts(trendingPostsData);
      } catch (error) {
        console.error("Failed to fetch trending posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getPostCategories = async () => {
      setLoading(true);
      try {
        const result = await fetchPostCategories({
          page,
          limit,
        });
        setMeta(result.meta);
        setPostCategories(result.categories);
      } catch (err) {
        console.log("Failed to fetch post categories", err);
      } finally {
        setLoading(false);
      }
    };
    getPostCategories();
  }, [page, limit]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>

        {/* Trending Skeleton */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </section>

        {/* Premium Skeleton */}
        <section className="bg-orange-300 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white space-y-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Discover Hidden Street Food Gems
          </h1>
          <p className=" text-lg mb-8">
            Find, review, and share your favorite street food spots
          </p>

          {/* Search Form */}
          <SearchBox />
        </div>

        {/* Trending Spots */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold ">Trending Posts</h2>
            <Link
              href="/posts"
              className="text-orange-600 hover:text-orange-700 flex items-center"
            >
              See all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {trendingPosts?.data?.map((item) => (
              <PostCard data={item} key={item.pId} />
            ))}
          </div>
        </section>
        {/* Post Category Section */}
        <section className="mb-16">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold ">Post Categories</h2>
          </div>
          <div className=" grid grid-cols-4 gap-4">
            {postCategories?.map((item) => (
              <CategoryCard category={item} key={item?.catId}></CategoryCard>
            ))}
          </div>
        </section>

        {/* Premium Section */}
        <section className="bg-orange-300 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="h-8 w-8 text-orange-600" />
            <h2 className="text-2xl font-semibold">
              {session?.user.role === "PREMIUM_USER"
                ? "Your Premium Access"
                : "Premium Posts"}
            </h2>
          </div>

          {session?.user.role === "PREMIUM_USER" ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Exclusive BBQ Spot
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  You’ve unlocked access to premium locations only available to
                  VIP foodies like you.
                </p>
                <Link href="/posts">
                  <Button variant="secondary">
                    Explore More Premium Spots
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  Thanks for Supporting Us!
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  Enjoy your premium journey — from hidden street gems to chef
                  secrets.
                </p>
                <Link href="/posts">
                  <Button className="bg-white text-orange-600 hover:bg-gray-100">
                    Share a Premium Tip
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                  <div>
                    <h3 className="font-medium mb-1">Secret BBQ Stall</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
                      Hidden Location
                    </div>
                  </div>
                </div>
                <Link href="/subscription-plan">
                  <Button variant="outline" className="w-full">
                    Unlock Premium Spot
                  </Button>
                </Link>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  Become a Premium Food Explorer
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  Get access to exclusive street food spots, premium reviews,
                  and special discounts.
                </p>
                <Link href="/subscription-plan">
                  <Button className="bg-white text-orange-600 hover:bg-gray-100">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
